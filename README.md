## Configuration

Run `npx @skyware/labeler setup` to convert an existing account into a labeler.

Copy the `.env.example` file to `.env` and fill in the values:

```Dotenv
DID = "did:plc:xxx"
SIGNING_KEY = "xxx"
BSKY_IDENTIFIER = "xxx"
BSKY_PASSWORD = "xxx"
PORT = 4002
RELAY = "ws://localhost:6008/subscribe"
```

A `cursor.txt` also needs to be present with the time in microseconds. If it doesn't exist, it will be created with the current time.

You can create/update all labels at once by running `npx tsx src/set-labels.ts` once you filled out `src/constants.ts` with the related post rkeys, label IDs and so on.

Alternatively, you can use `npx @skyware/labeler label add` and edit `src/constants.ts` after.

The server connects to [Jetstream](https://github.com/ericvolp12/jetstream) which provides a WebSocket endpoint that emits ATProto events in JSON. There is a public instance available at `wss://jetstream.atproto.tools/subscribe`.

The server has to be reachable outside your local network using the URL you provided during the account setup (typically, using a reverse proxy such as [Caddy](https://caddyserver.com/)):

```Caddyfile
labeler.example.com {
	reverse_proxy 127.0.0.1:4002
}
```

## Installation & Usage

```sh
pnpm i
```

```sh
pnpm start
```
