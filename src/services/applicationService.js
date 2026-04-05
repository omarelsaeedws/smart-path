import { db } from "../lib/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "applications";

/**
 * Subscribe to all applications in real-time (ordered by createdAt desc).
 * Returns an unsubscribe function.
 */
export function subscribeToApplications(callback) {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}

/**
 * Add a new application document.
 */
export async function addApplication(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/**
 * Update an existing application document.
 */
export async function updateApplication(id, data) {
  return updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an application document.
 */
export async function deleteApplication(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}
