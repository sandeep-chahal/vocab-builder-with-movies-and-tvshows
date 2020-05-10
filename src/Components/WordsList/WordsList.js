import React, { useState } from "react";
import Word from "./Word";
import "./word_list_style.css";

const WordsList = (props) => {
	const [ignoreList, addIgnore] = useState({});
	const [learnedList, addLearned] = useState({});
	const [learnList, addLearn] = useState({});
	const [showWordList, setShowWordList] = useState(true);

	const addToIgnore = (word) => {
		addIgnore({
			...ignoreList,
			[word]: true,
		});
	};

	const addToLearn = (word) => {
		addLearn({
			...learnList,
			[word]: true,
		});
	};
	const addToLearned = (word) => {
		addLearned({
			...learnedList,
			[word]: true,
		});
	};

	const resetLists = () => {
		addIgnore({});
		addLearn({});
		addLearned({});
	};

	const displayWords = (words) => {
		words = Object.keys(props.words || {});
		if (showWordList)
			return words.map((word) => (
				<Word
					type={props.type}
					key={word}
					word={word}
					addToLearn={addToLearn}
					addToIgnore={addToIgnore}
					addToLearned={addToLearned}
					stored={ignoreList[word] || learnedList[word] || learnList[word]}
					moveToLearnedFromLearning={props.moveToLearnedFromLearning}
				/>
			));
		// return words.map((word) => {
		// 	if (!word) return <div key={makeid(10)} className="new_line"></div>;
		// 	if (word.learn)
		// 		return (
		// 			<a
		// 				rel="noopener noreferrer"
		// 				target="_blank"
		// 				href={`https://dictionary.cambridge.org/dictionary/english/${word.word}`}
		// 				key={word.word + makeid(3)}
		// 				className="learn_word"
		// 			>
		// 				{" " + word.word + " "}
		// 			</a>
		// 		);
		// 	else
		// 		return (
		// 			<div key={word.word} className="normal_word">
		// 				{word.word}
		// 			</div>
		// 		);
		// });
	};

	return (
		<div className="words-list-wrapper">
			<div className="word-counter">
				Total Words:{" "}
				{/* {Object.keys(props.words).filter((word) => word && word.learn).length} */}
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
function makeid(length) {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
