<h1 align="center">
    <img src="https://i.imgur.com/5scWO9l.png" alt="boblox.ts" width="500"/>
    <br>
</h1>


<h4 align="center">boblox.ts is still in alpha
<br>
<br>
<p align="center">
    <a href="https://npmjs.org/boblox.ts"><img src="https://img.shields.io/npm/v/boblox.ts.svg?style=flat-square" alt="NPM package"/></a>
    <a href="https://discord.gg/Jpg5HSax"><img src="https://img.shields.io/discord/892801942974263326?style=flat-square&label=discord" alt="Join our discord server!"></a>
    <a href="https://npmjs.org/boblox.ts"><img src="https://img.shields.io/npm/dt/boblox.ts?style=flat-square"></a>
</p>

<p align="center">
  <a href="#about">About</a> •
  <a href="#installation">Installation</a> •
  <a href="#quickstart">Quickstart</a> •
  <a href="https://thefakewater.github.io/boblox.ts/">Documentation</a> •
  <a href="#license">License</a>
</p>

## About
boblox.ts is a object-oriented [NodeJS](https://nodejs.org/) module which allows you to interact with the [Roblox API](https://roblox.com).

## Prerequisites
- [Node.js](https://nodejs.org/en/download/current/)

## Installation

Install boblox.ts
```bash
# Using npm:
$ npm install noblox.js

# Using yarn:
$ yarn add noblox.js
```

## Quickstart
1) Get your `.ROBLOSECURITY` cookie.
2. Write code
    ```js
    const boblox = require('boblox.ts');
    const client = new boblox.Client();
    
    client.on('ready', async () => {
      console.log('We logged in as ' + client.user.name);
      await client.user.declineAll();
    });
    client.login('_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_');
    ```

Note: use [dotenv](https://www.npmjs.com/package/dotenv) to hide your cookie from your source code.

## License

[GPL-3.0 License](https://github.com/thefakewater/boblox.ts/blob/main/LICENSE)
