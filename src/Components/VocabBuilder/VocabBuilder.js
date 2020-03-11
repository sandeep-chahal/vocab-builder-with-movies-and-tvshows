import React, { Component, Fragment } from "react";
import "./VocabBuilder.css";
import Spinner from "../../Assets/Infinity-loader.svg";

import firebase from "../../firebase";
import DropZone from "../DropZone/DropZone";
import LearningWords from "../LearningWords";
import ImportedWords from "../ImportedWords";
import getWordList from "../../crtToWords";
import { updateWordList, uploadSrtFileToServer } from "../../firebase.utility";
import AboutImported from "../AboutImported/AboutImported";

class VocabBuilder extends Component {
	state = {
		crtFile: null,
		ignoreList: null,
		learnedList: null,
		learningList: null,
		currentSelected: null,
		loading: true,
		ignoreRef: firebase.database().ref("ignore"),
		learnRef: firebase.database().ref("learn"),
		learnedRef: firebase.database().ref("learned"),

		aboutImported: {
			type: null
		}
	};

	componentDidMount() {
		this.addListners();
	}

	//set listners to db word lists
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

	//remove words from newWords list
	removeFromNewWords = list => {
		const words = { ...this.state.newWords };
		Object.keys(list).forEach(word => {
			delete words[word];
		});
		this.setState({ newWords: words });
	};

	//to update db and state after adding words to learned, learing and ignore list from newWords list
	updateWords = (ignoreList, learnedList, learnList) => {
		//update in db
		updateWordList(ignoreList, learnedList, learnList);
		//remove from state
		this.removeFromNewWords({ ...ignoreList, ...learnList, ...learnedList });
	};

	//extract words from crt file
	handleCrtFile = file => {
		this.setState({ crtFile: file });
		getWordList(
			file,
			this.state.ignoreList,
			this.state.learnedList,
			this.state.learningList,
			this.setNewWords
		);
	};

	//add newWords list to state after extracting from crt file
	setNewWords = newWords => {
		this.setState({ newWords, currentSelected: "new_words" });
	};

	//reset state when clicked on header to come back on home page
	resetState = () =>
		this.setState({
			currentSelected: null,
			newWords: null,
			aboutImported: { type: null }
		});

	handleSetAboutImported = about => {
		uploadSrtFileToServer(this.state.crtFile, about);
		this.setState({ aboutImported: about });
	};

	render() {
		// if loading then show spinner
		if (this.state.loading)
			return <img className="spinner" alt="loading" src={Spinner} />;

		// choosing what should rendered
		let renderingComponent = null;
		if (this.state.currentSelected === "new_words")
			renderingComponent = (
				<ImportedWords
					words={this.state.newWords}
					updateWords={this.updateWords}
				/>
			);
		else if (this.state.currentSelected === "learning_words")
			renderingComponent = <LearningWords words={this.state.learningList} />;

		return (
			<div className="vocab-builder">
				<h1 onClick={this.resetState}>Vocab Builder</h1>
				<main>
					{renderingComponent &&
					(this.state.aboutImported.type !== null ||
						this.state.currentSelected !== "new_words") ? (
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
					{this.state.aboutImported.type === null &&
					this.state.currentSelected === "new_words" ? (
						<AboutImported
							close={() =>
								this.setState({ currentSelected: null, newWords: null })
							}
							setAbout={this.handleSetAboutImported}
						/>
					) : null}
				</main>
			</div>
		);
	}
}
export default VocabBuilder;
