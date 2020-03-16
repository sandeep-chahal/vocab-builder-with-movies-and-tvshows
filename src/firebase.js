import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

var firebaseConfig = {
	apiKey: "AIzaSyAyvH2rV74bLhE3CIpKgj_pvdObDam7eOE",
	authDomain: "vocab-builder-b715d.firebaseapp.com",
	databaseURL: "https://vocab-builder-b715d.firebaseio.com",
	projectId: "vocab-builder-b715d",
	storageBucket: "vocab-builder-b715d.appspot.com",
	messagingSenderId: "1036252159325",
	appId: "1:1036252159325:web:3da21d81b6e8fe5f251cb4",
	measurementId: "G-D4Y0V6M98N"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => firebase.auth().signInWithPopup(provider);
