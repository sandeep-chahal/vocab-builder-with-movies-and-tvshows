const addCrtFile = (
	file,
	ignoreList,
	learnedList,
	learningList,
	setNewWords
) => {
	var reader = new FileReader();
	let words = {};
	reader.onload = () => {
		var text = reader.result;
		words = filterWords(
			text,
			ignoreList,
			learnedList,
			learningList,
			setNewWords
		);
	};
	if (file && (file.type === "" || file.type === "text/plain"))
		reader.readAsText(file);

	return words;
};

const filterWords = (
	input,
	ignoreList,
	learnedList,
	learningList,
	setNewWords
) => {
	let words = input.split(/[\s,]+/);
	words = words.map(word => word.replace(/\.|,|"|!|\?/g, "").toLowerCase());
	words = words.filter(
		word =>
			/^[a-zA-Z]+$/.test(word) &&
			word.length > 2 &&
			!ignoreList[word] &&
			!learningList[word] &&
			!learnedList[word]
	);
	const wordsObj = {};
	words.forEach(word => {
		wordsObj[word] = true;
	});
	setNewWords(wordsObj);
};

const getWordList = (
	crtFile,
	ignoreList,
	learnedList,
	learningList,
	setNewWords
) => {
	const words = addCrtFile(
		crtFile,
		ignoreList,
		learnedList,
		learningList,
		setNewWords
	);
};

export default getWordList;
