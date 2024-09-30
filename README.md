## Prerequisites

- [Node.js](https://nodejs.org/) 21 or later
- [Bun](https://bun.sh/)

## Setup

Clone the repo and run `bun i` to install the dependencies. This project uses [Bun](https://bun.sh/) for package management.

Run `bunx @skyware/labeler setup` to convert an existing account into a labeler. You can exit after converting the account; there's no need to add the labels with the wizard. We'll do that from code.

Copy the `.env.example` file to `.env` and fill in the values:

```Dotenv
DID=did:plc:xxx
SIGNING_KEY=xxx
BSKY_IDENTIFIER=xxx
BSKY_PASSWORD=xxx
PORT=4002
METRICS_PORT=4102
FIREHOSE_URL=wss://jetstream.atproto.tools/subscribe
CURSOR_UPDATE_INTERVAL=10000
```

A `cursor.txt` file containing the time in microseconds also needs to be present. If it doesn't exist, it will be created with the current time.

Fill out `src/constants.ts` with the related post rkeys ([record keys](https://atproto.com/specs/record-key)), label IDs and so on, then run `bunx tsx src/set-labels.ts` to create/update all labels at once.

Alternatively, use `bunx @skyware/labeler label add` and edit `src/constants.ts` after.

The server connects to [Jetstream](https://github.com/bluesky-social/jetstream), which provides a WebSocket endpoint that emits ATProto events in JSON. There is a public instance available at `wss://jetstream.atproto.tools/subscribe`.

The server needs to be reachable outside your local network using the URL you provided during the account setup (typically using a reverse proxy such as [Caddy](https://caddyserver.com/)):

```Caddyfile
labeler.example.com {
	reverse_proxy 127.0.0.1:4002
}
```

Metrics are exposed on the defined `METRICS_PORT` for [Prometheus](https://prometheus.io/). [This dashboard](https://grafana.com/grafana/dashboards/11159-nodejs-application-dashboard/) can be used to visualize the metrics in [Grafana](https://grafana.com/grafana/).

Start the project with `bun run start`.
