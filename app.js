import 'dotenv/config'
import { Client, Events, GatewayIntentBits } from 'discord.js';

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

client.on('messageCreate', message => {
    console.log(message);
    if (message.author.bot) return false;
    if (message.content.indexOf(prefix) !== 0) return;
    message.channel.send("Hello there!");
});

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
