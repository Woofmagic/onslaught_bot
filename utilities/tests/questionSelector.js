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

// (3): We define the main function:
function getRandomQuestion(topic) {

	// (3.1): We need to find the filepath to the actual quiz contents:
	const filePath = path.join(__dirname, '..', 'statics', 'quizContents', `${topic}.json`);

	// (3.2): We read the file synchronously...
	const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

	// (3.3): Now, we choose a random problem from that data using the standard approach:
	return data[Math.floor(Math.random() * data.length)];
}

// (4): Export the function now:
module.exports = { getRandomQuestion };
