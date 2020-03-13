import React, { useState } from "react";

const UploadedItems = props => {
	const [filteredItems, setFilteredItems] = useState(null);

	const handleClick = item => {
		props.getUploadedWords(item.key);
	};

	const diaplyUploaded = obj => {
		return Object.keys(obj || {}).map(item => (
			<div onClick={() => handleClick(obj[item])} key={item}>
				{item.toUpperCase()}
			</div>
		));
	};
	return (
		<div className="uploaded-items">
			<input type="text" className="search" />
			{diaplyUploaded(props.uploadedItems["tv-show"])}
			{diaplyUploaded(props.uploadedItems["movie"])}
			{diaplyUploaded(props.uploadedItems["random"])}
		</div>
	);
};

export default UploadedItems;
