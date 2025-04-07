/**
 * Project: Onslaught Discord Bot
 * File: index.js
 * Author: Woofmagic
 * Created: 2025-04-06
 * Last Modified: 2025-04-06
 * 
 * Description:
 *   The entry point for the Discord bot.
 * 
 * Notes:
 * - This is the entry point of the application.
 * 
 * Changelog:
 * - 2025-04-06: Creation of the file.
 * 
 */


// (1): Require relevant modules:

// (1.1): Require the native module 'path' for finding events and commands in relevant folders:
const path = require('path');

// (1.2): Require the native module 'fs' for reading the files *in* those folders:
const fs = require('node:fs');

// (1.3): Require the important classes from discord.js:
const { Client, GatewayIntentBits, Partials, } = require('discord.js');

// (2): Obtain both the bot ID and the bot token from the configuration file:
const { clientId, token } = require('./config.json');

// (6): Use the aforementioned partials and intents to instantiate a new Discord client:
const client = new Client({
    partials: discordBotPartials,
    intents: discordBotIntents
});

try {
    client.login(token);
    logInfo(filePath, '> Discord bot logged in!');
} catch (error) {
    logError(filePath, `Error occurred: ${error.message}`);
}