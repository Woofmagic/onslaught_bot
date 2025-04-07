/**
 * Project: Onslaught Discord Bot
 * File: events/ready.js
 * Author: Woofmagic
 * Created: 2025-04-06
 * Last Modified: 2025-04-06
 *
 * Description:
 * `ready` is an event listener that runs *once*, and it runs
 * when the Discord bot has registered all of its commands and
 * events to the REST API without error.
 *
 * Notes:
 *
 * Changelog:
 * - 2025-04-07: Creation of the file.
 */

// (1): Require relevant modules:
const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: true,
	async execute(client, interaction) {

		if (!client) return;
		if (!interaction) return;
		if (!interaction.isChatInputCommand()) return;

		const commandName = interaction.client.commands.get(interaction.commandName);

		if (!commandName || commandName === null) {
			console.log(`> No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		}
		catch (error) {
			console.log(`> Error in running the command:\n> ${error}`);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}
			else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	},
};
