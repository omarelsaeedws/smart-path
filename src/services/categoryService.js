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

const COLLECTION = "categories";

/**
 * Subscribe to all categories in real-time (ordered by name asc).
 * Returns an unsubscribe function.
 */
export function subscribeToCategories(callback) {
  const q = query(collection(db, COLLECTION), orderBy("name", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

/**
 * Add a new category document.
 */
export async function addCategory(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/**
 * Update an existing category document.
 */
export async function updateCategory(id, data) {
  return updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a category document.
 */
export async function deleteCategory(id) {
  return deleteDoc(doc(db, COLLECTION, id));
}
