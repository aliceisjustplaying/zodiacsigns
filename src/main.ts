import { label } from './label.js';
import { DID, RELAY } from './constants.js';
import { EventStream } from './types.js';
import fs from 'node:fs';
import WebSocket from 'ws';

const subscribe = () => {
  let cursor = 0;
  let intervalID: NodeJS.Timeout;
  const cursorFile = fs.readFileSync('cursor.txt', 'utf8');
  const relay = cursorFile ? RELAY.concat('&cursor=', cursorFile) : RELAY;
  console.log(`Connecting to ${relay}`);
  const ws = new WebSocket(relay);
  if (cursorFile) console.log(`Initiate firehose at cursor ${cursorFile}`);

  ws.on('error', (err) => {
    console.log('ws.on(error)');
    console.error(err);
  });

  ws.on('open', () => {
    console.log('ws.on(open)');
    intervalID = setInterval(() => {
      console.log(`${new Date().toISOString()}: ${cursor}`);
      fs.writeFile('cursor.txt', cursor.toString(), (err) => {
        if (err) console.log(err);
      });
    }, 60000);
  });

  ws.on('close', () => {
    console.log('ws.on(close)');
    clearInterval(intervalID);
  });

  ws.on('message', (data) => {
    console.log('ws.on(message)');
    if (data instanceof Buffer) {
      const event: EventStream = JSON.parse(data.toString()) as EventStream;
      cursor = event.time_us;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (event.commit?.record?.subject?.uri?.includes(`${DID}/app.bsky.feed.post`)) {
        label(event.did, event.commit.record.subject.uri.split('/').pop()!).catch((err: unknown) => {
          console.error(err);
        });
      }
    }
  });
};

subscribe();
