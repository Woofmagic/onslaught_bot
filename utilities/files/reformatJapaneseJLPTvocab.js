const fs = require('fs');

const inputPath = './../../statics/quizContents/language/japanese/jlptVocab/jlpt5.json';
const outputPath = './../../statics/quizContents/language/japanese/jlptVocab/jlpt5_modified.json';

const rawData = fs.readFileSync(inputPath, 'utf-8');
const entries = JSON.parse(rawData);

const transformed = [];

const isHiragana = str => /^[\u3040-\u309Fー\s]+$/.test(str);

entries.forEach((entry, index) => {
	// === First question: English translation ===
	transformed.push({
		id: transformed.length + 1,
		content: {
			version: '1.0.0',
			categories: ['language', 'japanese', 'jlpt', `jlpt${entry.level}`],
			topics: ['vocabulary', 'translation', 'reading comprehension'],
			questionText: `Please translate the word ${entry.word} into English.`,
			examples: [
				entry.furigana ? `Furigana: ${entry.furigana}` : null,
				`Romaji: ${entry.romaji}`,
			].filter(Boolean),
			possibleAnswers: entry.meaning
				.split(',')
				.map(m => m.trim().toLowerCase()),
			difficulty: `JLPT N${entry.level}`,
			extraInfo: `Original word: ${entry.word}`,
			referencesSources: [],
		},
	});

	// === Second question: Convert kanji to hiragana (if applicable) ===
	if (entry.furigana && isHiragana(entry.furigana)) {
		transformed.push({
			id: transformed.length + 1,
			content: {
				version: '1.0.0',
				categories: ['language', 'japanese', 'jlpt', `jlpt${entry.level}`],
				topics: ['vocabulary', 'translation', 'reading comprehension'],
				questionText: `Please write the correct hiragana reading of the word ${entry.word}.`,
				examples: [
					`romaji: ${entry.romaji}`,
					`(Hint: JLPT N${entry.level} level word)`,
				],
				possibleAnswers: [entry.furigana.trim()],
				difficulty: `JLPT N${entry.level}`,
				extraInfo: `Expected hiragana reading: ${entry.furigana}`,
				referencesSources: [],
			},
		});
	}
});

fs.writeFileSync(outputPath, JSON.stringify(transformed, null, 2), 'utf-8');

console.log(`✅ Transformed ${transformed.length} entries and wrote to ${outputPath}`);
