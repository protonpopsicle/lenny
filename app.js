import 'dotenv/config'
import { Client, Events, GatewayIntentBits } from 'discord.js'
import { selection } from './google.js'

const token = process.env.DISCORD_TOKEN
const prefix = 'lenny'

// Create a new client instance
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages],
			    partials: ['CHANNEL']
			  });

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on('messageCreate', async (message) => {
    // console.log(message);
    if (message.author.bot) return false;
    if (!message.content.toLowerCase().startsWith(prefix)) return false;
    const line = await selection()
    message.channel.send(line);
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
