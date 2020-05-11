import React, { useState, useEffect } from "react";
import Word from "./Word";
import "./word_list_style.css";

const WordsList = (props) => {
	const [ignoreList, addIgnore] = useState({});
	const [learnedList, addLearned] = useState({});
	const [learnList, addLearn] = useState({});
	const [showWordList, setShowWordList] = useState(true);
	const [transcripted, setTranscripted] = useState([]);

	useEffect(() => {
		let normal = "";
		let transcript_lines = [];
		props.transcript.map((line) => {
			let words = line.split(" ");
			let temp = [];
			for (let word of words) {
				if (word.replace(/\.|,|"|\/r|!|\?/g, "").toLowerCase() in props.words) {
					if (normal) {
						temp.push(
							<div key={makeid(8)} className="normal_word">
								{normal}
							</div>
						);
						normal = "";
					}
					temp.push(
						<a
							rel="noopener noreferrer"
							target="_blank"
							href={`https://dictionary.cambridge.org/dictionary/english/${word}`}
							key={word.word + makeid(3)}
							className="learn_word"
						>
							{" " + word + " "}
						</a>
					);
				} else normal += " " + word;
			}
			if (normal) {
				temp.push(
					<div key={normal} className="normal_word">
						{normal}
					</div>
				);
				normal = "";
			}
			transcript_lines.push(temp);
		});
		setTranscripted(transcript_lines);
	}, []);

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
		else
			return transcripted.map((line) => {
				return (
					<div key={makeid(5)} className="line">
						{line}
					</div>
				);
			});
	};

	return (
		<div className="words-list-wrapper">
			<div className="word-counter">
				Total Words: {Object.keys(props.words).length}
			</div>
			<div className="switch" onClick={() => setShowWordList(!showWordList)}>
				Switch
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
