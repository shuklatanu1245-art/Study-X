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

const chaptersRef = collection(db, 'chapters');

/**
 * Fetch all chapters for a given subject, ordered by 'order' ascending.
 * @param {string} subjectId
 * @returns {Promise<Array<Object>>}
 */
export const getChaptersBySubject = async (subjectId) => {
  const q = query(
    chaptersRef,
    where('subjectId', '==', subjectId),
    orderBy('order', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Add a new chapter to the 'chapters' collection.
 * @param {string} subjectId
 * @param {string} title
 * @param {string} contentText
 * @param {string} pdfUrl
 * @param {number} order
 * @returns {Promise<import('firebase/firestore').DocumentReference>}
 */
export const addChapter = async (subjectId, title, contentText, pdfUrl, order) => {
  return addDoc(chaptersRef, {
    subjectId,
    title,
    contentText,
    pdfUrl,
    order,
    createdAt: serverTimestamp(),
  });
};
