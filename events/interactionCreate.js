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
const { Events, MessageFlags } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {

		if (!interaction) return;
		if (!interaction.isChatInputCommand()) return;

		const commandReference = interaction.client.commands.get(interaction.commandName);

		if (!commandReference || commandReference === null) {
			console.log(`> No command matching ${interaction.commandReference} was found.`);
			return;
		}

		try {
			await commandReference.execute(interaction);
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
