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

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const questions = require('../../statics/quizContents/philosophy/test.json');

const DISTRACTOR_BANK = [
	'Aristotle', 'Plato', 'Immanuel Kant', 'Georg Hegel', 'Friedrich Nietzsche',
	'David Hume', 'John Locke', 'Baruch Spinoza', 'Bertrand Russell',
	'Simone de Beauvoir', 'Søren Kierkegaard', 'Jean-Paul Sartre',
];

function shuffle(array) {
	return array.sort(() => Math.random() - 0.5);
};

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
					{ name: 'Physics', value: 'physics' },
					{ name: 'Chemistry', value: 'chemistry' },
			  ),
		),
	async execute(interaction) {

		const userSelectedTopic = interaction.options.getString('topic');

		const question = getRandomQuestion(topic);

		// (1): We randomly select a philosophy question from the array `questions`:
		const randomlySelectedQuestion = questions[Math.floor(Math.random() * questions.length)];

		// (2): Extract the correct answer from the *first* available option in `possibleAnswers`:
		const correctAnswer = randomlySelectedQuestion.content.possibleAnswers[0];

		const distractors = shuffle(
			DISTRACTOR_BANK.filter(name => !randomlySelectedQuestion.content.possibleAnswers.includes(name)),
		).slice(0, 3);

		const allOptions = shuffle([...distractors, correctAnswer]);

		// (2): We set up an ActionRowBuilder with components (a bunch of buttons):
		const row = new ActionRowBuilder().addComponents(
			allOptions.map(possibleOption =>
				new ButtonBuilder()
					.setCustomId(`ans_${possibleOption}`)
					.setLabel(possibleOption)
					.setStyle(ButtonStyle.Primary),
			),
		);

		const embed = new EmbedBuilder()
			.setTitle('Select the philosopher who wrote the following:')
			.setDescription(`"_${randomlySelectedQuestion.content.questionText}_"`)
			.setFooter({ text: 'Select the correct philosopher. You have 10 seconds!' });

		await interaction.reply({
			embeds: [embed],
			components: [row],
		});

		const collector = interaction.channel.createMessageComponentCollector({
			filter: i => i.user.id === interaction.user.id,
			time: 10000,
		});

		collector.on('collect', async i => {
			const selected = i.customId.split('_')[1];

			const correct = randomlySelectedQuestion.content.possibleAnswers.some(ans => selected.toLowerCase() === ans.toLowerCase());

			await i.update({
				content: correct ? '✅ Correct! Nicely done!' : `❌ Incorrect. The correct answer is: **${correctAnswer}**`,
				components: [],
				embeds: [],
			});
			collector.stop();
		});

		collector.on('end', collected => {
			if (!collected.size) {
				interaction.editReply({
					content: `⏰ Time's up! The correct answer was: **${randomlySelectedQuestion.correct}**`,
					components: [],
					embeds: [],
				});
			}
		});
	},
};