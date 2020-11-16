import React, { useState, useEffect, Fragment, useRef } from "react";
import "./SearchItems.css";
import Spinner from "../../Assets/Dual Ring.svg";

const SearchItems = (props) => {
	const [loading, setLoading] = useState(false);
	const [mode, setMode] = useState("trending"); //trending, title, search
	const [title, setTitle] = useState(null);
	const [titles, setTitles] = useState([]);
	const [trending, setTrending] = useState([]);
	const [season, setSeason] = useState(0);
	const [downloadingSrt, setDownloadingSrt] = useState(false);
	const api = process.env.REACT_APP_THEMOVIEDB_API;

	const inputRef = useRef();

	useEffect(() => {
		props.resetSearchItem(() => {
			fetchTrending();
			setTitle(null);
			setTitles(null);
			setSeason(0);
			setDownloadingSrt(false);
			setMode("trending");
		});
		async function fetchTrending() {
			const req = await fetch(
				`https://api.themoviedb.org/3/tv/popular?api_key=${api}&language=en-US&page=1`
			);
			const res = await req.json();
			setTrending(
				res.results.filter((item) => item["origin_country"].includes("US"))
			);
			setMode("trending");
			setLoading(false);
		}
		fetchTrending();
	}, []);

	const fetchItems = async (input) => {
		setLoading(true);
		const req = await fetch(
			`https://api.themoviedb.org/3/search/multi?api_key=${api}&language=en-US&query=${input}&page=1&include_adult=false`
		);
		const res = await req.json();
		setTitles(res.results);
		setMode("search");
		setLoading(false);
	};

	const handleInput = (e) => {
		const input = e.target.value;
		if (input.slice()) return;
		setMode("trending");
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const input = inputRef.current.value;
		if (input.slice().length < 3) return alert("not enough input");
		fetchItems(input);
	};

	const displayTitles = (titles = []) => {
		return titles.map((title, i) => {
			return (
				<div
					className="titles"
					key={makeid(5)}
					onClick={() => {
						handleTitleSearch(title);
					}}
				>
					<div
						className="img"
						style={{
							backgroundImage: `url(https://image.tmdb.org/t/p/w500/${title.poster_path})`,
						}}
					></div>
					{title.title || title.original_name}
				</div>
			);
		});
	};

	const handleTitleSearch = async (title) => {
		try {
			setLoading(true);
			const req = await fetch(
				`https://api.themoviedb.org/3/tv/${title.id}?api_key=${api}&language=en-US`
			);
			const res = await req.json();
			let temp = Object.values(res.seasons);
			if (!temp[0].season_number) temp = temp.slice(1);
			setTitle({ title: res.original_name || res.title, seasons: temp });
			setMode("title");
			setLoading(false);
		} catch (err) {
			console.log(err);
			alert("something went wrong");
		}
	};

	const searchBar = () => (
		<Fragment>
			<form onSubmit={handleSubmit}>
				<input
					ref={inputRef}
					type="text"
					className="search"
					placeholder="search..."
					onChange={handleInput}
				/>
			</form>
			{mode === "title" && !loading ? (
				<div className="title">
					<div>{title.title}</div>
					<select
						className="select"
						onChange={(e) => setSeason(parseInt(e.target.value))}
					>
						{title.seasons.map((seasons, index) => {
							return (
								<option key={index} value={index}>
									{window.innerWidth < 650 ? "S" : "Season"} {index + 1}
								</option>
							);
						})}
					</select>
				</div>
			) : null}
		</Fragment>
	);

	const displayTitle = () => {
		const temp = [];
		for (let i = 0; i < title.seasons[season].episode_count; i++) temp.push(i);
		return temp.map((_, index) => (
			<div
				className="item"
				onClick={() => {
					handleGetSRT(`${title.title} S${1 + season}E${index + 1}`);
				}}
				key={index}
			>
				Episode{index + 1}
			</div>
		));
	};

	const handleGetSRT = (search) => {
		setLoading(true);
		props.OpenSubtitles.search({
			query: search,
		}).then((subs) => {
			props.getWordsFromApi(subs.en.utf8);
			setLoading(false);
		});
	};

	const display = () => {
		if (mode === "trending") return displayTitles(trending);
		else if (mode === "title") return displayTitle();
		else if (mode === "search") return displayTitles(titles);
	};
	if (props.downloadingWords || downloadingSrt)
		return <div>{downloadingSrt ? "Downloading..." : "Filtering..."}</div>;

	return (
		<div className="uploaded-items">
			{searchBar()}
			<div className="overflow">
				{loading ? (
					<div style={{ textAlign: "center" }}>Loading</div>
				) : (
					<div className="items-wrapper">{display()}</div>
				)}
			</div>
		</div>
	);
};

export default SearchItems;
function makeid(length) {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
