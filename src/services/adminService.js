import { db } from "../lib/firebase";
import { 
  collection, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";

// Fetch all users real-time
export const subscribeToUsers = (callback) => {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(users);
  });
};

// Update User Role (Promote/Demote)
export const updateUserRole = async (userId, newRole) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { role: newRole });
};

// Update User Status (Suspend/Activate)
export const updateUserStatus = async (userId, newStatus) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { status: newStatus });
};

// Delete User Document (Note: this only deletes from Firestore, deleting from Auth requires Cloud Function)
export const deleteUserDoc = async (userId) => {
  const userRef = doc(db, "users", userId);
  await deleteDoc(userRef);
};
