const addCrtFile = (
	file,
	ignoreList,

	setNewWords
) => {
	var reader = new FileReader();
	let words = {};
	reader.onload = () => {
		var text = reader.result;
		words = filterWords(
			text,
			ignoreList,

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

	setNewWords
) => {
	let words = input.split(/[\s,]+/);
	words = words.map(word => word.replace(/\.|,|"|!|\?/g, "").toLowerCase());
	words = words.filter(
		word => /^[a-zA-Z]+$/.test(word) && word.length > 2 && !ignoreList[word]
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

	setNewWords
) => {
	const words = addCrtFile(
		crtFile,
		ignoreList,

		setNewWords
	);
};

export default getWordList;
