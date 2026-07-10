import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

const scoresRef = collection(db, 'scores');

/**
 * Submit a quiz score for a user.
 * @param {string} uid
 * @param {string} quizId
 * @param {number} score
 * @param {number} totalQuestions
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 */
export const submitScore = async (uid, quizId, score, totalQuestions) => {
  return addDoc(scoresRef, {
    uid,
    quizId,
    score,
    totalQuestions,
    completedAt: serverTimestamp(),
  });
};

/**
 * Fetch all scores for a given user, most recent first.
 * @param {string} uid
 * @returns {Promise<Array<Object>>}
 */
export const getScoresByUser = async (uid) => {
  const q = query(
    scoresRef,
    where('uid', '==', uid),
    orderBy('completedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

/**
 * Fetch all scores for a given quiz.
 * @param {string} quizId
 * @returns {Promise<Array<Object>>}
 */
export const getScoresByQuiz = async (quizId) => {
  const q = query(scoresRef, where('quizId', '==', quizId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

/**
 * Fetch every score document in the collection.
 * @returns {Promise<Array<Object>>}
 */
export const getAllScores = async () => {
  const snapshot = await getDocs(scoresRef);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};
