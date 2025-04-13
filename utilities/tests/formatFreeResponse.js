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
async function awaitFreeResponse(interaction, correctAnswers, questionMessage) {

	// (1.1): The filter we pass
	const filter = message => message.author.id === interaction.user.id;

	// (): Checking if the interaction has the .channel property:
	const doesInteractionHaveChannel = interaction?.channel;

	// (): We now define the MessageCollector:
	const collector = interaction.channel.createMessageCollector({
		filter,
		time: 10000,
		max: 1,
	});

	const responseObj = {
		correct: false,
		response: null,
	};

	collector.on('collect', async (freeResponseMessage) => {
		const userAnswer = freeResponseMessage.content.trim().toLowerCase();
		const didTheUserGetCorrectAnswer = correctAnswers.some(
			(answer) => answer.trim().toLowerCase() === userAnswer,
		);

		responseObj.correct = didTheUserGetCorrectAnswer;
		responseObj.response = userAnswer;

		// Delete the original question message
		await questionMessage.delete().catch(console.error);
	});

	collector.on('end', async (collected) => {
		if (collected.size === 0) {
			responseObj.response = null;
			await questionMessage.delete().catch(console.error);
		}
	});

	return new Promise((resolve) => {
		collector.on('end', () => resolve(responseObj));
	});

	// (): Return the promise:
	// return new Promise((resolve) => {
	// 	collector.on('collect', message => {
	// 		resolve({
	// 			response: message.content,
	// 			correct: correctAnswers.some(
	// 				ans => message.content.toLowerCase().includes(ans.toLowerCase()),
	// 			),
	// 		});
	// 	});

	// 	collector.on('end', collected => {
	// 		if (collected.size === 0) {
	// 			resolve({ response: null, correct: false });
	// 		}
	// 	});
	// });
}

module.exports = { awaitFreeResponse };
