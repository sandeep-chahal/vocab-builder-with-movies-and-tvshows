import React, { Fragment } from "react";
import "./AboutImported.css";

class AboutImported extends React.Component {
	state = {
		type: "random"
	};

	displayInputs = type => {
		return (
			<div className="inputs">
				<input
					type="text"
					className="name"
					onChange={this.handleChange}
					name="name"
					placeholder="Name"
				/>
				{type === "yt-video" ? (
					<input
						type="text"
						className="link"
						onChange={this.handleChange}
						name="link"
						placeholder="Link"
					/>
				) : null}
				{type === "tv-show" ? (
					<Fragment>
						<input
							type="number"
							onChange={this.handleChange}
							name="season"
							placeholder="Season"
						/>
						<input
							type="number"
							onChange={this.handleChange}
							name="episode"
							placeholder="Episode"
						/>
					</Fragment>
				) : null}
			</div>
		);
	};
	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value
		});
	};
	render() {
		return (
			<div className="popup-bg">
				<div className="popup">
					<select onChange={this.handleChange} name="type">
						<option value="random">Random</option>
						<option value="tv-show">TV Show</option>
						<option value="movie">Movie</option>
						<option value="yt-video">YT Video</option>
					</select>
					{this.displayInputs(this.state.type)}
				</div>
			</div>
		);
	}
}

export default AboutImported;
