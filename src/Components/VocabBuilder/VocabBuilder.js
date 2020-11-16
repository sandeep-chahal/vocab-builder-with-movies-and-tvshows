import React, { Component } from "react";
import "./VocabBuilder.css";
import Spinner from "../../Assets/Infinity-loader.svg";
import ImportedWords from "../ImportedWords";
import filterWords from "../../filterWords";
import SearchItems from "../SearchItems/SearchItems";
import ignoreList from "../../Assets/data.json";
import OS from "opensubtitles-api";

class VocabBuilder extends Component {
	state = {
		ignoreList: ignoreList,
		visitedWords: {},
		currentSelected: null,
		loading: true,
		downloadingWords: false,
		transcript: "",
		subApi: 0, // 0 -> loading, 1 -> loaded, 2 -> error
		opensubtitles: null,
	};
	resetSearchItem = () => {};

	componentDidMount() {
		// connect to subtitles api
		// const visitedWords = {};
		let visitedWords = {};
		try {
			visitedWords = JSON.parse(localStorage.getItem("visited") || {});
		} catch (err) {}
		const OpenSubtitles = new OS({
			useragent: process.env.REACT_APP_USERAGENT,
			username: process.env.REACT_APP_USERNAME,
			password: process.env.REACT_APP_PASSWORD,
			ssl: true,
		});
		OpenSubtitles.login()
			.then(() => {
				this.setState({
					subApi: 1,
					loading: false,
					opensubtitles: OpenSubtitles,
					visitedWords,
				});
			})
			.catch((err) => {
				alert("api not working", err.message);
				console.log("Error:", err);
				this.setState({
					subApi: 2,
					loading: false,
					visitedWords,
				});
			});
	}

	// add word to visited list
	addToVisited = (word) => {
		this.setState(
			(prevState) => ({
				visitedWords: { ...prevState.visitedWords, [word]: true },
			}),
			() => {
				localStorage.setItem(
					"visited",
					JSON.stringify(this.state.visitedWords)
				);
			}
		);
	};

	//reset state when clicked on header to come back on home page
	resetState = () => {
		this.resetSearchItem();
		this.setState({
			currentSelected: null,
			newWords: {},
		});
	};

	getWordsFromApi = async (url) => {
		this.setState({ downloadingWords: true });
		const [newWords, transcript] = await filterWords(
			url,
			this.state.ignoreList
		);
		this.setState({
			newWords: newWords,
			currentSelected: "new",
			downloadingWords: false,
			transcript,
		});
	};

	render() {
		const type = this.state.currentSelected;
		// if loading then show spinner
		if (this.state.loading)
			return <img className="spinner" alt="loading" src={Spinner} />;

		return (
			<div className="vocab-builder">
				<nav>
					<h1 onClick={this.resetState}>Vocab Builder</h1>
					<div
						onClick={() => {
							this.setState({
								currentSelected: "visited",
							});
						}}
						className="visited-btn"
					>
						Visited Words
					</div>
				</nav>
				<main>
					{type ? (
						<ImportedWords
							visitedWords={type === "new" ? this.state.visitedWords : {}}
							words={
								type === "new" ? this.state.newWords : this.state.visitedWords
							}
							addToVisited={type === "new" ? this.addToVisited : () => {}}
							transcript={this.state.transcript}
							type={type}
						/>
					) : (
						<SearchItems
							resetSearchItem={(fn) => (this.resetSearchItem = fn)}
							downloadingWords={this.state.downloadingWords}
							getWordsFromApi={this.getWordsFromApi}
							OpenSubtitles={this.state.opensubtitles}
						/>
					)}
				</main>
			</div>
		);
	}
}
export default VocabBuilder;
