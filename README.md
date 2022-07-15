# Token Gating Application

This is a simple demo for using Moralis SDK for token gating website content based on NFT ownership. The front end is static HTML and vanilla JS connected to Moralis SDK and uses Moralis authentication (requiring a Moralis server). I also run a node JS server for the backend (express). The backend checks if a user is authenticated with a valid session token, then it runs Moralis a Web3API call to check the user's NFT assets. If the user owns the asset, content is rendered from main.js. The front-end was put together very quickly, it's not re-factored, just a quick mock up site.

## Quickstart

1. Install npm packages
2. Update Moralis server credentials in main.js and .env (express server)
3. Edit the Moralis API code
4. Run server (cd into express directory and npm start)
5. Run application (I used the LiveServer extension)

## Instructions

- Make sure node js is installed on your system
- Open a terminal or command prompt or power shell
- cd into the '\_express-server' directory
- run 'npm install' to load all the server dependencies (or yarn equivalent)
- go into the .env file and enter your moralis credentials
- npm start to run the server (or yarn equivalent)
- check out the Moralis documentation to choose the endpoint you want to use
- run the index.html using liveserver or a python webserver

I have configured the express server to run on port 5454
