import React, { Component, Fragment } from "react";
import "./VocabBuilder.css";
import Spinner from "../../Assets/Infinity-loader.svg";

import firebase from "../../firebase";
import DropZone from "../DropZone/DropZone";
import WordsList from "../WordsList/WordsList";

class VocabBuilder extends Component {
	state = {
		newWords: null,
		ignoreList: null,
		learnedList: null,
		learningList: null,
		currentSelected: null,
		loading: true,
		ignoreRef: firebase.database().ref("ignore"),
		learnRef: firebase.database().ref("learn"),
		learnedRef: firebase.database().ref("learned")
	};

	componentDidMount() {
		this.addListners();
	}

	addListners() {
		this.state.ignoreRef.on("value", snap => {
			this.setState({ ignoreList: snap.val() });
		});
		this.state.learnedRef.on("value", snap => {
			this.setState({ learnedList: snap.val() || {} });
		});
		this.state.learnRef.on("value", snap => {
			this.setState({ learningList: snap.val() || {}, loading: false });
		});
	}

	addCrtFile = file => {
		var reader = new FileReader();
		reader.onload = () => {
			var text = reader.result;
			this.filterWords(text);
		};
		if (file && (file.type === "" || file.type === "text/plain"))
			reader.readAsText(file);
	};

	filterWords = input => {
		let words = input.split(/[\s,]+/);
		words = words.map(word => word.replace(/\.|,|\"|!|\?/g, "").toLowerCase());
		words = words.filter(
			word =>
				word.length > 2 &&
				!this.state.ignoreList[word] &&
				!this.state.learningList[word] &&
				!this.state.learnedList[word] &&
				/^[a-zA-Z]+$/.test(word)
		);
		const wordsObj = {};
		words.forEach(word => {
			wordsObj[word] = true;
		});
		this.setState({ newWords: wordsObj, currentSelected: "newWords" });
	};

	removeFromNewWords = list => {
		const words = { ...this.state.newWords };
		Object.keys(list).forEach(word => {
			delete words[word];
		});
		this.setState({ newWords: words });
	};

	updateWords = (ignoreList, learnedList, learnList) => {
		this.state.ignoreRef.update(ignoreList);
		this.state.learnRef.update(learnList);
		this.state.learnedRef.update(learnedList);
		this.removeFromNewWords({ ...ignoreList, ...learnList, ...learnedList });
	};

	render() {
		return (
			<div className="vocab-builder">
				{!this.state.loading ? (
					<Fragment>
						<h1>Vocab Builder</h1>
						{this.state.currentSelected ? (
							<WordsList
								type={this.state.currentSelected}
								words={this.state.newWords}
								updateWords={this.updateWords}
							/>
						) : (
							<DropZone addFile={this.addCrtFile} />
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
