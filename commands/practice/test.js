/**
 * Project: Onslaught Discord Bot
 * File: commands/practice/test.js
 * Author: Woofmagic
 * Created: 2025-04-08
 * Last Modified: 2025-04-08
 *
 * Description:
 * `test` is a command that serves as "central testing hub."
 * Here, we allow the user to choose what type of test they
 * want to generate and and practice.
 *
 * Notes:
 *
 * Changelog:
 * - 2025-04-08: Creation of the file.
 * - 2025-04-08: Adapted code to new quiz data structure.
 * - 2025-04-08: We decided to generalize the file for *all* test types.
 */

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { getRandomQuestion } = require('./../../utilities/tests/questionSelector');
const { chooseInterface } = require('./../../utilities/tests/interfaceSelector.js');
const { getMultipleChoiceOptions, buildMultipleChoiceButtons } = require('./../../utilities/tests/formatMultipleChoice.js');
const { awaitFreeResponse } = require('./../../utilities/tests/formatFreeResponse.js');
const { evaluate } = require('./../../utilities/tests/evaluateAnswer.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Test your knowledge.')
		.addStringOption(opt =>
			opt.setName('topic')
			  .setDescription('Choose a topic.')
			  .setRequired(true)
			  .addChoices(
					{ name: 'Philosophy', value: 'philosophy' },
					{ name: 'Internet Technology', value: 'it' },
					{ name: 'Book', value: 'book' },
			  ),
		)
		.addStringOption(opt =>
			opt.setName('booktitle')
			  .setDescription('Choose a book (only used if topic is "book")')
			  .setRequired(false)
			  .addChoices(
					{ name: 'Kant', value: 'kant_2018' },
			  ),
		),
	async execute(interaction) {

		const userSelectedTopic = interaction.options.getString('topic');
		const didUserSelectBookTitle = interaction.options.getString('booktitle');

		if (userSelectedTopic === 'book' && didUserSelectBookTitle === null) {
			return interaction.reply({
				content: 'You must provide a book title in order to test yourself with it.',
			});
		}

		const question = getRandomQuestion(userSelectedTopic, didUserSelectBookTitle);

		const interfaceType = chooseInterface();

		const questionText = question.content.questionText;

		const possibleAnswers = question.content.possibleAnswers;

		const embed = new EmbedBuilder()
			.setTitle(` ${userSelectedTopic} / Difficulty: ${question.content.difficulty}`)
			.setDescription(`"${questionText}"`)
			.setFooter({
				text: interfaceType === 'multiple-choice' ?
					'Multiple-choice question; select an answer within 10 seconds.' :
					'Free-response question; type an answer within 10 seconds.',
			});

		await interaction.reply({
			embeds: [embed],
		});

		if (interfaceType === 'multiple-choice') {
			const options = getMultipleChoiceOptions(possibleAnswers);
			const row = buildMultipleChoiceButtons(options);
			await interaction.editReply({
				components: [row],
			});

			const filter = i => i.user.id === interaction.user.id;
			const collector = interaction.channel.createMessageComponentCollector({
				filter,
				time: 10000,
			});

			collector.on('collect', async i => {
				const selected = i.customId.split('_')[1];
				const correct = evaluate(selected, possibleAnswers);
				await i.update({
					content: correct ? '✅ Correct!' : `❌ Incorrect. Answer: **${possibleAnswers[0]}**`,
					components: [],
					embeds: [],
				});
				collector.stop();
			});

			collector.on('end', collected => {
				if (!collected.size) {
					interaction.editReply({
						content: `⏰ Time's up! Answer: **${possibleAnswers[0]}**`,
						components: [],
						embeds: [],
					});
				}
			});
		}
		else {
			const response = await awaitFreeResponse(interaction, possibleAnswers);
			await interaction.followUp({
				content: response.correct
					? '✅ Correct!'
					: response.response
						? `❌ Incorrect. Answer: **${possibleAnswers[0]}**`
						: `⏰ Time's up! Answer: **${possibleAnswers[0]}**`,
				components: [],
				embeds: [],
			});
		}
	},
};