/**
 * Project: Onslaught Discord Bot
 * File: events/interactionCreate.js
 * Author: Woofmagic
 * Created: 2025-04-07
 * Last Modified: 2025-04-07
 *
 * Description:
 * `interactionCreate` is an event listener that listens to user
 * interactions with the client. This is a complicated listener
 * that is used to listen to commands but *also* other things, like
 * messages.
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
