import { label } from './label.js';
import { DID, RELAY } from './constants.js';
import { EventStream } from './types.js';
import fs from 'node:fs';
import { URL } from 'node:url';
import WebSocket from 'ws';

const subscribe = () => {
  let cursor = 0;
  let intervalID: NodeJS.Timeout;
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

  const relayURL = new URL(RELAY);
  relayURL.searchParams.set('cursor', cursorFile);
  const ws = new WebSocket(relayURL.toString());
  console.log(`Connected to Jetstream at cursor ${cursorFile}`);

  ws.on('error', (err) => {
    console.error(err);
  });

  ws.on('open', () => {
    intervalID = setInterval(() => {
      console.log(`${new Date().toISOString()}: ${cursor}`);
      fs.writeFile('cursor.txt', cursor.toString(), (err) => {
        if (err) console.log(err);
      });
    }, 60000);
  });

  ws.on('close', () => {
    clearInterval(intervalID);
  });

  ws.on('message', (data: WebSocket.RawData) => {
    if (data instanceof Buffer) {
      const event: EventStream = JSON.parse(data.toString()) as EventStream;
      cursor = event.time_us;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (event.commit?.record?.subject?.uri?.includes(`${DID}/app.bsky.feed.post`))
        label(event.did, event.commit.record.subject.uri.split('/').pop()!).catch((error: unknown) => {
          console.error(`Unexpected error labeling ${event.did}:`);
          console.error(error);
        });
    }
  });
};

subscribe();
