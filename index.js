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
 * - 2025-04-13: Added Winston logger.
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

// (4): Import the Winston Logger:
const { logInformation, logError, logWarning } = require('./logger');

const filePath = path.basename(__filename);

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
	logInformation(filePath, `> Now registering commands in the subfolder ${commandFolder}`);

	// (): Construct the path to each subfolder via commands/subcommands/
	const commandsPath = path.join(pathToCommandsFolders, commandFolder);

	// (): Now, (synchronously!) read the (JavaScript) files in the provided path to prepare for iteration:
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	// (): Begin iterating over individual subcommands in a *fixed* subcommand folder:
	for (const commandFile of commandFiles) {

		// (): Log that we are registering a given subcommand:
		logInformation(filePath, `> Now registering command ${commandFile} in the subfolder ${commandFolder}`);

		// (): Construct the path to the given subcommand:
		const filePathToCommand = path.join(commandsPath, commandFile);

		// (): Extract the command module from the file:
		const commandModule = require(filePathToCommand);

		// (): Provided the module has `.data` and `.execute` methods, we can register it in a Collection():
		if ('data' in commandModule && 'execute' in commandModule) {

			// (): Use Discord collections to bind command name to its code:
			client.commands.set(commandModule.data.name, commandModule);

			// (): We also push to the array a JSON representation of the module to use in REST API later:
			commands.push(commandModule.data.toJSON());
		}

		// (): If the module does NOT have EITHER `.data` or `.execute`...
		else {

			// (): ... we log a warning about that:
			logWarning(filePath, `The command at ${filePathToCommand} is missing a required "data" or "execute" property.`);
		}
	}
}

// (): Find the path that contains the events that drive the bot:
const eventsPath = path.join(__dirname, 'events');

// (): Find (and read synchronously!) the (JavaScript!) files *in* that directory that we found above:
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// (): Begin iterating over each event to register it:
for (const file of eventFiles) {

	// (): Log that we are registering a given subcommand:
	logInformation(filePath, `> Now registering event ${file} in the events folder ${eventsPath}`);

	// (): Obtain the given file corresponding to a single event:
	const filePathToEvent = path.join(eventsPath, file);

	// (): Unpack the module by reading its path and requiring it:
	const event = require(filePathToEvent);

	// (): read the `.once` property, and if it is true...
	if (event.once) {

		// (): ... add this event to the client accordingly:
		client.once(event.name, (...args) => event.execute(...args));
	}

	// (): If the module's `.once` property is false or not specified...
	else {

		// (): ... add  this event to the client via `.on`, which binds a listener:
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// (): Instantiate discord.js's REST API to push commands:
const restAPI = new REST().setToken(token);

// (): Define an API method inside an IIFE:
(async () => {

	// (): Set up the try part of this block:
	try {
		logInformation(filePath, `> Started refreshing ${commands.length} application (/) commands.`);

		// (): Asynchronously PUT slash command data to: `/applications/{application.id}/guilds/{guild.id}/commands`:
		const data = await restAPI.put(
			Routes.applicationGuildCommands(
				applicationId = clientId,
				guildId = developmentServerId),
			{
				body: commands,
			},
		);

		// (): Log if it was successful:
		logInformation(filePath, `> Successfully reloaded ${data.length} application (/) commands.`);
	}

	// (): If there's an error in the request...
	catch (error) {

		// (): ...log the issue, but we will handle this with something better later:
		logError(filePath, `> Error encountered when deploying commands via REST:\n> ${error}`);
	}
})();

try {
	client.login(token);
	logInformation(filePath, '> Discord bot logged in!');
}
catch (error) {
	logError(filePath, `> Error occurred during the client login:\n> ${error.message}`);
}