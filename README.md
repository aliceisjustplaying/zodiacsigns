## Configuration

Run `npx @skyware/labeler setup` to convert an existing account into a labeler.

Copy the `.env.example` file to `.env` and fill in the values:

```Dotenv
DID = "did:plc:xxx"
SIGNING_KEY = "xxx"
```

A `cursor.txt` also needs to be present. It can be left empty, and will update the file every minute with a new cursor.

You can create all labels at once by running `npx tsx src/set-labels.ts` once you filled out `src/constants.ts` with the related post rkeys and label IDs.

Alternatively, you can use `npx @skyware/labeler label add` and edit `src/constants.ts` after.

The server has to be reachable outside your local network using the URL you provided during the account setup (typically, using a reverse proxy such as [Caddy](https://caddyserver.com/)):

```Caddyfile
labeler.example.com {
	reverse_proxy 127.0.0.1:4001
}
```

## Installation & Usage

```sh
pnpm i
```

```sh
pnpm start
```
