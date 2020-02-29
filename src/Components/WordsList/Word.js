import React, { Fragment } from "react";

const Word = props => {
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
				{
					(props.type = "newWords" ? (
						<Fragment>
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
							></div>{" "}
						</Fragment>
					) : null)
				}
			</div>
		</div>
	);
};
export default Word;
