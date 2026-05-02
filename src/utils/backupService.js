import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

// ─── HELPERS ────────────────────────────────────────────────────────────────

/** Strip non-serialisable Firestore fields (Timestamps → ISO strings) */
function serializeData(data) {
  const result = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && typeof value.toDate === "function") {
      result[key] = value.toDate().toISOString();
    } else {
      result[key] = value;
    }
  }
  return result;
}

// ─── EXPORT ─────────────────────────────────────────────────────────────────

export async function exportDatabase(onProgress) {
  const report = (msg) => onProgress && onProgress(msg);

  // 1. categories
  report("جارٍ تصدير الفئات...");
  const categoriesSnap = await getDocs(collection(db, "categories"));
  const categories = categoriesSnap.docs.map((d) => ({
    id: d.id,
    ...serializeData(d.data()),
  }));

  // 2. resources
  report("جارٍ تصدير الأدوات...");
  const resourcesSnap = await getDocs(collection(db, "resources"));
  const resources = resourcesSnap.docs.map((d) => ({
    id: d.id,
    ...serializeData(d.data()),
  }));

  // 3. applications
  report("جارٍ تصدير التطبيقات...");
  const applicationsSnap = await getDocs(collection(db, "applications"));
  const applications = applicationsSnap.docs.map((d) => ({
    id: d.id,
    ...serializeData(d.data()),
  }));

  // 4. roadmaps + subcollections
  report("جارٍ تصدير مسارات التعلم...");
  const roadmapsSnap = await getDocs(collection(db, "roadmaps"));
  const roadmaps = [];

  for (const roadmapDoc of roadmapsSnap.docs) {
    report(`جارٍ تصدير المسار: ${roadmapDoc.data().title || roadmapDoc.id}`);
    const weeksSnap = await getDocs(
      collection(db, "roadmaps", roadmapDoc.id, "weeks")
    );

    const weeks = [];
    for (const weekDoc of weeksSnap.docs) {
      const lessonsSnap = await getDocs(
        collection(db, "roadmaps", roadmapDoc.id, "weeks", weekDoc.id, "lessons")
      );
      const lessons = lessonsSnap.docs.map((l) => ({
        id: l.id,
        ...serializeData(l.data()),
      }));

      weeks.push({
        id: weekDoc.id,
        data: serializeData(weekDoc.data()),
        lessons,
      });
    }

    roadmaps.push({
      id: roadmapDoc.id,
      data: serializeData(roadmapDoc.data()),
      weeks,
    });
  }

  report("اكتمل التصدير ✅");

  return { categories, resources, applications, roadmaps };
}

/** Trigger browser download of JSON file */
export function downloadJSON(data, filename = "smart-path-backup.json") {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── IMPORT ─────────────────────────────────────────────────────────────────

/** Delete all docs in a flat collection */
async function clearCollection(collectionName) {
  const snap = await getDocs(collection(db, collectionName));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

/** Delete all roadmaps + their subcollections */
async function clearRoadmaps() {
  const roadmapsSnap = await getDocs(collection(db, "roadmaps"));
  for (const roadmapDoc of roadmapsSnap.docs) {
    const weeksSnap = await getDocs(
      collection(db, "roadmaps", roadmapDoc.id, "weeks")
    );
    for (const weekDoc of weeksSnap.docs) {
      const lessonsSnap = await getDocs(
        collection(db, "roadmaps", roadmapDoc.id, "weeks", weekDoc.id, "lessons")
      );
      const lessBatch = writeBatch(db);
      lessonsSnap.docs.forEach((l) => lessBatch.delete(l.ref));
      await lessBatch.commit();
      await deleteDoc(weekDoc.ref);
    }
    await deleteDoc(roadmapDoc.ref);
  }
}

export async function importDatabase(backupData, onProgress) {
  const report = (msg) => onProgress && onProgress(msg);

  const { categories = [], resources = [], applications = [], roadmaps = [] } =
    backupData;

  // ── Clear old data ──────────────────────────────────────────────────────
  report("جارٍ مسح البيانات القديمة...");
  await clearCollection("categories");
  await clearCollection("resources");
  await clearCollection("applications");
  await clearRoadmaps();

  // ── Import categories ───────────────────────────────────────────────────
  report("جارٍ استيراد الفئات...");
  for (const cat of categories) {
    const { id, ...data } = cat;
    await setDoc(doc(db, "categories", id), data);
  }

  // ── Import resources ────────────────────────────────────────────────────
  report("جارٍ استيراد الأدوات...");
  for (const res of resources) {
    const { id, ...data } = res;
    await setDoc(doc(db, "resources", id), data);
  }

  // ── Import applications ─────────────────────────────────────────────────
  report("جارٍ استيراد التطبيقات...");
  for (const app of applications) {
    const { id, ...data } = app;
    await setDoc(doc(db, "applications", id), data);
  }

  // ── Import roadmaps + subcollections ────────────────────────────────────
  report("جارٍ استيراد مسارات التعلم...");
  for (const roadmap of roadmaps) {
    report(`جارٍ استيراد المسار: ${roadmap.data?.title || roadmap.id}`);
    await setDoc(doc(db, "roadmaps", roadmap.id), roadmap.data);

    for (const week of roadmap.weeks || []) {
      await setDoc(
        doc(db, "roadmaps", roadmap.id, "weeks", week.id),
        week.data
      );

      for (const lesson of week.lessons || []) {
        const { id: lessonId, ...lessonData } = lesson;
        await setDoc(
          doc(
            db,
            "roadmaps",
            roadmap.id,
            "weeks",
            week.id,
            "lessons",
            lessonId
          ),
          lessonData
        );
      }
    }
  }

  report("اكتمل الاستيراد بنجاح ✅");
}
