import React, { Component, useRef } from "react";
import "./VocabBuilder.css";
import Spinner from "../../Assets/Infinity-loader.svg";

import firebase from "../../firebase";
import Auth from "../Auth/Auth";
import LearningWords from "../LearningWords";
import ImportedWords from "../ImportedWords";
import filterWords from "../../filterWords";
import {
	updateWordList,
	uploadImportedWordsToDB,
} from "../../firebase.utility";
import SearchItems from "../SearchItems/SearchItems";
import OS from "opensubtitles-api";

const OpenSubtitles = new OS({
	useragent: process.env.REACT_APP_USERAGENT,
	username: process.env.REACT_APP_USERNAME,
	password: process.env.REACT_APP_PASSWORD,
	ssl: true,
});
OpenSubtitles.login().catch((err) => {
	alert("api not working");
	console.log(err);
});
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
		user: null,
		transcript: "",
	};
	resetSearchItem = () => {};

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			this.setState({ user, showAuth: false });
			this.addListners(user);
		});
	}

	//set listners to db word lists
	addListners(user) {
		if (user) {
			const usersRef = this.state.usersRef;
			usersRef.child(user.uid).on("value", (snap) => {
				const data = snap.val();
				if (data)
					this.setState({
						learnList: data.learn || {},
						learnedList: data.learned || {},
					});
			});
		}
		this.state.ignoreRef.once("value", (snap) => {
			this.setState({ ignoreList: snap.val() });
		});
		this.state.uploadsRef.once("value", (snap) => {
			this.setState({ uploadedItems: snap.val() || {}, loading: false });
		});
	}

	//remove words from newWords list
	removeFromNewWords = (list) => {
		const words = { ...this.state.newWords };
		Object.keys(list).forEach((word) => {
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

	//add newWords list to state after extracting from crt file
	setNewWords = (newWords) => {
		this.setState({ newWords, currentSelected: "about_imported" });
	};

	//reset state when clicked on header to come back on home page
	resetState = () => {
		this.resetSearchItem();
		this.setState({
			currentSelected: null,
			newWords: null,
		});
	};

	handleSetAboutImported = (about) => {
		this.setState({ uploadingWords: true });
		uploadImportedWordsToDB(about, this.state.newWords, () =>
			this.setState({ currentSelected: "new_words", uploadingWords: false })
		);
	};

	getWordsFromApi = async (url) => {
		this.setState({ downloadingWords: true });
		const req = await fetch(url);
		if (req.status > 299) {
			alert(req.status);
			window.location.reload();
			return;
		}
		let result = await req.text();
		result = result.replace(/<\w>|<\/\w>|\r|/gm, "");
		let transcript = result.split("\n");
		transcript = transcript.filter(
			(line) =>
				!(
					line.includes("-->") ||
					line > -1 ||
					line.includes("Support us and become VIP member") ||
					line.includes("to remove all ads from www.OpenSubtitles.org") ||
					line.includes("Support us and become VIP member") ||
					line.includes("to remove all ads from www.OpenSubtitles.org") ||
					line.includes("Advertise your product or brand here") ||
					line.includes("contact www.OpenSubtitles.org today") ||
					line.includes("OpenSubtitles") ||
					line.includes("http://") ||
					line.includes("<font") ||
					line.includes("</font") ||
					line.charCodeAt() > 200
				)
		);
		filterWords(
			result,
			{ ...this.state.ignoreList, ...this.state.learnedList },
			(words) => {
				this.setState({
					newWords: words,
					currentSelected: "new_words",
					downloadingWords: false,
					transcript,
				});
			}
		);
	};

	handleAuthClick = () => {
		if (this.state.user) {
			firebase.auth().signOut();
		} else {
			this.setState({ showAuth: true });
		}
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
					transcript={this.state.transcript}
				/>
			);
		else if (this.state.currentSelected === "learning_words")
			renderingComponent = <LearningWords words={this.state.learnList} />;

		return (
			<div className="vocab-builder">
				<nav>
					<h1 onClick={this.resetState}>Vocab Builder</h1>
					<h2
						onClick={() => {
							if (!this.state.user) {
								this.setState({ showAuth: true });
							} else this.setState({ currentSelected: "learning_words" });
						}}
					>
						Learning List
					</h2>
					<div className="auth-btn" onClick={this.handleAuthClick}>
						{this.state.user ? "Logout" : "Login"}
					</div>
				</nav>
				<main>
					{this.state.currentSelected === "new_words" ||
					this.state.currentSelected === "learning_words" ? (
						renderingComponent
					) : (
						<SearchItems
							resetSearchItem={(fn) => (this.resetSearchItem = fn)}
							downloadingWords={this.state.downloadingWords}
							getWordsFromApi={this.getWordsFromApi}
							OpenSubtitles={OpenSubtitles}
						/>
					)}
					{this.state.showAuth ? (
						<Auth close={() => this.setState({ showAuth: false })} />
					) : null}
				</main>
			</div>
		);
	}
}
export default VocabBuilder;
