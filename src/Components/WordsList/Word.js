import React from "react";

const Word = props => {
	return (
		<div className="word">
			<div className="text">{props.word}</div>
			<div className="btns">
				<div className="learn-btn" onClick={props.addToLearn}></div>
				<div className="learned-btn" onClick={props.addToLearned}></div>
				<div className="ignore-btn" onClick={props.addToIgnore}></div>
			</div>
		</div>
	);
};
export default Word;
