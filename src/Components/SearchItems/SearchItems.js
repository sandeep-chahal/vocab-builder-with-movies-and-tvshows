import React, { useState, useEffect, Fragment } from "react";
import "./SearchItems.css";
import Spinner from "../../Assets/Dual Ring.svg";

const SearchItems = (props) => {
	const [items, setItems] = useState([]);
	const [title, setTitle] = useState(null);
	const [titles, setTitles] = useState(null);
	const [season, setSeason] = useState(1);
	const [downloadingSrt, setDownloadingSrt] = useState(false);
	const api = process.env.REACT_APP_THEMOVIEDB_API;

	useEffect(() => {
		(async function () {
			const req = await fetch(
				`https://api.themoviedb.org/3/tv/popular?api_key=${api}&language=en-US&page=1`
			);
			const res = await req.json();
			setTitles(
				res.results.filter((item) => item["origin_country"].includes("US"))
			);
		})();
	}, []);

	const fetchItems = async (input) => {
		const req = await fetch(
			`https://api.themoviedb.org/3/search/multi?api_key=${api}&language=en-US&query=${input}&page=1&include_adult=false`
		);
		const res = await req.json();
		setTitles(res.results);
	};

	const handleInput = (e) => {
		const input = e.target.value;
		if (input.length > 2) {
			fetchItems(input);
		} else if (!items.length) {
			setItems([]);
		}
	};

	const displayTitles = () => {
		return titles.map((title) => {
			return (
				<div
					className="titles"
					key={title.title || title.original_name}
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
		const req = await fetch(
			`https://api.themoviedb.org/3/tv/${title.id}?api_key=${api}&language=en-US`
		);
		const res = await req.json();
		let temp = Object.values(res.seasons);
		if (!temp[0].season_number) temp = temp.slice(1);
		setTitle({ title: res.original_name || res.title, seasons: temp });
		setTitles(null);
	};

	const searchBar = () => (
		<Fragment>
			<input
				type="text"
				className="search"
				placeholder="search..."
				onChange={handleInput}
			/>
			{title ? (
				<select className="select" onChange={(e) => setSeason(e.target.value)}>
					{title.seasons.map((seasons, index) => {
						return (
							<option key={index} value={index}>
								Season {index + 1}
							</option>
						);
					})}
				</select>
			) : null}
		</Fragment>
	);

	const displayTitle = () => {
		const temp = [];
		for (let i = 0; i < title.seasons[season].episode_count; i++) temp.push(i);
		return temp.map((_, index) => (
			<div
				className="item"
				onClick={() =>
					handleGetSRT(`${title.title} S${season + 1}E${index + 1}`)
				}
				key={index}
			>
				Episode{index + 1}
			</div>
		));
	};

	const handleGetSRT = (search) => {
		setDownloadingSrt(true);
		props.OpenSubtitles.search({
			query: search,
		}).then((subs) => {
			props.getWordsFromApi(subs.en.utf8);
		});
	};

	const display = () => {
		if (titles) {
			return displayTitles();
		}
		if (title) {
			return displayTitle();
		}
	};
	if (props.downloadingWords || downloadingSrt)
		return <div>{downloadingSrt ? "Downloading..." : "Filtering..."}</div>;

	return (
		<div className="uploaded-items">
			{searchBar()}
			<div className="overflow">
				<div className="items-wrapper">{display()}</div>
			</div>
		</div>
	);
};

export default SearchItems;
