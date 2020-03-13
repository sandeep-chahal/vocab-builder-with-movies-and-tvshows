import React, { useState } from "react";

const UploadedItems = props => {
	const [filteredItems, setFilteredItems] = useState(null);

	const handleClick = item => {
		props.downloadCrtFileFromServer(item);
	};

	const displayTvShows = obj => {
		console.log(Object.keys(obj));
		return Object.keys(obj || {}).map(item => (
			<div onClick={() => handleClick(obj[item])} key={item}>
				{item.toUpperCase()}
			</div>
		));
	};
	return (
		<div className="uploaded-items">
			<input type="text" className="search" />
			{displayTvShows(props.uploadedItems["tv-show"])}
		</div>
	);
};

export default UploadedItems;
