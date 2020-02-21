import React, { useState } from "react";
import Word from "./Word";

const WordsList = props => {
	const [ignoreList, addIgnore] = useState({});
	const [learnedList, addLearned] = useState({});
	const [learnList, addLearn] = useState({});

	const addToIgnore = word => {
		addIgnore({
			...ignoreList,
			[word]: true
		});
	};

	const addToLearn = word => {
		addLearn({
			...learnList,
			[word]: true
		});
	};
	const addToLearned = word => {
		addLearned({
			...learnedList,
			[word]: true
		});
	};

	const displayWords = words => {
		return words.map(word => (
			<Word
				key={word}
				stored={ignoreList[word] || learnedList[word] || learnList[word]}
				word={word}
				addToLearn={addToLearn}
				addToIgnore={addToIgnore}
				addToLearned={addToLearned}
			/>
		));
	};

	return (
		<div className="words-list-wrapper">
			<div className="words-list">{displayWords(props.words)}</div>
			<div
				className="update-btn"
				onClick={() => props.updateWords(ignoreList, learnedList, learnList)}
			>
				Update
			</div>
		</div>
	);
};
export default WordsList;
