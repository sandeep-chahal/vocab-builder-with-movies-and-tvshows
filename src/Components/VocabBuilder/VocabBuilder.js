import React from "react";
import "./VocabBuilder.css";

import firebase from "../../firebase";
import DropZone from "../DropZone/DropZone";
import WordsList from "../WordsList/WordsList";

class VocabBuilder extends React.Component {
	state = {
		words: null,
		ignore: []
	};

	componentDidMount() {
		firebase
			.database()
			.ref("ignore")
			.once("value", snap => {
				this.setState({ ignore: snap.val() });
			});
	}

	addFile = file => {
		var reader = new FileReader();
		reader.onload = () => {
			var text = reader.result;
			this.filterText(text);
		};
		if (file && (file.type === "" || file.type === "text/plain"))
			reader.readAsText(file);
	};

	filterText = input => {
		let words = input.split(/[\s,]+/);
		words = words.map(word => word.replace(/\.|,|\"|!|\?/g, "").toLowerCase());
		words = words.filter(
			word =>
				word.length > 2 && !this.state.ignore[word] && /^[a-zA-Z]+$/.test(word)
		);
		words = Array.from(new Set(words));
		words = words.sort();
		this.setState({ words });
	};

	updateWords = () => {};

	render() {
		return (
			<div className="vocab-builder">
				<h1>Vocab Builder</h1>
				{this.state.words ? (
					<WordsList words={this.state.words} />
				) : (
					<DropZone addFile={this.addFile} />
				)}
			</div>
		);
	}
}
export default VocabBuilder;
