
<h1 align="center">
    <img src="https://i.imgur.com/5scWO9l.png" alt="boblox.ts" width="500"/>
    <br>
</h1>

<h4 align="center">Interact in real-time with the Roblox API.</h4>
<h4 align="center">boblox.ts is still in alpha
<br>
<br>
<p align="center">
    <a href="https://github.com/google/eslint-config-google"><img src="https://img.shields.io/badge/code%20style-google-blue?style=flat-square" alt="JavaScript Style Guide"/></a>
    <a href="https://npmjs.org/boblox.ts"><img src="https://img.shields.io/npm/v/boblox.ts.svg?style=flat-square" alt="NPM package"/></a>
</p>

## Installation

To install, just run this command:
```bash
$ npm install boblox.ts
```

## Friend Example
```javascript
const dotenv = require('dotenv');
dotenv.config();
const boblox = require('boblox.ts');
const client = new boblox.Client();

client.on('ready', () => {
	console.log(`We have logged in as ${client.user.name}#${client.user.id}`);
});

client.on('friendRequest', async (fr) => {
	await fr.accept();
	console.log('We have accepted ' + fr.author.name + '\'s friend request!'); 
)});
client.login(process.env.COOKIE);
```
## Message Example
```javascript
const dotenv = require('dotenv');
dotenv.config();
const boblox = require('boblox.ts');
const client = new boblox.Client();

client.on('ready', () => {
	console.log(`We have logged in as ${client.user.name}#${client.user.id}`);
});

client.on('messageCreate', async (msg) => {
	await message.reply('You sent this: ' + msg.content);
});

client.on('typingStart', async (typing) => {
	await typing.conversation.send(`What are you typing, ${typing.author.name}?`);
});
client.login(process.env.COOKIE);
```