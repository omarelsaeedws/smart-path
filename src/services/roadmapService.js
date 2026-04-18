import { db } from "../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// ── Roadmaps ──────────────────────────────────────────────────────────────

export async function getRoadmaps() {
  const snap = await getDocs(
    query(collection(db, "roadmaps"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getRoadmapById(roadmapId) {
  const snap = await getDoc(doc(db, "roadmaps", roadmapId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function addRoadmap(data) {
  return addDoc(collection(db, "roadmaps"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/** Update top-level roadmap fields (title, description, categoryId, level, etc.) */
export async function updateRoadmap(roadmapId, data) {
  return updateDoc(doc(db, "roadmaps", roadmapId), data);
}

export async function deleteRoadmap(roadmapId) {
  return deleteDoc(doc(db, "roadmaps", roadmapId));
}

// ── Weeks ──────────────────────────────────────────────────────────────────

export async function getWeeks(roadmapId) {
  const snap = await getDocs(
    query(
      collection(db, "roadmaps", roadmapId, "weeks"),
      orderBy("weekNumber", "asc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addWeek(roadmapId, data) {
  return addDoc(collection(db, "roadmaps", roadmapId, "weeks"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

/** Update a week (weekNumber, weekGoal, etc.) */
export async function updateWeek(roadmapId, weekId, data) {
  return updateDoc(
    doc(db, "roadmaps", roadmapId, "weeks", weekId),
    data
  );
}

export async function deleteWeek(roadmapId, weekId) {
  return deleteDoc(doc(db, "roadmaps", roadmapId, "weeks", weekId));
}

// ── Lessons ────────────────────────────────────────────────────────────────

export async function getLessons(roadmapId, weekId) {
  const snap = await getDocs(
    query(
      collection(db, "roadmaps", roadmapId, "weeks", weekId, "lessons"),
      orderBy("order", "asc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addLesson(roadmapId, weekId, data) {
  return addDoc(
    collection(db, "roadmaps", roadmapId, "weeks", weekId, "lessons"),
    {
      ...data,
      createdAt: serverTimestamp(),
    }
  );
}

/** Update a lesson (title, description, resourceLink, source, order, estimatedHours) */
export async function updateLesson(roadmapId, weekId, lessonId, data) {
  return updateDoc(
    doc(db, "roadmaps", roadmapId, "weeks", weekId, "lessons", lessonId),
    data
  );
}

export async function deleteLesson(roadmapId, weekId, lessonId) {
  return deleteDoc(
    doc(db, "roadmaps", roadmapId, "weeks", weekId, "lessons", lessonId)
  );
}
