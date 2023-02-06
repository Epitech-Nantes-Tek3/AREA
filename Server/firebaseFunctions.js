const firebase = require("firebase");
// Initialize Firebase
const firebaseConfig = require('./firebaseConfig')
firebase.initializeApp(firebaseConfig);

// Get a reference to the database
var database = firebase.database();

module.exports = {
    getDataFromFireBase: function(uid, service) {
        return new Promise((resolve, reject) => {
            database.ref(`USERS/${uid}/${service}`).on('value', (snapshot) => {
                if (snapshot.val()) {
                    resolve(snapshot.val());
                }
            });
        });
    },
    getDataFromFireBaseServer: function(service) {
      return new Promise((resolve, reject) => {
          database.ref(`SERVER/${service}/`).on('value', (snapshot) => {
              if (snapshot.val()) {
                  resolve(snapshot.val());
              }
          });
      });
  },

    login: function(req, res) {
        const {email, password} = req.body;
        firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
          console.log('User signed in:', userCredential.user.uid);
          res.json({userUid: userCredential.user.uid});
        }).catch((error) => {
          console.log('Error at the sign in:', error);
          res.json({userUid: 'error'}).status(400);
        })
    },

    register: function(req, res) {
        const { email, password } = req.body;
        console.log(email, password);
        firebase.auth()
        .createUserWithEmailAndPassword(email, password).then((userCredential) => {
          const db = firebase.database().ref(`USERS/${userCredential.user.uid}/`);
          db.set({
            empty: 'empty'
          })
          console.log('Successfully created new user:', userCredential.user.uid)
          res.json({userUid: userCredential.user.uid});
        }).catch((error) => {
          console.log('Error creating new user:', error);
          res.json({userUid: 'error'}).status(400);
        });
    },
    /**
     * @brief Function to write data to a specific path in Firebase database
     * @param {*} path The path in the Firebase database where the data will be written to. 
     * @param {*} data The data that will be written to the specified path.
     */
    setDataInDb: function(path, data) {
      database.ref(`${path}/`).set(data, function(error) {
        if (error) {
          console.error("Error writing data to Firebase: ", error);
        } else {
          console.log("Data has been saved to Firebase successfully.");
        }
      });
    }
}