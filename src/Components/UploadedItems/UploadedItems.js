import React, { useState } from "react";
import "./UploadedItems.css";

const UploadedItems = props => {
	const [filteredItems, setFilteredItems] = useState(null);

	const handleClick = item => {
		props.getUploadedWords(item.key);
	};

	const diaplyUploaded = obj => {
		return Object.keys(obj || {}).map(item => (
			<div className="item" onClick={() => handleClick(obj[item])} key={item}>
				{item.toUpperCase()}
			</div>
		));
	};
	return (
		<div className="uploaded-items">
			<input type="text" className="search" placeholder="search..." />
			<div className="items-wrapper">
				{diaplyUploaded(props.uploadedItems["tv-show"])}
				{diaplyUploaded(props.uploadedItems["movie"])}
				{diaplyUploaded(props.uploadedItems["random"])}
			</div>
		</div>
	);
};

export default UploadedItems;
