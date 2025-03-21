import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { selection } from './google.js';

const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error('DISCORD_TOKEN is not set in environment variables');
}
const prefix = 'lenny';

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: ['CHANNEL']
});

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return false;
  if (!message.content.toLowerCase().startsWith(prefix)) return false;
  try {
    const line = await selection();
    if (!line) {
      return message.channel.send('Aw snap, I couldn\'t get a quote right now.');
    }
    await message.channel.send(line);
  } catch (error) {
    console.error('Error in message handler:', error);
  }
});

// Log in to Discord with your client's token
client.login(token);
