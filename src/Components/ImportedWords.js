import React from "react";
import WordsList from "./WordsList/WordsList";

class ImportedWords extends React.Component {
	state = {
		type: null,
		name: null,
		season: null,
		episode: null
	};

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

export default ImportedWords;
