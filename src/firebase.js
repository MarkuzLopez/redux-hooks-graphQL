import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

let firebaseConfig = {
    apiKey: "AIzaSyBGLnHcAPP9KUqs9yFPlQHTN9WdRyCZL2I",
    authDomain: "login-react-233f6.firebaseapp.com",
    databaseURL: "https://login-react-233f6.firebaseio.com",
    projectId: "login-react-233f6",
    storageBucket: "login-react-233f6.appspot.com",
    messagingSenderId: "179761346122",
    appId: "1:179761346122:web:1dbe417577cec0e16618b3"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

let db = firebase.firestore().collection('favs');

export function getFavs(uid) {
  return db.doc(uid).get()
          .then( snap => {
            console.log('users duck', snap.data())
            return snap.data().favorites
          })
}

export function updateDB(array, uid) { 
  db.doc(uid).set({favorites: [...array]}).then( () => {
    console.log('Se actualizo correctamente');
  }).catch(err => { 
    console.log(err);
  })
}

// autenticacion por medio de google
export function loginWithGoogle () {
    let provider = new firebase.auth.GoogleAuthProvider()

    return firebase.auth().signInWithPopup(provider)
        .then(snap => snap.user)
}

// funcion para desloguearte del sistema 
export function signOutGoogle() {
  firebase.auth().signOut()
}
