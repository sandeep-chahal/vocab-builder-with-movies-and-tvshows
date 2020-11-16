import React from "react";
import WordsList from "./WordsList/WordsList";

class ImportedWords extends React.Component {
	render() {
		return (
			<WordsList
				type={this.props.type}
				words={this.props.words}
				visitedWords={this.props.visitedWords}
				addToVisited={this.props.addToVisited}
				transcript={this.props.transcript}
			/>
		);
	}
}

export default ImportedWords;
