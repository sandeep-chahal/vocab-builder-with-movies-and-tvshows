import React, { Component, Fragment } from "react";
import "./VocabBuilder.css";
import Spinner from "../../Assets/Infinity-loader.svg";

import firebase from "../../firebase";
import DropZone from "../DropZone/DropZone";
import WordsList from "../WordsList/WordsList";

class VocabBuilder extends Component {
	state = {
		words: null,
		ignore: null,
		learned: null,
		learn: null,
		ignoreRef: firebase.database().ref("ignore"),
		learnRef: firebase.database().ref("learn"),
		learnedRef: firebase.database().ref("learned")
	};

	componentDidMount() {
		this.state.ignoreRef.on("value", snap => {
			this.setState({ ignore: snap.val() });
		});
		this.state.learnRef.on("value", snap => {
			this.setState({ learn: snap.val() || {} });
		});
		this.state.learnedRef.on("value", snap => {
			this.setState({ learned: snap.val() || {} });
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
				word.length > 2 &&
				!this.state.ignore[word] &&
				!this.state.learn[word] &&
				!this.state.learned[word] &&
				/^[a-zA-Z]+$/.test(word)
		);
		const wordsObj = {};
		words.forEach(word => {
			wordsObj[word] = true;
		});
		this.setState({ words: wordsObj });
	};

	filterText2 = (ignoreList, learnList, learnedList) => {
		const words = { ...this.state.words };
		Object.keys(ignoreList).forEach(word => {
			delete words[word];
		});
		Object.keys(learnList).forEach(word => {
			delete words[word];
		});
		Object.keys(learnedList).forEach(word => {
			delete words[word];
		});
		this.setState({ words });
	};

	updateWords = (ignoreList, learnedList, learnList) => {
		this.state.ignoreRef.update(ignoreList);
		this.state.learnRef.update(learnList);
		this.state.learnedRef.update(learnedList);
		this.filterText2(ignoreList, learnList, learnedList);
	};

	render() {
		return (
			<div className="vocab-builder">
				{this.state.ignore || this.state.learn || this.state.learned ? (
					<Fragment>
						<h1>Vocab Builder</h1>
						{this.state.words ? (
							<WordsList
								words={this.state.words}
								updateWords={this.updateWords}
							/>
						) : (
							<DropZone addFile={this.addFile} />
						)}
					</Fragment>
				) : (
					<img className="spinner" alt="loading" src={Spinner} />
				)}
			</div>
		);
	}
}
export default VocabBuilder;
