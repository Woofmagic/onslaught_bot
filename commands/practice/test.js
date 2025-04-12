/**
 * Project: Onslaught Discord Bot
 * File: commands/practice/test.js
 * Author: Woofmagic
 * Created: 2025-04-08
 * Last Modified: 2025-04-12
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
 * - 2025-04-12: Introduced subcommands for better modularity
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
		// https://discord.com/developers/docs/reference#locales
		.setNameLocalizations({
			'zh-CN': 'kaoshi',
			'ja': 'shiken',
		})
		.setDescription('Test your knowledge.')
		.addSubcommandGroup((group) =>
			group
				.setName('stem')
				.setDescription('Practice your knowledge of topics in STEM.')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('internet_technology')
						.setDescription('Test your understanding of topics in IT.'),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('philosophy')
						.setDescription('Test your understanding philosophy.'),
				),
		)
		.addSubcommandGroup((group) =>
			group
				.setName('literature')
				.setDescription('Practice your knowledge of various written works.')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('books')
						.setDescription('Test your knowledge of books.')
						.addStringOption((option) =>
							option
								.setName('booktitle')
								.setDescription('What action should be taken with the users points?')
								.setRequired(true)
								.addChoices(
									{ name: 'Kant', value: 'kant_korner' },
								),
						),
				),
		),
	async execute(interaction) {

		const chosenSubcommand = interaction.options.getSubcommand();

		if (chosenSubcommand === 'internet_technology') {
			console.log('> User chose to practice IT topics!');

		}
		else if (chosenSubcommand === 'philosophy') {
			console.log('> User chose to practice philosophy topics!');
		}
		else if (chosenSubcommand === 'literature') {
			console.log('> User chose to practice literature topics!');

			if (didUserSelectBookTitle === null) {
				return interaction.reply({
					content: 'You must provide a book title in order to test yourself with it.',
				});
			}
		}
		else {
			return interaction.reply({
				content: 'I did not understand your test selection. Please try again.',
			});
		}

		const didUserSelectBookTitle = interaction.options.getString('booktitle');

		const question = getRandomQuestion(chosenSubcommand, didUserSelectBookTitle);

		const interfaceType = chooseInterface();

		const questionText = question.content.questionText;

		const possibleAnswers = question.content.possibleAnswers;

		const embed = new EmbedBuilder()
			.setTitle(` ${chosenSubcommand} / Difficulty: ${question.content.difficulty}`)
			.setDescription(`"${questionText}"`)
			.setFooter({
				text: interfaceType === 'multiple-choice' ?
					'Multiple-choice question; select an answer within 10 seconds.' :
					'Free-response question; type an answer within 10 seconds.',
			});

		const questionMessage = await interaction.reply({
			embeds: [embed],
			fetchReply: true,
		});
		console.log(questionMessage);

		if (interfaceType === 'multiple-choice') {

			// (X): Here, we construct an array of possible answers:
			const options = getMultipleChoiceOptions(possibleAnswers);

			// (X): Here, we take those possible answers and use djs Builders to make a row of buttons:
			const row = buildMultipleChoiceButtons(options);

			// (X): Then, we attach the button row to the original message containing the question:
			await interaction.editReply({
				components: [row],
			});

			const filter = buttonPress => buttonPress.user.id === interaction.user.id;

			const collector = interaction.channel.createMessageComponentCollector({
				filter,
				time: 10000,
				max: 1,
			});

			collector.on('collect', async i => {
				console.log(`> Message component collector received interaction: ${i}`);

				const selected = i.customId.split('_')[1];
				console.log(`> The selected button was ${selected}`);

				const wasAnswerCorrect = evaluate(selected, possibleAnswers);
				console.log(`> Was the provided answer of ${selected} correct? ${wasAnswerCorrect}`);

				await i.update({
					content: wasAnswerCorrect ? '✅ Correct!' : `❌ That was incorrect. I was looking for **${possibleAnswers[0]}**`,
					components: [],
					embeds: [],
				});
				collector.stop();
			});

			collector.on('end', collected => {
				if (!collected.size || collected.size === 0) {
					interaction.editReply({
						content: `⏰ Time's up! I was looking for: **${possibleAnswers[0]}**`,
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
						? `❌ Incorrect. I was looking for **${possibleAnswers[0]}**`
						: `⏰ Time's up! The correct answer was **${possibleAnswers[0]}**`,
				components: [],
				embeds: [],
			});
		}
	},
};