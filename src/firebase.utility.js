import firebase from "./firebase";

const ignoreRef = firebase.database().ref("ignore");
const learnRef = firebase.database().ref("learn");
const learnedRef = firebase.database().ref("learned");
const uploadRef = firebase.database().ref("uploads");

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

export const uploadImportedWordsToDB = (aboutWordsObj, words) => {
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
				.set(words);

			uploadRef.child(path).set({ ...aboutWordsObj, key });
		}
	});
};
