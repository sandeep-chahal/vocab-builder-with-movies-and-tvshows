import React from "react";
import "./Auth.css";

import { signInWithGoogle } from "../../firebase";

const Auth = props => {
	const handleClose = e => {
		if (e.target.classList.contains("popup-bg")) props.close();
	};
	return (
		<div className="popup-bg" onClick={handleClose}>
			<div className="auth">
				<div className="google-btn" onClick={signInWithGoogle}>
					Go with Google
				</div>
			</div>
		</div>
	);
};

export default Auth;
