import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Get user progress for a specific roadmap.
 * Returns { completedLessons: [], progress: 0 } if not found.
 */
export async function getUserProgress(userId, roadmapId) {
  const ref = doc(db, "userProgress", userId, "roadmaps", roadmapId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { completedLessons: [], progress: 0 };
  return snap.data();
}

/**
 * Mark a lesson as complete and recalculate progress %.
 */
export async function markLessonComplete(userId, roadmapId, lessonId, totalLessons) {
  const ref = doc(db, "userProgress", userId, "roadmaps", roadmapId);
  const snap = await getDoc(ref);

  let completedLessons = [];
  if (snap.exists()) {
    completedLessons = snap.data().completedLessons || [];
  }

  if (completedLessons.includes(lessonId)) {
    return { completedLessons, progress: snap.data()?.progress || 0 };
  }

  const newCompleted = [...completedLessons, lessonId];
  const newProgress =
    totalLessons > 0 ? Math.round((newCompleted.length / totalLessons) * 100) : 0;

  await setDoc(
    ref,
    { completedLessons: newCompleted, progress: newProgress, updatedAt: serverTimestamp() },
    { merge: true }
  );

  return { completedLessons: newCompleted, progress: newProgress };
}

/**
 * Save the user's active roadmap ID to /userProgress/{userId}.
 */
export async function setActiveRoadmap(userId, roadmapId) {
  const ref = doc(db, "userProgress", userId);
  await setDoc(ref, { activeRoadmapId: roadmapId, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Get the user's active roadmap ID from /userProgress/{userId}.
 * Returns null if not set.
 */
export async function getActiveRoadmapId(userId) {
  const ref = doc(db, "userProgress", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data().activeRoadmapId || null;
}

/**
 * Determine if a lesson is unlocked based on its order (1-indexed).
 * Lesson 1 is always unlocked.
 * Lesson N is unlocked if lesson N-1 lessonId is in completedLessons.
 */
export function isLessonUnlocked(completedLessons, allLessons, lessonId) {
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  if (idx === -1) return false;
  if (idx === 0) return true;
  const prevLesson = allLessons[idx - 1];
  return completedLessons.includes(prevLesson.id);
}
