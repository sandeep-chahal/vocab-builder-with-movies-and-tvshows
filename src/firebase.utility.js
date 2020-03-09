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
