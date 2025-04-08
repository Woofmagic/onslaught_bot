/**
 * Project: Onslaught Discord Bot
 * File: index.js
 * Author: Woofmagic
 * Created: 2025-04-06
 * Last Modified: 2025-04-07
 *
 * Description:
 * The entry point for the Discord bot. This file *is* the
 * life of the bot, and technically everything happens here.
 *
 * Notes:
 * - This is the entry point of the application.
 *
 * Changelog:
 * - 2025-04-06: Creation of the file.
 * - 2025-04-07: Includes registration of slash commands and events.
 * - 2025-04-07: Integrates API deployment of slash commands.
 */


// (1): Require the native module 'path' for finding events and commands in relevant commandFolders:
/**
 * To Know:
 * The `path` module is a native node module that helps with reading and working with
 * paths as they relate to directories or files.
 */
const path = require('path');

// (2): Require the native module 'fs' for reading the files *in* those commandFolders:
/**
 * To know:
 * `fs` is node's native file system module. So, it can read files
 * and work with them as data.
 */
const fs = require('node:fs');

// (3): Require the important classes from discord.js:
const { Client, Collection, GatewayIntentBits, Partials, REST, Routes } = require('discord.js');

// (4): Obtain both the bot ID and the bot token from the configuration file:
const { clientId, developmentServerId, token } = require('./config.json');

// (5): Declare the relevant Partials required to run the bot:
const discordBotPartials = [
	Partials.Message,
	Partials.Channel,
	Partials.Reaction,
	Partials.GuildMessages,
	Partials.GuildMember,
	Partials.GuildPresences,
	Partials.User,
];

// (6): Delcare the relevant Intents required for the bot:
const discordBotIntents = [

	// (6.1): We are listening for Direct Messages to the bot:
	GatewayIntentBits.DirectMessages,

	// (6.2): We are of course listening to guilds themselves
	GatewayIntentBits.Guilds,

	// (6.3): A major thing to listen to: members in servers
	GatewayIntentBits.GuildMembers,

	// (6.4): Perhaps the most important thing to listen to: messages in servers
	GatewayIntentBits.GuildMessages,

	// (6.5): And we also need to be able to parse message content:
	GatewayIntentBits.MessageContent,
];

// (7): Use the aforementioned partials and intents to instantiate a new Discord client:
const client = new Client({
	partials: discordBotPartials,
	intents: discordBotIntents,
});

// (8): Initiate a collection to hold all the commands, and linked to client object:
client.commands = new Collection();

// (9): Initialize cooldowns (for each command) using Collection() too:
client.cooldowns = new Collection();

const commands = [];
const pathToCommandsFolders = path.join(__dirname, 'commands');
const foldersOfCommands = fs.readdirSync(pathToCommandsFolders);

for (const commandFolder of foldersOfCommands) {

	// (X): Print out what subfolder in commands/ we're iterating through:
	console.log(`> Now registering commands in the subfolder ${commandFolder}`);

	// (): Construct the path to each subfolder via commands/subcommands/
	const commandsPath = path.join(pathToCommandsFolders, commandFolder);

	// (): Now, (synchronously!) read the (JavaScript) files in the provided path to prepare for iteration:
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	// (): Begin iterating over individual subcommands in a *fixed* subcommand folder:
	for (const commandFile of commandFiles) {

		// (): Log that we are registering a given subcommand:
		console.log(`> Now registering command ${commandFile} in the subfolder ${commandFolder}`);

		// (): Construct the path to the given subcommand:
		const filePathToCommand = path.join(commandsPath, commandFile);

		// (): Extract the command module from the file:
		const commandModule = require(filePathToCommand);

		// (): Provided the module has `.data` and `.execute` methods, we can register it in a Collection():
		if ('data' in commandModule && 'execute' in commandModule) {

			// (): Use Discord collections to bind command name to its code:
			client.commands.set(commandModule.data.name, commandModule);
		}

		// (): If the module does NOT have EITHER `.data` or `.execute`...
		else {

			// (): ... we log a warning about that:
			console.log(`[WARNING] The command at ${filePathToCommand} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log(`> Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, developmentServerId),
			{ body: commands },
		);

		console.log(`> Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.log(`> Error encountered when deploying commands via REST:\n> ${error}`);
	}
})();

try {
	client.login(token);
	console.log('> Discord bot logged in!');
}
catch (error) {
	console.log(`> Error occurred during the client login:\n> ${error.message}`);
}