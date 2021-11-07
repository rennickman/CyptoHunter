import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import firebaseConfig from "./Config/firebaseConfig";




// Entry point between program and firebase
const firebaseApp = initializeApp(firebaseConfig);


const auth = getAuth(firebaseApp);


// Firebase database
const db = getFirestore(firebaseApp);



export { auth, db };