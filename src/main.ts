import { CommitCreateEvent, Jetstream } from '@skyware/jetstream';
import fs from 'node:fs';

import { DID, FIREHOSE_URL, METRICS_PORT, WANTED_COLLECTION } from './config.js';
import { label } from './label.js';
import logger from './logger.js';
import { startMetricsServer } from './metrics.js';

let cursor = 0;

let cursorUpdateInterval: NodeJS.Timeout;
let cursorFile: string;

try {
  cursorFile = fs.readFileSync('cursor.txt', 'utf8');
} catch (error) {
  if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
    cursorFile = (BigInt(Date.now()) * 1000n).toString();
    fs.writeFileSync('cursor.txt', cursorFile, 'utf8');
  } else {
    console.error(error);
    process.exit(1);
  }
}

const jetstream = new Jetstream({
  wantedCollections: [WANTED_COLLECTION],
  endpoint: FIREHOSE_URL,
  cursor: cursor.toString(),
});

jetstream.on('open', () => {
  logger.info('Connected to Jetstream');
  cursorUpdateInterval = setInterval(() => {
    console.log(`Cursor updated at ${new Date().toISOString()} to: ${cursor}`);
    fs.writeFile('cursor.txt', cursor.toString(), (err) => {
      if (err) console.log(err);
    });
  }, 10000);
});

jetstream.on('close', () => {
  logger.info('Jetstream connection closed.');
});

jetstream.on('error', (error) => {
  logger.error(`Jetstream error: ${error.message}`);
});

jetstream.onCreate(WANTED_COLLECTION, (event: CommitCreateEvent<typeof WANTED_COLLECTION>) => {
  cursor = event.time_us;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (event.commit?.record?.subject?.uri?.includes(DID)) {
    label(event.did, event.commit.record.subject.uri.split('/').pop()!).catch((error: unknown) => {
      console.error(`Unexpected error labeling ${event.did}:`);
      console.error(error);
    });
  }
});

jetstream.start();

const metricsServer = startMetricsServer(METRICS_PORT);

function shutdown() {
  logger.info('Shutting down gracefully...');
  jetstream.close();
  metricsServer.close();
  clearInterval(cursorUpdateInterval);
  fs.writeFileSync('cursor.txt', cursor.toString(), 'utf8');
  process.exit(0);

  setTimeout(() => {
    logger.error('Forcing shutdown.');
    process.exit(1);
  }, 60000);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
