/**
 * Project: Onslaught Discord Bot
 * File: utilities/tests/formatFreeResponse.js
 * Author: Woofmagic
 * Created: 2025-04-08
 * Last Modified: 2025-04-08
 *
 * Description:
 * `formatFreeResponse` is a utility that sets up a djs
 * MessageCollector and waits for some time to recieve input
 * from a user.
 *
 * Notes:
 *
 * Changelog:
 * - 2025-04-08: Creation of the file.
 */

// (1): Define the function:
async function awaitFreeResponse(interaction, correctAnswers, timeout = 10000) {

	// (1.1): The filter we pass
	const filter = message => message.author.id === interaction.user.id;

	// (): Checking if the interaction has the .channel property:
	const doesInteractionHaveChannel = interaction?.channel;

	// (): We now define the MessageCollector:
	const collector = interaction.channel.createMessageCollector({
		filter,
		time: timeout,
		max: 1,
	});

	// (): Return the promise:
	return new Promise((resolve) => {
		collector.on('collect', message => {
			resolve({
				response: message.content,
				correct: correctAnswers.some(
					ans => message.content.toLowerCase().includes(ans.toLowerCase()),
				),
			});
		});

		collector.on('end', collected => {
			if (collected.size === 0) {
				resolve({ response: null, correct: false });
			}
		});
	});
}

module.exports = { awaitFreeResponse };
