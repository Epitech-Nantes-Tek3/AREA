/**
 * firebaseFunctions module
 * @module firebaseFunctions
 */

/**
 * @constant firebase
 * @requires firebase
 */
const firebase = require("firebase");

/**
 * @constant firebaseConfig
 * @requires firebaseConfig
 */
const firebaseConfig = require('./firebaseConfig')
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

module.exports = {
    /**
     * Returns an object containing the user's data
     * @function getDataFromFireBase
     * @param {String} uid uid of the user
     * @param {String} service Service where the desired data is stored.
     * @returns return a promise of an object containing the user's data
    */
    getDataFromFireBase: function(uid, service) {
        return new Promise((resolve, reject) => {
            database.ref(`USERS/${uid}/${service}`).on('value', (snapshot) => {
                if (snapshot.val()) {
                    resolve(snapshot.val());
                }
            });
        });
    },
    /**
     * Returns an object containing the all user
     * @function getDataFromFireBase
     * @returns return a promise of an object containing the all user
    */
    getAllUsersFromFireBase: function() {
        return new Promise((resolve, reject) => {
            database.ref(`USERS/`).on('value', (snapshot) => {
                if (snapshot.val()) {
                    resolve(snapshot.val());
                }
            });
        });
    },
    /**
     * Returns an object containing the server data
     * @function getDataFromFireBase
     * @param {String} service Service where the desired data is stored.
     * @returns return a promise of an object containing the server data
    */
    getDataFromFireBaseServer: function(service) {
        return new Promise((resolve, reject) => {
            database.ref(`SERVER/${service}/`).on('value', (snapshot) => {
                if (snapshot.val()) {
                    resolve(snapshot.val());
                }
            });
        });
    },
    /**
    * removeDataFromFireBase - This function is used to remove data from firebase at a precise path
    * @param {string} path - path to the data to be removed
    */
    removeDataFromFireBase: function(path) {
        return new Promise((resolve, reject) => {
            database.ref(path).on('value', (snapshot) => {
                if (snapshot.val()) {
                    resolve(snapshot.ref.remove());
                }
                reject("Data not found");
            });
        });
    },

    /**
    * Firebase function which allows the user to login.
    * @function login
    * @param {Object} req - Express request object
    * @param {Object} res - Express response object
    */
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
    /**
    * Firebase function which allows the user to register.
    * @function login
    * @param {Object} req - Express request object
    * @param {Object} res - Express response object
    */
    register: function(req, res) {
        const { email, password } = req.body;
        console.log(email, password);
        firebase.auth()
        .createUserWithEmailAndPassword(email, password).then((userCredential) => {
            const db = firebase.database().ref(`USERS/${userCredential.user.uid}/`);
            db.set({
                email: email,
            })
            const dbIss = firebase.database().ref(`USERS/${userCredential.user.uid}/IssStation`);
            dbIss.set({
                gap: 1000,
                latitude : 47.218102,
                longitude : -1.552800 
            })
            const dbOMS = firebase.database().ref(`USERS/${userCredential.user.uid}/OpenMeteoService`);
            dbOMS.set({
                latitude : 47.218102,
                longitude : -1.552800 
            })
            console.log('Successfully created new user:', userCredential.user.uid)
            res.json({userUid: userCredential.user.uid});
        }).catch((error) => {
            console.log('Error creating new user:', error);
            res.json({userUid: 'error'}).status(400);
        });
    },
    /**
     * Function to write data to a specific path in Firebase database
     * @function setDataInDb
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
    },
    /**
    * Firebase function that allows the user to reset the password.
    * @function login
    * @param {Object} req - Express request object
    * @param {Object} res - Express response object
    */
    resetPassword: function(req, res) {
        const { email } = req.body;
        console.log(email)
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            console.log('Email sent to', email, 'for password reset');
            res.json({emailSent: true});
        }).catch((error) => {
            console.log('Error sending email:', error);
            res.json({emailSent: false});
        })
    }
}