import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

/**
 * Get the current user's rating for a specific roadmap.
 * Returns rating value (number) or null if not rated yet.
 */
export async function getUserRating(userId, roadmapId) {
  if (!userId || !roadmapId) return null;
  const ratingRef = doc(db, "ratings", `${userId}_${roadmapId}`);
  const snap = await getDoc(ratingRef);
  if (snap.exists()) {
    return snap.data().rating;
  }
  return null;
}

/**
 * Submit or update a user's rating for a roadmap.
 * This function also calculates the new average rating and updates the roadmap document.
 */
export async function submitRating(userId, roadmapId, ratingScore) {
  if (!userId || !roadmapId || typeof ratingScore !== "number" || ratingScore < 1 || ratingScore > 5) {
    throw new Error("Invalid rating score or missing parameters");
  }

  const ratingDocId = `${userId}_${roadmapId}`;
  const ratingRef = doc(db, "ratings", ratingDocId);
  const roadmapRef = doc(db, "roadmaps", roadmapId);

  // Get the old rating if it exists so we can adjust the average
  const oldRatingSnap = await getDoc(ratingRef);
  const isNewRating = !oldRatingSnap.exists();
  const oldRating = !isNewRating ? oldRatingSnap.data().rating : 0;

  // 1. Save the individual rating
  await setDoc(
    ratingRef,
    {
      userId,
      pathId: roadmapId,
      rating: ratingScore,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // 2. Recalculate average (Normally done via transaction or Cloud Function, 
  // but for small scale we fetch and recalculate)
  try {
    const rmSnap = await getDoc(roadmapRef);
    if (rmSnap.exists()) {
      const data = rmSnap.data();
      let currentAvg = data.averageRating || 0;
      let currentCount = data.ratingCount || 0;

      let newCount = currentCount;
      let newSum = currentAvg * currentCount;

      if (isNewRating) {
        newCount += 1;
        newSum += ratingScore;
      } else {
        // user changed their rating
        newSum = newSum - oldRating + ratingScore;
      }

      const newAvg = parseFloat((newSum / newCount).toFixed(1));

      await updateDoc(roadmapRef, {
        averageRating: newAvg,
        ratingCount: newCount,
      });

      return { newAvg, newCount };
    }
  } catch (error) {
    console.error("Failed to update average rating on roadmap doc:", error);
  }

  return null;
}
