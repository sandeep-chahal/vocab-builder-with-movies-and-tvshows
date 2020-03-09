import React, { Component, Fragment } from "react";
import "./VocabBuilder.css";
import Spinner from "../../Assets/Infinity-loader.svg";

import firebase from "../../firebase";
import DropZone from "../DropZone/DropZone";
import LearningWords from "../LearningWords";
import NewWords from "../NewWords";
import getWordList from "../../crtToWords";
import { updateWordList } from "../../firebase.utility";

class VocabBuilder extends Component {
	state = {
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

	removeFromNewWords = list => {
		const words = { ...this.state.newWords };
		Object.keys(list).forEach(word => {
			delete words[word];
		});
		this.setState({ newWords: words });
	};

	updateWords = (ignoreList, learnedList, learnList) => {
		updateWordList(ignoreList, learnedList, learnList);
		this.removeFromNewWords({ ...ignoreList, ...learnList, ...learnedList });
	};

	handleCrtFile = file => {
		getWordList(
			file,
			this.state.ignoreList,
			this.state.learnedList,
			this.state.learningList,
			this.setNewWords
		);
	};

	setNewWords = newWords => {
		this.setState({ newWords, currentSelected: "new_words" });
	};

	render() {
		let renderingComponent = null;
		if (this.state.currentSelected === "new_words")
			renderingComponent = (
				<NewWords words={this.state.newWords} updateWords={this.updateWords} />
			);
		else if (this.state.currentSelected === "learning_words")
			renderingComponent = <LearningWords words={this.state.learningList} />;

		return (
			<div className="vocab-builder">
				{!this.state.loading ? (
					<Fragment>
						<h1 onClick={() => this.setState({ currentSelected: null })}>
							Vocab Builder
						</h1>
						<main>
							{renderingComponent ? (
								renderingComponent
							) : (
								<Fragment>
									<DropZone addFile={this.handleCrtFile} />
									<div
										className="card learning-word-option"
										onClick={() =>
											this.setState({ currentSelected: "learning_words" })
										}
									>
										Learning Words
									</div>
								</Fragment>
							)}
						</main>
					</Fragment>
				) : (
					<img className="spinner" alt="loading" src={Spinner} />
				)}
			</div>
		);
	}
}
export default VocabBuilder;
