import firebase from "./firebase";

const ignoreRef = firebase.database().ref("ignore");
const uploadRef = firebase.database().ref("uploads");
const usersRef = firebase.database().ref("users");

// update or add new words to firebase
export const updateWordList = (uid, ignoreList, learnedList, learnList) => {
	usersRef
		.child(uid)
		.child("learned")
		.update(learnedList);
	usersRef
		.child(uid)
		.child("learn")
		.update(learnList);
	ignoreRef.update(ignoreList);
};

export const moveToLearnedFromLearning = word => {
	const uid = firebase.auth().currentUser.uid;
	usersRef
		.child(uid)
		.child("learn")
		.child(word)
		.remove();
	usersRef
		.child(uid)
		.child("learned")
		.child(word)
		.set(true);
};

export const uploadImportedWordsToDB = (aboutWordsObj, words, callBackFN) => {
	let path = aboutWordsObj.name.toLowerCase();
	path +=
		aboutWordsObj.type === "tv-show"
			? ` S${aboutWordsObj.season} E${aboutWordsObj.episode}`
			: "";
	uploadRef.child(path).once("value", snap => {
		if (!snap.exists()) {
			const key = firebase
				.database()
				.ref("uploadedWords")
				.push()
				.getKey();
			firebase
				.database()
				.ref("uploadedWords")
				.child(key)
				.set(words)
				.then(() => callBackFN())
				.catch(() => callBackFN());

			uploadRef.child(path).set({ ...aboutWordsObj, key });
		} else callBackFN();
	});
};
