const fs = require('fs');

const inputPath = './../../statics/quizContents/language/mandarin/hskVocab/hsk6.json';
const outputPath = './../../statics/quizContents/language/mandarin/hskVocab/hsk6_modified.json';

const rawData = fs.readFileSync(inputPath, 'utf-8');
const entries = JSON.parse(rawData);

// Check for Chinese characters (CJK Unified Ideographs)
const containsChinese = str => /[\u4E00-\u9FFF]/.test(str);

const transformed = [];

entries.forEach(entry => {
	// Filter out translations that contain Chinese characters
	const cleanTranslations = entry.translations
		.map(t => t.trim().toLowerCase())
		.filter(t => !containsChinese(t));

	if (cleanTranslations.length === 0) {
		console.warn(`⚠️ Skipping entry with ID ${entry.id} due to no valid English translations.`);
		return;
	}

	transformed.push({
		id: entry.id,
		content: {
			version: '1.0.0',
			categories: ['language', 'mandarin', 'hsk', 'hsk6'],
			topics: ['vocabulary', 'translation', 'reading comprehension'],
			questionText: `Please translate the Chinese word ${entry.hanzi} into English.`,
			examples: [
				`Pinyin: ${entry.pinyin}`,
			],
			possibleAnswers: cleanTranslations,
			difficulty: 'HSK6',
			extraInfo: `Original Hanzi: ${entry.hanzi}`,
			referencesSources: [],
		},
	});
});

fs.writeFileSync(outputPath, JSON.stringify(transformed, null, 2), 'utf-8');
console.log(`✅ Finished! ${transformed.length} HSK questions written to ${outputPath}`);