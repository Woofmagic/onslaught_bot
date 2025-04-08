/**
 * Project: Onslaught Discord Bot
 * File: commands/practice/philosophy.js
 * Author: Woofmagic
 * Created: 2025-04-08
 * Last Modified: 2025-04-08
 *
 * Description:
 * `philosophy` is a practice command that is designed to test a
 * user's knowledge of various pieces of philosophy. This will
 * include knowledge of quotations.
 *
 * Notes:
 *
 * Changelog:
 * - 2025-04-08: Creation of the file.
 */

const { SlashCommandBuilder } = require('discord.js');

const questions = require('../statics/quizContents/philosophy/test.json').multipleChoice;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('philosophy')
		.setDescription('Test your knowledge of philosophy.'),
	async execute(interaction) {
		const randomlySelectedQuestion = questions[Math.floor(Math.random() * questions.length)];

		const row = new ActionRowBuilder().addComponents(
			randomlySelectedQuestion.options.map((option, index) =>
				new ButtonBuilder()
					.setCustomId(`ans_${option}`)
					.setLabel(option)
					.setStyle(ButtonStyle.Primary),
			),
		);

		const embed = new EmbedBuilder()
			.setTitle('Select the philosopher who wrote:')
			.setDescription(`"_${randomlySelectedQuestion.quote}_"`)
			.setFooter({ text: 'Select the correct philosopher. You have 10 seconds!' });

		await interaction.reply({ embeds: [embed], components: [row] });

		const collector = interaction.channel.createMessageComponentCollector({
			filter: i => i.user.id === interaction.user.id,
			time: 10000,
		});

		collector.on('collect', async i => {
			const selected = i.customId.split('_')[1];
			const correct = selected === randomlySelectedQuestion.correct;

			await i.update({
				content: correct ? '✅ Correct!' : `❌ Wrong. The correct answer is: **${randomlySelectedQuestion.correct}**`,
				components: [],
				embeds: [],
			});
			collector.stop();
		});

		collector.on('end', collected => {
			if (!collected.size) {
				interaction.editReply({ content: `⏰ Time's up! The correct answer was: **${randomlySelectedQuestion.correct}**`, components: [], embeds: [] });
			}
		});
	},
};