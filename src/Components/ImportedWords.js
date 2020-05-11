import React from "react";
import WordsList from "./WordsList/WordsList";

class ImportedWords extends React.Component {
	render() {
		return (
			<WordsList
				type="new_words"
				words={this.props.words}
				updateWords={this.props.updateWords}
				transcript={this.props.transcript}
			/>
		);
	}
}

export default ImportedWords;
