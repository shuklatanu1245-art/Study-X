import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const subjectsRef = collection(db, 'subjects');

/**
 * Fetch all subjects from the 'subjects' collection.
 * @returns {Promise<Array<{id: string, title: string, classLevel: string}>>}
 */
export const getSubjects = async () => {
  const snapshot = await getDocs(subjectsRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Add a new subject.
 * @param {string} title
 * @param {string} classLevel
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 */
export const addSubject = async (title, classLevel) => {
  return addDoc(subjectsRef, {
    title,
    classLevel,
    createdAt: serverTimestamp(),
  });
};

/**
 * Get the total number of subjects.
 * @returns {Promise<number>}
 */
export const getSubjectCount = async () => {
  const snapshot = await getDocs(subjectsRef);
  return snapshot.size;
};
