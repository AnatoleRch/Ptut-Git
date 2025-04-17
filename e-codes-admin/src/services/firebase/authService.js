import { 
    signInWithEmailAndPassword, 
    // createUserWithEmailAndPassword, 
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
  } from 'firebase/auth';
  import {auth} from './firebaseInit'
  
  export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  // export const registerUser = (email, password) => {
  //   return createUserWithEmailAndPassword(auth, email, password);
  // };
  
  export const logoutUser = () => {
    return signOut(auth);
  };
  
  export const getCurrentUser = () => {
    return auth.currentUser;
  };
  
  export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
  };

  export const passwordResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email)
  }
  