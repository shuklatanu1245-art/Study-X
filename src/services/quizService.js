import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const quizzesRef = collection(db, 'quizzes');

/**
 * Fetch all quizzes for a given subject.
 * @param {string} subjectId
 * @returns {Promise<Array<Object>>}
 */
export const getQuizzesBySubject = async (subjectId) => {
  const q = query(quizzesRef, where('subjectId', '==', subjectId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

/**
 * Add a new quiz.
 * @param {string} subjectId
 * @param {string} title
 * @param {number} durationMinutes
 * @param {Array<{qId: string, questionText: string, optionA: string, optionB: string, optionC: string, optionD: string, correctOption: string}>} questions
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 */
export const addQuiz = async (subjectId, title, durationMinutes, questions) => {
  return addDoc(quizzesRef, {
    subjectId,
    title,
    durationMinutes,
    questions,
    createdAt: serverTimestamp(),
  });
};

/**
 * Fetch a single quiz by its document ID.
 * @param {string} quizId
 * @returns {Promise<Object|null>}
 */
export const getQuizById = async (quizId) => {
  const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
  if (quizDoc.exists()) {
    return { id: quizDoc.id, ...quizDoc.data() };
  }
  return null;
};

/**
 * Get the total number of quizzes.
 * @returns {Promise<number>}
 */
export const getQuizCount = async () => {
  const snapshot = await getDocs(quizzesRef);
  return snapshot.size;
};
