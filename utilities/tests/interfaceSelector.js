/**
 * Project: Onslaught Discord Bot
 * File: utilities/tests/interfaceSelector.js
 * Author: Woofmagic
 * Created: 2025-04-08
 * Last Modified: 2025-04-08
 *
 * Description:
 * `interfaceSelector` is a utility that selects between the
 * two main types of questions that we use with equal probability:
 * multiple-choice or free-response.
 *
 * Notes:
 *
 * Changelog:
 * - 2025-04-08: Creation of the file.
 */

function chooseInterface() {
	return Math.random() < 0.5 ? 'multiple-choice' : 'free-response';
}

module.exports = { chooseInterface };
