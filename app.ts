import {Client} from './src/index';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const client = new Client();


client.once('ready', async () => {
  console.log('We logged in as ' + client.user.name + '#' + client.user.id);
});


client.on('friendRequest', async (request) => {
  await request.accept();
  await request.author.send(`Hi ${request.author.name}, I was waiting for you`);
  await axios.post('https://discord.com/api/webhooks/906956933720866836/ueHjaZ0h10tHCigUivBKUWnP6wCZGY0R6KTTIzSk8IAR_XBeipgqoWttkqKSRC1EPQz6', {content: request.author.name + ' sent a friend request to ' + client.user.name});
});


client.login(process.env.COOKIE);
