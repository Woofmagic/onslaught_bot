/**
 * Project: Onslaught Discord Bot
 * File: commands/utilities/user.js
 * Author: Woofmagic
 * Created: 2025-04-07
 * Last Modified: 2025-04-07
 *
 * Description:
 * `user` is a command does nothing more than
 * read some properties from discord.js's User() class.
 *
 * Notes:
 *
 * Changelog:
 * - 2025-04-07: Creation of the file.
 */

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Who are you to me.'),
	async execute(interaction) {
		await interaction.reply(`You are: ${interaction.user.username}.`);
	},
};
