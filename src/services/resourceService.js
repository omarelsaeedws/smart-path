import { db } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp
} from "firebase/firestore";

// Subscribe to Resources
export const subscribeToResources = (callback) => {
  const q = query(collection(db, "resources"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const resources = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(resources);
  });
};

export const subscribeToTools = subscribeToResources;

// Add Resource
export const addResource = async (resourceData) => {
  await addDoc(collection(db, "resources"), {
    ...resourceData,
    createdAt: serverTimestamp()
  });
};

// Delete Resource
export const deleteResource = async (resourceId) => {
  await deleteDoc(doc(db, "resources", resourceId));
};
