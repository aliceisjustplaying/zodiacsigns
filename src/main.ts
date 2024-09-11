import { label } from './label.js';
import { DID, RELAY } from './constants.js';
import { EventStream } from './types.js';
import fs from 'node:fs';
import { URL } from 'node:url';
import WebSocket from 'ws';

const subscribe = () => {
  let cursor = 0;
  let intervalID: NodeJS.Timeout;
  let cursorFile = '';

  if (fs.existsSync('cursor.txt')) {
    console.log('Loading cursor from cursor.txt');
    cursorFile = fs.readFileSync('cursor.txt', 'utf8');
  } else {
    const currentTimeInMicroseconds = BigInt(Date.now()) * 1000n;
    cursorFile = currentTimeInMicroseconds.toString();
    fs.writeFileSync('cursor.txt', cursorFile, 'utf8');
    console.log('Created a new cursor.txt with current time in microseconds');
  }

  const relayURL = new URL(RELAY);
  relayURL.searchParams.set('cursor', cursorFile);
  const relay = relayURL.toString();
  console.log(`Connecting to ${relay}`);
  const ws = new WebSocket(relay);
  console.log(`Initiate firehose at cursor ${cursorFile}`);

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

  ws.on('message', (data) => {
    if (data instanceof Buffer) {
      const event: EventStream = JSON.parse(data.toString()) as EventStream;
      cursor = event.time_us;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (event.commit?.record?.subject?.uri?.includes(`${DID}/app.bsky.feed.post`)) {
        label(event.did, event.commit.record.subject.uri.split('/').pop()!)
          .catch((err: unknown) => {
            console.error(err);
          })
          .finally(() => {
            console.log(`Labeling function done for ${event.commit?.record.subject.uri}`);
          });
      }
    }
  });
};

subscribe();
