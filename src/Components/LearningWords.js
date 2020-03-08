import React from "react";
import WordsList from "./WordsList/WordsList";

class LearningWords extends React.Component {
	render() {
		return <WordsList type="learingWords" words={this.props.words} />;
	}
}

export default LearningWords;
