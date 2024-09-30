import { CommitCreateEvent, Jetstream } from '@skyware/jetstream';
import fs from 'node:fs';

import { CURSOR_UPDATE_INTERVAL, DID, FIREHOSE_URL, METRICS_PORT, PORT, WANTED_COLLECTION } from './config.js';
import { label, labelerServer } from './label.js';
import logger from './logger.js';
import { startMetricsServer } from './metrics.js';

let cursor = 0;
let cursorUpdateInterval: NodeJS.Timeout;

try {
  logger.info('Trying to read cursor from cursor.txt...');
  cursor = Number(fs.readFileSync('cursor.txt', 'utf8'));
  logger.info(`Cursor found: ${cursor} (${new Date(cursor / 1000).toISOString()})`);
} catch (error) {
  if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
    logger.info(
      `Cursor not found in cursor.txt, setting cursor to: ${cursor} (${new Date(cursor / 1000).toISOString()})`,
    );
    fs.writeFileSync('cursor.txt', cursor.toString(), 'utf8');
  } else {
    logger.error(error);
    process.exit(1);
  }
}

const jetstream = new Jetstream({
  wantedCollections: [WANTED_COLLECTION],
  endpoint: FIREHOSE_URL,
  cursor: cursor,
});

jetstream.on('open', () => {
  logger.info(`Connected to Jetstream at ${FIREHOSE_URL}`);
  cursorUpdateInterval = setInterval(() => {
    if (jetstream.cursor) {
      logger.info(`Cursor updated to: ${jetstream.cursor} (${new Date(jetstream.cursor / 1000).toISOString()})`);
      fs.writeFile('cursor.txt', cursor.toString(), (err) => {
        if (err) logger.error(err);
      });
    }
  }, CURSOR_UPDATE_INTERVAL);
});

jetstream.on('close', () => {
  clearInterval(cursorUpdateInterval);
  logger.info('Jetstream connection closed.');
});

jetstream.on('error', (error) => {
  logger.error(`Jetstream error: ${error.message}`);
});

jetstream.onCreate(WANTED_COLLECTION, (event: CommitCreateEvent<typeof WANTED_COLLECTION>) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (event.commit?.record?.subject?.uri?.includes(DID)) {
    label(event.did, event.commit.record.subject.uri.split('/').pop()!).catch((error: unknown) => {
      logger.error(`Unexpected error labeling ${event.did}: ${error}`);
    });
  }
});

const metricsServer = startMetricsServer(METRICS_PORT);

labelerServer.start(PORT, (error, address) => {
  if (error) {
    logger.error('Error starting server: %s', error);
  } else {
    logger.info(`Labeler server listening on ${address}`);
  }
});

jetstream.start();

function shutdown() {
  setTimeout(() => {
    logger.error('Forcing shutdown...');
    process.exit(1);
  }, 60000);

  logger.info('Shutting down gracefully...');
  jetstream.close();
  labelerServer.stop();
  metricsServer.close();
  clearInterval(cursorUpdateInterval);
  fs.writeFileSync('cursor.txt', cursor.toString(), 'utf8');
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
