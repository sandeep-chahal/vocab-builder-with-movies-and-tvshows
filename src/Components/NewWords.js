import React from "react";
import WordsList from "./WordsList/WordsList";

class NewWords extends React.Component {
	updateWords = words => {};
	render() {
		return (
			<WordsList
				type="new_words"
				words={this.props.words}
				updateWords={this.props.updateWords}
			/>
		);
	}
}

export default NewWords;
