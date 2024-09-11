import { label } from './label.js';
import { DID, RELAY } from './constants.js';
import { EventStream } from './types.js';
import fs from 'node:fs';
import { URL } from 'node:url';
import WebSocket from 'ws';

const MAX_RETRIES = 10;
const INITIAL_DELAY = 1000;
const MAX_DELAY = 60000;

const connectWithBackoff = (url: string, onMessage: (data: Buffer) => void) => {
  let retries = 0;
  let ws: WebSocket;

  const connect = () => {
    ws = new WebSocket(url);

    ws.on('open', () => {
      console.log(`Connected to ${url}`);
      retries = 0;
    });

    ws.on('message', (data) => {
      if (data instanceof Buffer) {
        onMessage(data);
      }
    });

    ws.on('close', () => {
      if (retries < MAX_RETRIES) {
        const delay = Math.min(INITIAL_DELAY * Math.pow(2, retries), MAX_DELAY);
        console.log(`Connection closed. Reconnecting in ${delay}ms... (Attempt ${retries + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          retries++;
          connect();
        }, delay);
      } else {
        console.error('Max retries reached. Stopping reconnection attempts.');
      }
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  };

  connect();
  return () => {
    ws.close();
  };
};

const subscribe = () => {
  let cursor = 0;
  let intervalID: NodeJS.Timeout;

  const cursorFile = fs.existsSync('cursor.txt')
    ? fs.readFileSync('cursor.txt', 'utf8')
    : (BigInt(Date.now()) * 1000n).toString();

  if (!fs.existsSync('cursor.txt')) {
    fs.writeFileSync('cursor.txt', cursorFile, 'utf8');
    console.log('Created a new cursor.txt with current time in microseconds');
  } else {
    console.log('Loading cursor from cursor.txt');
  }

  const relayURL = new URL(RELAY);
  relayURL.searchParams.set('cursor', cursorFile);
  const relay = relayURL.toString();
  console.log(`Connecting to ${relay}`);

  const closeConnection = connectWithBackoff(relay, (data) => {
    const event: EventStream = JSON.parse(data.toString()) as EventStream;
    cursor = event.time_us;
    if (event.commit?.record.subject.uri.includes(`${DID}/app.bsky.feed.post`)) {
      label(event.did, event.commit.record.subject.uri.split('/').pop()!)
        .catch((err: unknown) => {
          console.error('Error in label function:', err);
        })
        .finally(() => {
          console.log(`Labeling function done for ${event.commit?.record.subject.uri}`);
        });
    }
  });

  // eslint-disable-next-line prefer-const
  intervalID = setInterval(() => {
    console.log(`${new Date().toISOString()}: ${cursor}`);
    fs.writeFile('cursor.txt', cursor.toString(), (err) => {
      if (err) console.error('Error writing to cursor.txt:', err);
    });
  }, 60000);

  return () => {
    clearInterval(intervalID);
    closeConnection();
  };
};

subscribe();
