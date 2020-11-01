const botConfig = require('./config/bot.json');
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(botConfig.token);

bot.on('ready', () => {
  console.log(`bot is ready: ${bot.user.tag}`);
});

bot.on('message', msg => {
  console.log(`bot received message: ${msg}`);
});