import React, { useState } from "react";
import Word from "./Word";

const WordsList = props => {
	const [ignoreList, addIgnore] = useState({});
	const [learnedList, addLearned] = useState({});
	const [learnList, addLearn] = useState({});

	const addToIgnore = word => {};

	const addToLearn = word => {};
	const addToLearned = word => {};

	const displayWords = words => {
		return words.map(word => <Word word={word} />);
	};

	return <div className="words-list">{displayWords(props.words)}</div>;
};
export default WordsList;
