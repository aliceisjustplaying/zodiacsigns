import { AppBskyFeedLike } from '@atproto/api';
import { Firehose } from '@skyware/firehose';
import { label } from './label.js';
import { DID } from './constants.js';
import fs from 'node:fs';

const subscribe = () => {
  let cursorFirehose = 0;
  let intervalID: NodeJS.Timeout;
  let cursor: string | undefined = undefined;

  if (fs.existsSync('cursor.txt')) {
    console.log('Loading cursor from cursor.txt');
    cursor = fs.readFileSync('cursor.txt', 'utf8');
  } else {
    fs.writeFileSync('cursor.txt', '', 'utf8');
    console.log('Created new empty cursor.txt file, as it did not exist');
  }

  const firehose = new Firehose({ cursor });
  if (cursor) console.log(`Initiate firehose at cursor ${cursor}`);

  firehose.on('error', ({ cursor, error }) => {
    // this is a noisy bug with brid.gy, ignore it for now
    if (!(error.name === 'RangeError' && error.message.includes('Could not decode varint'))) {
      console.error(`Firehose errored on cursor: ${cursor}`, error);
    }
  });

  firehose.on('open', () => {
    intervalID = setInterval(() => {
      const timestamp = new Date().toISOString();
      console.log(`${timestamp} cursor: ${cursorFirehose}`);
      fs.writeFile('cursor.txt', cursorFirehose.toString(), (err) => {
        if (err) console.error(err);
      });
    }, 60000);
  });

  firehose.on('close', () => {
    clearInterval(intervalID);
  });

  firehose.on('commit', (commit) => {
    cursorFirehose = commit.seq;
    commit.ops.forEach((op) => {
      if (op.action !== 'delete' && AppBskyFeedLike.isRecord(op.record)) {
        if (op.record.subject.uri.includes(DID)) {
          if (op.record.subject.uri.includes('app.bsky.feed.post')) {
            label(commit.repo, op.record.subject.uri.split('/').pop()!).catch((err: unknown) => {
              console.error(err);
            });
          }
        }
      }
    });
  });

  firehose.start();
};

subscribe();
