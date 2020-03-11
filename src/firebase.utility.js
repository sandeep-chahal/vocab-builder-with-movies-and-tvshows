import firebase from "./firebase";

const ignoreRef = firebase.database().ref("ignore");
const learnRef = firebase.database().ref("learn");
const learnedRef = firebase.database().ref("learned");

// update or add new words to firebase
export const updateWordList = (ignoreList, learnedList, learnList) => {
	ignoreRef.update(ignoreList);
	learnRef.update(learnList);
	learnedRef.update(learnedList);
};

export const moveToLearnedFromLearning = word => {
	learnRef.child(word).remove();
	learnedRef.child(word).set(true);
};

const saveUploadedFileInDatabase = (path, aboutObj) => {
	firebase
		.database()
		.ref("uploads")
		.child(path)
		.set(aboutObj);
};

export const uploadSrtFileToServer = (file, aboutObj) => {
	let path = aboutObj.name.toLowerCase();
	path +=
		aboutObj.type === "tv-show"
			? `/S${aboutObj.season}/E${aboutObj.episode}`
			: "";
	console.log(path);
	firebase
		.database()
		.ref("uploads")
		.child(path)
		.once("value", snap => {
			if (!snap.exists()) {
				console.log("gg");
				const storageRef = firebase.storage().ref(makeid(10) + ".srt");
				const task = storageRef.put(file);
				task.on(
					"state_changed",
					snap => {},
					err => {
						console.log(err);
					},
					() => {
						console.log("uploaded");
						task.snapshot.ref.getDownloadURL().then(url => {
							saveUploadedFileInDatabase({ ...aboutObj, url });
						});
					}
				);
			}
		});
};

function makeid(length) {
	var result = "";
	var characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
