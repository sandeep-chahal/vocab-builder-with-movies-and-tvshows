import actionTypes from "./actionTypes";

const INITIAL_STATE = {
	importedWords: null,
	learingWords: null,
	learnedWords: null,
	ignoreWords: null,
	currentSelected: null
};

const reducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		default:
			return state;
	}
};

export default reducer;
