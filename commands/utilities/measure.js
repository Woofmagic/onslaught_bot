/**
 * Project: Onslaught Discord Bot
 * File: commands/utilities/measure.js
 * Author: Woofmagic
 * Created: 2025-04-07
 * Last Modified: 2025-04-07
 *
 * Description:
 * `measure` is a command that is supposed to measure the latency
 * of the Discord bot, i.e. ascertain if there are connectivity issues.
 *
 * Notes:
 *
 * Changelog:
 * - 2025-04-07: Creation of the file.
 */

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('measure')
		.setDescription('Measure my latency.'),
	async execute(interaction) {
		await interaction.reply('I am here.');
	},
};