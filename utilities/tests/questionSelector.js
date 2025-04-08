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

const fs = require('fs');

const path = require('path');

function getRandomQuestion(topic) {
	const filePath = path.join(__dirname, '..', 'statics', 'quizContents', `${topic}.json`);
	const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
	return data[Math.floor(Math.random() * data.length)];
}

module.exports = { getRandomQuestion };
