if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyAL9QVNztcE7tfQe-qW7LhCOKaBSBDT-_M",
    authDomain: "obnd-bo.firebaseapp.com",
    projectId: "obnd-bo",
    storageBucket: "obnd-bo.appspot.com",
    messagingSenderId: "434741351257",
    appId: "1:434741351257:web:719612ae18d25a278bf248"
  });
}
const db = firebase.firestore();
