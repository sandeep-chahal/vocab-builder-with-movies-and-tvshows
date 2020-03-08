import React from "react";
import WordsList from "./WordsList/WordsList";

class LearningWords extends React.Component {
	updateWords = words => {};
	render() {
		return (
			<WordsList
				type="learingWords"
				words={this.props.words}
				updateWords={this.updateWords}
				removeFromLearning={this.props.removeFromLearning}
			/>
		);
	}
}

export default LearningWords;
