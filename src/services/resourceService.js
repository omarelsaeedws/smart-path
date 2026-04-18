import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// ── Subscribe ──────────────────────────────────────────────────────────────

export const subscribeToResources = (callback) => {
  const q = query(collection(db, "resources"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const resources = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(resources);
  });
};

export const subscribeToTools = subscribeToResources;

// ── CRUD ───────────────────────────────────────────────────────────────────

/**
 * Add a new resource. logoUrl is stored directly from the form (URL string).
 */
export const addResource = async (resourceData) => {
  return addDoc(collection(db, "resources"), {
    ...resourceData,
    createdAt: serverTimestamp(),
  });
};

/**
 * Update existing resource fields (including logoUrl as a URL string).
 */
export const updateResource = async (resourceId, data) => {
  return updateDoc(doc(db, "resources", resourceId), data);
};

/**
 * Delete resource document from Firestore.
 */
export const deleteResource = async (resourceId) => {
  return deleteDoc(doc(db, "resources", resourceId));
};
