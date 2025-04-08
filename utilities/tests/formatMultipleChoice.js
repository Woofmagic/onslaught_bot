/**
 * Project: Onslaught Discord Bot
 * File: utilities/tests/formatMultipleChoice.js
 * Author: Woofmagic
 * Created: 2025-04-08
 * Last Modified: 2025-04-08
 *
 * Description:
 * `interfaceSelector` is a utility that creates nothing more than a
 * multiple-choice interface for a Discord user to select one of four
 * answers from during their usage of a `test` slash command.
 *
 * Notes:
 *
 * Changelog:
 * - 2025-04-08: Creation of the file.
 */

// (1): Import the "button builders" from djs:
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// (2): ...later:
const DISTRACTOR_BANK = [
	'Aristotle', 'Plato', 'Kant', 'Nietzsche', 'Hume', 'Locke',
	'Spinoza', 'Russell', 'de Beauvoir', 'Kierkegaard', 'Sartre',
];

// (3): Define the main function:
function getMultipleChoiceOptions(possibleAnswers) {

	// (3.1): Obtain the *first* answer in the list of possible answers as the *correct* one (subject to change!):
	const correct = possibleAnswers[0];

	// (3.2): Select a bunch of "distractor" options that *do not include* the correct answer:
	const distractors = DISTRACTOR_BANK.filter(
		name => !possibleAnswers.includes(name),
	);

	// (3.3): Randomly permute the four options around:
	const options = [...distractors.sort(() => 0.5 - Math.random()).slice(0, 3), correct]
		.sort(() => 0.5 - Math.random());

	// (3.4): Return an *array* of options:
	return options;
}

// (4): Define the function that casts the options into djs buttons:
function buildMultipleChoiceButtons(options) {

	// (4.1): Return the ActionRowBuilder immediately:
	return new ActionRowBuilder().addComponents(
		options.map(opt =>
			new ButtonBuilder()
				.setCustomId(`ans_${opt}`)
				.setLabel(opt)
				.setStyle(ButtonStyle.Primary),
		),
	);
}

module.exports = {
	getMultipleChoiceOptions,
	buildMultipleChoiceButtons,
};
