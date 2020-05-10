const filterWords = (input, ignoreList, setNewWords) => {
	// const re = /[\d]+:/gm;
	// let text = input.split("\n");
	// text = text.filter((w) => {
	// 	return !re.test(w) && isNaN(Number(w));
	// });
	// let words = [];
	// text.forEach((t) => {
	// 	let temp = "";
	// 	t.split(" ").forEach((word) => {
	// 		word = word
	// 			.replace("<i>", "")
	// 			.replace("</i>", "")
	// 			.replace("<b>", "")
	// 			.replace("</b>", "")
	// 			.replace("-", "");
	// 		let _word = word.replace(/\.|,|"|'|!|\?/g, "").toLowerCase();
	// 		if (
	// 			_word.length < 3 ||
	// 			ignoreList[_word] ||
	// 			ignoreList[_word.split("'")[0]]
	// 		)
	// 			temp = temp + " " + word;
	// 		else {
	// 			if (temp) {
	// 				words.push({ word: temp, learn: false });
	// 				temp = "";
	// 			}
	// 			words.push({ word, learn: true });
	// 		}
	// 	});
	// 	if (temp) {
	// 		words.push({ word: temp, learn: false });
	// 		temp = "";
	// 	}
	// 	words.push(null);
	// });
	let words = input.split(/[\s,]+/);
	words = words.map((word) => word.replace(/\.|,|"|!|\?/g, "").toLowerCase());
	words = words.filter(
		(word) => /^[a-zA-Z]+$/.test(word) && word.length > 2 && !ignoreList[word]
	);
	const wordsObj = {};
	words.forEach((word) => {
		wordsObj[word] = true;
	});
	setNewWords(wordsObj);
};

export default filterWords;
