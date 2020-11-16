import React, { useState, useEffect, useRef } from "react";
import Word from "./Word";
import "./word_list_style.css";

const WordsList = (props) => {
	const [showWordList, setShowWordList] = useState(true);
	const [transcripted, setTranscripted] = useState([]);
	const lastSelectedWord = useRef("");
	useEffect(() => {
		if (props.transcript)
			(function () {
				let normal = "";
				let transcript_lines = [];
				props.transcript.map((line) => {
					let words = line.split(" ");
					let temp = [];
					for (let word of words) {
						// word=word.replace(,"")
						if (
							word.replace(/\.|,|"|\/r|!|\?/g, "").toLowerCase() in props.words
						) {
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
									id={word.replace(/\.|,|"|\/r|!|\?/g, "")}
									onClick={() => (lastSelectedWord.current = word)}
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
			})();
	}, []);

	const displayWords = (words) => {
		words = Object.keys(props.words || {});
		if (showWordList)
			return words.map((word) => (
				<Word
					onClick={() => {
						lastSelectedWord.current = word;
						props.addToVisited(word);
					}}
					key={word}
					visited={props.visitedWords[word]}
				>
					{word}
				</Word>
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
			{props.transcript ? (
				<a
					href={`#${lastSelectedWord.current}`}
					className="switch"
					onClick={() => setShowWordList(!showWordList)}
				>
					Switch
				</a>
			) : null}
			<div className="words-list">{displayWords(props.words)}</div>
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
