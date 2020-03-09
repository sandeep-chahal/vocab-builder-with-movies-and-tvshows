import React from "react";
import WordsList from "./WordsList/WordsList";
import { moveToLearnedFromLearning } from "../firebase.utility";

class LearningWords extends React.Component {
	updateWords = words => {};
	render() {
		return (
			<WordsList
				type="learing_words"
				words={this.props.words}
				updateWords={this.updateWords}
				moveToLearnedFromLearning={moveToLearnedFromLearning}
			/>
		);
	}
}

export default LearningWords;
