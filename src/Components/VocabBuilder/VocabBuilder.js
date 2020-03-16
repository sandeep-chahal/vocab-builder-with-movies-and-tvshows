import React, { Component, Fragment } from "react";
import "./VocabBuilder.css";
import Spinner from "../../Assets/Infinity-loader.svg";

import firebase from "../../firebase";
import Auth from "../Auth/Auth";
import DropZone from "../DropZone/DropZone";
import LearningWords from "../LearningWords";
import ImportedWords from "../ImportedWords";
import getWordList from "../../crtToWords";
import {
	updateWordList,
	uploadImportedWordsToDB
} from "../../firebase.utility";
import AboutImported from "../AboutImported/AboutImported";
import UploadedItems from "../UploadedItems/UploadedItems";

class VocabBuilder extends Component {
	state = {
		ignoreList: null,
		learnedList: null,
		learnList: null,
		currentSelected: null,
		loading: true,
		ignoreRef: firebase.database().ref("ignore"),
		learnRef: firebase.database().ref("learn"),
		learnedRef: firebase.database().ref("learned"),
		uploadsRef: firebase.database().ref("uploads"),
		usersRef: firebase.database().ref("users"),
		uploadedItems: null,
		uploadingWords: false,
		downloadingWords: false,
		showAuth: false,
		user: null
	};

	componentDidMount() {
		firebase.auth().onAuthStateChanged(user => {
			this.setState({ user, showAuth: false });
			this.addListners(user);
		});
	}

	//set listners to db word lists
	addListners(user) {
		if (user) {
			const usersRef = this.state.usersRef;
			usersRef.child(user.uid).on("value", snap => {
				const data = snap.val();
				if (data)
					this.setState({
						learnList: data.learn || {},
						learnedList: data.learned || {}
					});
			});
		}
		this.state.ignoreRef.once("value", snap => {
			this.setState({ ignoreList: snap.val() });
		});
		this.state.uploadsRef.once("value", snap => {
			this.setState({ uploadedItems: snap.val() || {}, loading: false });
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
		if (!this.state.user) {
			this.setState({ showAuth: true });
		} else {
			//update in db
			updateWordList(this.state.user.uid, ignoreList, learnedList, learnList);
			//remove from state
			this.removeFromNewWords({ ...ignoreList, ...learnList, ...learnedList });
		}
	};

	//extract words from crt file
	handleCrtFile = file => {
		getWordList(file, this.state.ignoreList, this.setNewWords);
	};

	//add newWords list to state after extracting from crt file
	setNewWords = newWords => {
		this.setState({ newWords, currentSelected: "about_imported" });
	};

	//reset state when clicked on header to come back on home page
	resetState = () =>
		this.setState({
			currentSelected: null,
			newWords: null
		});

	handleSetAboutImported = about => {
		this.setState({ uploadingWords: true });
		uploadImportedWordsToDB(about, this.state.newWords, () =>
			this.setState({ currentSelected: "new_words", uploadingWords: false })
		);
	};

	getUploadedWords = key => {
		this.setState({ downloadingWords: true });
		firebase
			.database()
			.ref("uploadedWords")
			.child(key)
			.once("value", snap => {
				this.setState({
					newWords: snap.val(),
					currentSelected: "new_words",
					downloadingWords: false
				});
			});
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
			renderingComponent = <LearningWords words={this.state.learnList} />;

		return (
			<div className="vocab-builder">
				<h1 onClick={this.resetState}>Vocab Builder</h1>
				<main>
					{this.state.currentSelected === "new_words" ||
					this.state.currentSelected === "learning_words" ? (
						renderingComponent
					) : (
						<Fragment>
							<div className="">
								<DropZone addFile={this.handleCrtFile} />
								<div
									className="card learning-word-option"
									onClick={() => {
										if (!this.state.user) {
											this.setState({ showAuth: true });
										} else this.setState({ currentSelected: "learning_words" });
									}}
								>
									Learning Words
								</div>
							</div>
							{/* <div className="uploaded-items"></div> */}
							{
								<UploadedItems
									downloadingWords={this.state.downloadingWords}
									getUploadedWords={this.getUploadedWords}
									uploadedItems={this.state.uploadedItems}
								/>
							}
						</Fragment>
					)}
					{this.state.currentSelected === "about_imported" ? (
						<AboutImported
							close={() =>
								this.setState({ currentSelected: null, newWords: null })
							}
							setAbout={this.handleSetAboutImported}
							uploadingWords={this.state.uploadingWords}
						/>
					) : null}
					{this.state.showAuth ? (
						<Auth close={() => this.setState({ showAuth: false })} />
					) : null}
				</main>
			</div>
		);
	}
}
export default VocabBuilder;
