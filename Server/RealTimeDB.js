const firebase = require("firebase");

// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAKc_tJD5cFrUnWwD9sIfxl7Xo1Q5NWarM",
    authDomain: "area-f3463.firebaseapp.com",
    databaseURL: "https://area-f3463-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "area-f3463",
    storageBucket: "area-f3463.appspot.com",
    messagingSenderId: "1081092664358",
    appId: "1:1081092664358:web:e57f97ac635b04de3d0ae7",
    measurementId: "G-1JNT4XPRZN"
  };
firebase.initializeApp(firebaseConfig);

// Get a reference to the database
var database = firebase.database();

module.exports = {
    getDataFromFireBase: function(uid, service, value) {
        database.ref(`${uid}/${service}`).once('value')
        .then(function(snapshot) {
            console.log( snapshot.val() )
        })
    }
}