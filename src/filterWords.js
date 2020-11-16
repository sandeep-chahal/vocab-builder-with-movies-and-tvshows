const filterWords = async (url, ignoreList) => {
	const req = await fetch(url);
	if (req.status > 299) {
		alert(req.status);
		window.location.reload();
		return;
	}
	let result = await req.text();
	result = result.replace(/<\w>|<\/\w>|\r|/gm, "");

	// filter words
	let words = result.split(/[\s,]+/);
	words = words.map((word) => word.replace(/\.|,|"|!|\?/g, "").toLowerCase());
	words = words.filter(
		(word) => /^[a-zA-Z]+$/.test(word) && word.length > 2 && !ignoreList[word]
	);
	const wordsObj = {};
	words.forEach((word) => {
		wordsObj[word] = true;
	});

	// transcript
	let transcript = result.split("\n");
	transcript = transcript.filter(
		(line) =>
			!(
				line.includes("-->") ||
				line > -1 ||
				line.includes("Support us and become VIP member") ||
				line.includes("to remove all ads from www.OpenSubtitles.org") ||
				line.includes("Support us and become VIP member") ||
				line.includes("to remove all ads from www.OpenSubtitles.org") ||
				line.includes("Advertise your product or brand here") ||
				line.includes("contact www.OpenSubtitles.org today") ||
				line.includes("OpenSubtitles") ||
				line.includes("http://") ||
				line.includes("<font") ||
				line.includes("</font") ||
				line.charCodeAt() > 200
			)
	);
	return [wordsObj, transcript];
};

export default filterWords;
