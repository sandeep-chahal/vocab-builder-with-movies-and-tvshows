import React, { Fragment } from "react";

const Word = props => {
	const getButtons = type => {
		const learn_btn = (
			<div
				className="learn-btn"
				onClick={() => props.addToLearn(props.word)}
			></div>
		);

		const learned_btn = (
			<div
				className="learned-btn"
				onClick={() => props.addToLearned(props.word)}
			></div>
		);

		const ignore_btn = (
			<div
				className="ignore-btn"
				onClick={() => props.addToIgnore(props.word)}
			></div>
		);

		return (
			<Fragment>
				{type === "newWords" ? learn_btn : null}
				{type === "newWords" || type === "learingWords" ? learned_btn : null}
				{type === "newWords" ? ignore_btn : null}
			</Fragment>
		);
	};

	return (
		<div className="word" style={{ opacity: `${props.stored ? 0.5 : 0.85}` }}>
			<div className="text">
				<a
					rel="noopener noreferrer"
					target="_blank"
					href={`https://dictionary.cambridge.org/dictionary/english/${props.word}`}
				>
					{props.word}
				</a>
			</div>
			<div className={props.stored ? "btns" : "active btns"}>
				{getButtons(props.type)}
			</div>
		</div>
	);
};
export default Word;
