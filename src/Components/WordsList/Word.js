import React from "react";

const Word = (props) => {
	return (
		<a
			className="word"
			style={{ opacity: `${props.visited ? 0.5 : 0.85}` }}
			id={props.children}
			onClick={props.onClick}
			rel="noopener noreferrer"
			target="_blank"
			href={`https://dictionary.cambridge.org/dictionary/english/${props.children}`}
		>
			{props.children}
		</a>
	);
};
export default Word;
