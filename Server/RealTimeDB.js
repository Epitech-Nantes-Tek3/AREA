const firebase = require("firebase");

// Initialize Firebase
const firebaseConfig = require('./firebaseconfig')
firebase.initializeApp(firebaseConfig);

// Get a reference to the database
var database = firebase.database();

module.exports = {
    getDataFromFireBase: function(uid, service) {
        return new Promise((resolve, reject) => {
            database.ref(`${uid}/${service}`).on('value', (snapshot) => {
                if (snapshot.val()) {
                    resolve(snapshot.val());
                } else {
                    reject(Error("Error fetching data"))
                }
            });
        });
    }
}