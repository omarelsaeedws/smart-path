import { db } from "../lib/firebase";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// ── Validation ────────────────────────────────────────────────────────────────

/**
 * Validates the imported JSON before any Firestore write.
 * Throws with a descriptive Arabic message on the first problem found.
 */
export function validateRoadmapJSON(json) {
  if (!json || typeof json !== "object") throw new Error("الملف غير صالح.");
  if (!json.title?.trim())       throw new Error("حقل 'title' مفقود أو فارغ.");
  if (!json.categoryId?.trim())  throw new Error("حقل 'categoryId' مفقود أو فارغ.");
  if (!Array.isArray(json.weeks) || json.weeks.length === 0)
    throw new Error("يجب أن يحتوي المسار على وحدة واحدة على الأقل في 'weeks'.");

  json.weeks.forEach((week, wi) => {
    if (!week.title?.trim())
      throw new Error(`الوحدة [${wi + 1}]: حقل 'title' مفقود.`);
    if (!Array.isArray(week.lessons))
      throw new Error(`الوحدة [${wi + 1}]: 'lessons' يجب أن يكون مصفوفة.`);

    week.lessons.forEach((lesson, li) => {
      if (!lesson.title?.trim())
        throw new Error(`الوحدة [${wi + 1}] - الدرس [${li + 1}]: حقل 'title' مفقود.`);
    });
  });
}

// ── Import ────────────────────────────────────────────────────────────────────

/**
 * Writes a full roadmap (weeks + lessons) to Firestore.
 * Structure: roadmaps/{id}/weeks/{id}/lessons/{id}
 *
 * @param {object}   json           - Parsed, validated JSON object
 * @param {function} onProgress     - Optional callback(message) for UI feedback
 * @returns {string}                - The new roadmap document ID
 */
export async function importRoadmapFromJSON(json, onProgress) {
  onProgress?.("📄 جارٍ إنشاء المسار...");

  // ── 1. Create roadmap document ─────────────────────────────────────────────
  const roadmapRef = doc(collection(db, "roadmaps"));
  await setDoc(roadmapRef, {
    title:         json.title?.trim()        || "",
    description:   json.description?.trim()  || "",
    categoryId:    json.categoryId?.trim()   || "",
    level:         json.level?.trim()        || "مبتدئ",
    instructorName: json.instructor?.trim()  || "",
    contentSource: json.source?.trim()       || "YouTube",
    sourceLink:    json.sourceUrl?.trim()    || "",
    totalWeeks:    json.weeks.length,
    createdAt:     serverTimestamp(),
  });

  const roadmapId = roadmapRef.id;

  // ── 2. Create weeks + lessons ──────────────────────────────────────────────
  for (let wi = 0; wi < json.weeks.length; wi++) {
    const week = json.weeks[wi];
    onProgress?.(`📅 جارٍ إضافة الوحدة ${wi + 1} من ${json.weeks.length}...`);

    const weekRef = doc(collection(db, "roadmaps", roadmapId, "weeks"));
    await setDoc(weekRef, {
      weekNumber: typeof week.order === "number" ? week.order : wi + 1,
      weekGoal:   week.title?.trim() || `الوحدة ${wi + 1}`,
      createdAt:  serverTimestamp(),
    });

    const weekId = weekRef.id;
    const lessons = Array.isArray(week.lessons) ? week.lessons : [];

    for (let li = 0; li < lessons.length; li++) {
      const lesson = lessons[li];
      const lessonRef = doc(
        collection(db, "roadmaps", roadmapId, "weeks", weekId, "lessons")
      );
      await setDoc(lessonRef, {
        title:          lesson.title?.trim()        || `درس ${li + 1}`,
        description:    lesson.description?.trim()  || "",
        source:         lesson.source?.trim()       || "YouTube",
        resourceLink:   lesson.videoUrl?.trim()     || "",
        estimatedHours: typeof lesson.estimatedHours === "number"
                          ? lesson.estimatedHours
                          : 1,
        order:          typeof lesson.order === "number" ? lesson.order : li + 1,
        createdAt:      serverTimestamp(),
      });
    }
  }

  onProgress?.("✅ تم استيراد المسار بنجاح!");
  return roadmapId;
}
