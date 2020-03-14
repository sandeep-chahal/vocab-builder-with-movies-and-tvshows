import React, { useState } from "react";
import "./UploadedItems.css";
import Spinner from "../../Assets/Dual Ring.svg";

const UploadedItems = props => {
	const [filteredItems, setFilteredItems] = useState(null);

	const handleClick = item => {
		props.getUploadedWords(item.key);
	};

	const displayUplaodedWords = obj => {
		return Object.keys(obj || {}).map(item => (
			<div className="item" onClick={() => handleClick(obj[item])} key={item}>
				{item}
			</div>
		));
	};
	const handleInput = e => {
		let value = e.target.value;
		if (value.length > 2) {
			filterItems(value);
		} else setFilteredItems(null);
	};

	const filterItems = value => {
		value = value.toLowerCase();
		const itemsNames = Object.keys(props.uploadedItems || {});
		const filteredObj = {};
		itemsNames.forEach(item =>
			item.includes(value)
				? (filteredObj[item] = props.uploadedItems[item])
				: null
		);
		setFilteredItems(filteredObj);
	};

	return (
		<div className="uploaded-items">
			<input
				type="text"
				className="search"
				placeholder="search..."
				onChange={handleInput}
			/>
			<div className="items-wrapper">
				{props.downloadingWords ? (
					<img
						alt="downloading...."
						src={Spinner}
						className="downloadingSpinner"
					/>
				) : filteredItems ? (
					displayUplaodedWords(filteredItems)
				) : (
					displayUplaodedWords(props.uploadedItems)
				)}
			</div>
		</div>
	);
};

export default UploadedItems;
