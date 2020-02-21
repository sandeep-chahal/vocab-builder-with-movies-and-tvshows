import React from "react";
import "./VocabBuilder.css";

import DropZone from "../DropZone/DropZone";

class VocabBuilder extends React.Component {
	state = {
		file: null
	};

	addFile = file => {
		this.setState({ file: file });
	};

	render() {
		return (
			<div className="vocab-builder">
				<h1>Vocab Builder</h1>
				{this.state.file ? null : <DropZone addFile={this.addFile} />}
			</div>
		);
	}
}
export default VocabBuilder;
