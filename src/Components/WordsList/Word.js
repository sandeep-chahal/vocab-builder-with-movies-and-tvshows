import React from "react";

const Word = props => {
	return (
		<div className="word" style={{ opacity: `${props.stored ? 0.5 : 0.85}` }}>
			<div className="text">{props.word}</div>
			<div className={props.stored ? "btns" : "active btns"}>
				<div
					className="learn-btn"
					onClick={() => props.addToLearn(props.word)}
				></div>
				<div
					className="learned-btn"
					onClick={() => props.addToLearned(props.word)}
				></div>
				<div
					className="ignore-btn"
					onClick={() => props.addToIgnore(props.word)}
				></div>
			</div>
		</div>
	);
};
export default Word;
