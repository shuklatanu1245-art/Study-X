import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

/**
 * Register a new user with email/password and create their Firestore profile.
 * @param {string} email
 * @param {string} password
 * @param {string} name
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const signUp = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const { uid } = userCredential.user;

  await setDoc(doc(db, 'users', uid), {
    uid,
    name,
    email,
    role: 'student',
    createdAt: serverTimestamp(),
  });

  return userCredential;
};

/**
 * Sign in an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const logIn = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 */
export const logOut = async () => {
  return signOut(auth);
};

/**
 * Fetch the role field for a given user.
 * @param {string} uid
 * @returns {Promise<string|null>}
 */
export const getUserRole = async (uid) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return userDoc.data().role;
  }
  return null;
};

/**
 * Fetch the full Firestore profile for a given user.
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
export const getUserProfile = async (uid) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};
