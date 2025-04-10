/**
 * Project: Onslaught Discord Bot
 * File: utilities/tests/questionSelector.js
 * Author: Woofmagic
 * Created: 2025-04-08
 * Last Modified: 2025-04-08
 *
 * Description:
 * `questionSelector` is a utility that selects a random
 * problem *based on* a given topic.
 *
 * Notes:
 *
 * Changelog:
 * - 2025-04-08: Creation of the file.
 */

// (1): Require the native module 'path' for finding events and commands in relevant commandFolders:
/**
 * To Know:
 * The `path` module is a native node module that helps with reading and working with
 * paths as they relate to directories or files.
 */
const path = require('path');

// (2): Require the native module 'fs' for reading the files *in* those commandFolders:
/**
 * To know:
 * `fs` is node's native file system module. So, it can read files
 * and work with them as data.
 */
const fs = require('node:fs');

const philosophyTestQuestions = require('./../../statics/quizContents/philosophy/philosophy.json');
const compTIAAPlusPeripheralsQuestions = require('./../../statics/quizContents/internetTechnology/1_peripherals/peripherals.json');

// (3): We define the main function:
function getRandomQuestion(topic) {

	console.log(`> User selected topic: ${topic}`);

	if (topic === 'philosophy') {
		// (3.3): Now, we choose a random problem from that data using the standard approach:
		return philosophyTestQuestions[Math.floor(Math.random() * philosophyTestQuestions.length)];

	}
	else if (topic === 'it') {
		// (3.3): Now, we choose a random problem from that data using the standard approach:
		return compTIAAPlusPeripheralsQuestions[Math.floor(Math.random() * compTIAAPlusPeripheralsQuestions.length)];

	}
}

// (4): Export the function now:
module.exports = { getRandomQuestion };
