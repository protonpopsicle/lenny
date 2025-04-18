import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { selection } from './google.js';
import { speak } from './l19.js'

const app = express();
const port = 3000; // Or any other port you prefer

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error('DISCORD_TOKEN is not set in environment variables');
}

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

  let line = null;

  try {
    if (message.content.toLowerCase().startsWith('lenny')) {
      line = await selection();
    } else if (message.content.toLowerCase().startsWith('l19')) {
      line = await speak();
    } else {
      return false;
    }
    if (!line) {
      line = 'Aw snap, I couldn\'t speak right now.';
    }
    await message.channel.send(line);
  } catch (error) {
    console.error('Error in message handler:', error);  
  }
});

// Log in to Discord with your client's token
client.login(token);
    
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'build')));
    
// Optional: Handle requests for the root path ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
    
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});