const firebase = require("firebase");
// Initialize Firebase
const firebaseConfig = require('./firebaseConfig')
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
    },

    login: function(req, res) {
        const {email, password} = req.body;
        firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
          console.log('User signed in:', userCredential.user.uid);
          res.sendStatus(200)
        }).catch((error) => {
          console.log('Error at the sign in:', error);
          res.send(error).status(400);
        })
    },

    register: function(req, res) {
        const { email, password } = req.body;
        firebase.auth()
        .createUserWithEmailAndPassword(email, password).then((userCredential) => {
          console.log('Successfully created new user:', userCredential.user.uid)
          res.sendStatus(200);
        }).catch((error) => {
          console.log('Error creating new user:', error);
          res.send(error).status(400);
        });
    }
}