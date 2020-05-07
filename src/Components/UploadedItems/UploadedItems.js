import React, { useState } from "react";
import "./UploadedItems.css";
import Spinner from "../../Assets/Dual Ring.svg";

const UploadedItems = (props) => {
	const [items, setItems] = useState([]);
	const [title, setTitle] = useState(null);
	const [titles, setTitles] = useState(null);
	const api = process.env.REACT_APP_THEMOVIEDB_API;

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
					className="item"
					key={title.title || title.original_name}
					onClick={() => {
						handleTitleSearch(title);
					}}
				>
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
		console.log(res);
		let temp = Object.values(res.seasons);
		if (!temp[0].season_number) temp = temp.slice(1);
		setTitle({ title: res.original_name || res.title, seasons: temp });
		setTitles(null);
	};

	const searchBar = (
		<input
			type="text"
			className="search"
			placeholder="search..."
			onChange={handleInput}
		/>
	);

	const displayTitle = () => {
		console.log(title);
		const temp = [];
		title.seasons.forEach((seasons) => {
			for (let e = 1; e <= seasons.episode_count; e++) {
				temp.push(`S${seasons.season_number}E${e}`);
			}
		});
		console.log(temp);
		return temp.map((se) => (
			<div onClick={() => handleGetSRT(`${title.title} ${se}`)} key={se}>
				{se}
			</div>
		));
	};

	const handleGetSRT = (search) => {
		props.OpenSubtitles.search({
			query: search,
		}).then((subs) => {
			props.getWordsFromApi(subs.en.utf8);
			console.log(subs.en);
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

	return (
		<div className="uploaded-items">
			{searchBar}
			<div className="items-wrapper">
				{props.downloadingWords ? (
					<img
						alt="downloading...."
						src={Spinner}
						className="downloadingSpinner"
					/>
				) : (
					display()
				)}
			</div>
		</div>
	);
};

export default UploadedItems;
