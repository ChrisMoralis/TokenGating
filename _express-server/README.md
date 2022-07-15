# Moralis Token Gating Server

This server project is built using Express to demo Token Gating capabilities using Moralis SDK.

## Getting Started

### 1. Install Dependencies

```sh
# Using NPM
npm i

# Using Yarn
yarn
```

### 2. Add Environment Variables

Create a `.env` file, then fill in the following info with your Moralis server details.

```
MORALIS_APP_ID=xxx
MORALIS_SERVER_URL=xxx
MORALIS_MASTER_KEY=xxx
```

### 3. Run Server

```sh
# Using NPM
npm run start

# Using Yarn
yarn start
```

### 4. Call Secret API

You can use any method to call the `/secret` REST API. Here is an example using CURL.

```sh
curl http://localhost:5454/secret \
    -H 'Content-Type: application/json' \
    -d '{"sessionToken":"<session-token-input>"}'
```

Here's another using fetch.

```
const sessionToken = await Moralis.User.current().get("sessionToken");
const rawResponse = await fetch(`http://localhost:5454/secret`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionToken }),
  });
```

## License

[MIT License](https://github.com/YosephKS/moralis-token-gating-express-server/blob/main/LICENSE)
