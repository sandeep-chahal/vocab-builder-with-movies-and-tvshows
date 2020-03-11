import React, { Fragment } from "react";
import "./AboutImported.css";

class AboutImported extends React.Component {
	state = {
		type: "random",
		name: "",
		season: 0,
		episode: 0,
		link: 0
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
					value={this.state.name}
				/>
				{type === "yt-video" ? (
					<input
						type="text"
						className="link"
						onChange={this.handleChange}
						name="link"
						placeholder="Link"
						value={this.state.link}
					/>
				) : null}
				{type === "tv-show" ? (
					<Fragment>
						<input
							type="number"
							onChange={this.handleChange}
							name="season"
							placeholder="Season"
							value={this.state.season}
						/>
						<input
							type="number"
							onChange={this.handleChange}
							name="episode"
							placeholder="Episode"
							value={this.state.episode}
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

	handleSubmit = () => {
		const type = this.state.type;
		const aboutObj = {};
		if (type === "random" || type === "movie") {
			if (this.state.name) {
				aboutObj["name"] = this.state.name;
			} else return;
		}
		if (type === "tv-show") {
			if (this.state.name && this.state.season && this.state.episode) {
				aboutObj["name"] = this.state.name;
				aboutObj["season"] = this.state.season;
				aboutObj["episode"] = this.state.episode;
			} else return;
		}
		if (type === "yt-video") {
			if (this.state.name && this.state.link) {
				aboutObj["name"] = this.state.name;
				aboutObj["link"] = this.state.link;
			} else return;
		}
		aboutObj["type"] = type;
		this.props.setAbout(aboutObj);
	};

	handleClose = e => {
		if (e.target.classList[0] === "popup-bg") this.props.close();
	};

	render() {
		return (
			<div className="popup-bg" onClick={this.handleClose}>
				<div className="popup">
					<select onChange={this.handleChange} name="type">
						<option value="random">Random</option>
						<option value="tv-show">TV Show</option>
						<option value="movie">Movie</option>
						<option value="yt-video">YT Video</option>
					</select>
					{this.displayInputs(this.state.type)}
					<div className="submit-btn" onClick={this.handleSubmit}>
						Done
					</div>
				</div>
			</div>
		);
	}
}

export default AboutImported;
