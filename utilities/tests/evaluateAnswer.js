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

// (): We define the main function:
function evaluate(answer, correctAnswers) {
	return correctAnswers.some(
		ans => answer.toLowerCase() === ans.toLowerCase(),
	);
}

module.exports = { evaluate };
