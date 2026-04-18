import { db } from "../lib/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const COLLECTION = "categories";

/**
 * Subscribe to all categories in real-time (ordered by name asc).
 * Returns an unsubscribe function.
 */
export function subscribeToCategories(callback) {
  // NOTE: No orderBy here — avoids Firestore composite index requirement in production.
  // Categories are sorted client-side instead.
  return onSnapshot(collection(db, COLLECTION), (snap) => {
    const cats = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (a.name || "").localeCompare(b.name || "", "ar"));
    callback(cats);
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
