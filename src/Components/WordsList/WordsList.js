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

	const resetLists = () => {
		addIgnore({});
		addLearn({});
		addLearned({});
	};

	const displayWords = words => {
		words = Object.keys(props.words || {});
		return words.map(word => (
			<Word
				type={props.type}
				key={word}
				word={word}
				addToLearn={addToLearn}
				addToIgnore={addToIgnore}
				addToLearned={addToLearned}
				stored={ignoreList[word] || learnedList[word] || learnList[word]}
				removeFromLearning={props.removeFromLearning}
			/>
		));
	};

	return (
		<div className="words-list-wrapper">
			<div className="word-counter">
				Total Words: {Object.keys(props.words || {}).length}
			</div>
			<div className="words-list">{displayWords(props.words)}</div>
			{props.type === "new_words" ? (
				<div
					className="update-btn"
					onClick={() =>
						props.updateWords(ignoreList, learnedList, learnList) ||
						resetLists()
					}
				>
					Update
				</div>
			) : null}
		</div>
	);
};
export default WordsList;
