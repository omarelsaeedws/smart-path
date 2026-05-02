import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faChevronDown, faChevronUp, faPenToSquare, faTrashAlt, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  getRoadmaps, addRoadmap, updateRoadmap, deleteRoadmap,
  getWeeks, addWeek, updateWeek, deleteWeek,
  getLessons, addLesson, updateLesson, deleteLesson,
} from "../../services/roadmapService";
import { validateRoadmapJSON, importRoadmapFromJSON } from "../../services/importRoadmapService";

const inputCls = "bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-4 py-2 border border-slate-300 dark:border-slate-700 focus:border-amber-400 outline-none transition-all duration-300 ease-out";
const smInputCls = "bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-3 py-1.5 border border-slate-300 dark:border-slate-700 focus:border-emerald-400 outline-none text-sm transition-all duration-300 ease-out";

const EMPTY_ROADMAP = { title: "", description: "", categoryId: "", level: "مبتدئ", totalWeeks: 4, instructorName: "", contentSource: "YouTube", sourceLink: "" };
const EMPTY_WEEK = { weekNumber: 1, weekGoal: "" };
const EMPTY_LESSON = { title: "", description: "", source: "YouTube", resourceLink: "", estimatedHours: 2, order: 1 };

const SOURCES = ["YouTube", "Udemy", "Coursera", "مقال", "أخرى"];
const ROADMAP_SOURCES = ["YouTube", "Udemy", "Coursera", "منصة أخرى"];
const LEVELS_AR = ["مبتدئ", "متوسط", "متقدم"];

const EditModal = ({ title, onClose, onSubmit, children, color = "amber" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        {children}
        <button type="submit" className={`w-full py-2.5 bg-${color}-500 hover:bg-${color}-400 text-white font-bold rounded-lg shadow-md flex justify-center items-center gap-2 transition-all duration-300`}>
          حفظ التعديلات
        </button>
      </form>
    </div>
  </div>
);

const RoadmapsTab = ({ categories, onCountChange }) => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
  const [roadmapWeeks, setRoadmapWeeks] = useState([]);
  const [selectedWeekId, setSelectedWeekId] = useState(null);
  const [weekLessons, setWeekLessons] = useState([]);
  const [expandedWeekId, setExpandedWeekId] = useState(null);

  const [roadmapForm, setRoadmapForm] = useState(EMPTY_ROADMAP);
  const [weekForm, setWeekForm] = useState(EMPTY_WEEK);
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON);

  const [editingRoadmap, setEditingRoadmap] = useState(null);
  const [editRoadmapForm, setEditRoadmapForm] = useState({});
  const [editingWeek, setEditingWeek] = useState(null);
  const [editWeekForm, setEditWeekForm] = useState({});
  const [editingLesson, setEditingLesson] = useState(null);
  const [editLessonForm, setEditLessonForm] = useState({});

  // Import state
  const [importLoading, setImportLoading] = useState(false);
  const [importStatus, setImportStatus] = useState("");
  const [importError, setImportError] = useState("");

  useEffect(() => {
    getRoadmaps()
      .then((list) => { setRoadmaps(list); onCountChange?.(list.length); })
      .catch(console.error);
  }, [onCountChange]); 

  useEffect(() => {
    if (selectedRoadmapId) {
      getWeeks(selectedRoadmapId).then((w) => { setRoadmapWeeks(w); setSelectedWeekId(null); setWeekLessons([]); }).catch(console.error);
    }
  }, [selectedRoadmapId]);

  useEffect(() => {
    if (selectedRoadmapId && selectedWeekId) {
      getLessons(selectedRoadmapId, selectedWeekId).then(setWeekLessons).catch(console.error);
    }
  }, [selectedRoadmapId, selectedWeekId]);

  const handleAddRoadmap = async (e) => {
    e.preventDefault();
    if (!roadmapForm.title) return;
    await addRoadmap({ ...roadmapForm, totalWeeks: Number(roadmapForm.totalWeeks) });
    setRoadmapForm(EMPTY_ROADMAP);
    const updated = await getRoadmaps();
    setRoadmaps(updated);
    onCountChange?.(updated.length);
  };

  const handleImportJSON = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // reset so same file can be re-selected
    setImportLoading(true);
    setImportError("");
    setImportStatus("");
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      validateRoadmapJSON(json);
      await importRoadmapFromJSON(json, (msg) => setImportStatus(msg));
      // Refresh the roadmaps list
      const updated = await getRoadmaps();
      setRoadmaps(updated);
      onCountChange?.(updated.length);
    } catch (err) {
      console.error("Import error:", err);
      setImportError("❌ " + err.message);
      setImportStatus("");
    } finally {
      setImportLoading(false);
    }
  };

  const handleDeleteRoadmap = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المسار؟")) return;
    await deleteRoadmap(id);
    const updated = await getRoadmaps();
    setRoadmaps(updated);
    onCountChange?.(updated.length);
    if (selectedRoadmapId === id) { setSelectedRoadmapId(null); setRoadmapWeeks([]); }
  };

  const handleSaveEditRoadmap = async (e) => {
    e.preventDefault();
    await updateRoadmap(editingRoadmap.id, { ...editRoadmapForm, totalWeeks: Number(editRoadmapForm.totalWeeks) });
    setRoadmaps(await getRoadmaps());
    setEditingRoadmap(null);
  };

  const handleAddWeek = async (e) => {
    e.preventDefault();
    if (!selectedRoadmapId) return;
    await addWeek(selectedRoadmapId, { ...weekForm, weekNumber: Number(weekForm.weekNumber) });
    setWeekForm({ weekNumber: roadmapWeeks.length + 2, weekGoal: "" });
    setRoadmapWeeks(await getWeeks(selectedRoadmapId));
  };

  const handleDeleteWeek = async (weekId) => {
    if (!window.confirm("حذف هذه الوحدة")) return;
    await deleteWeek(selectedRoadmapId, weekId);
    setRoadmapWeeks(await getWeeks(selectedRoadmapId));
    if (selectedWeekId === weekId) { setSelectedWeekId(null); setWeekLessons([]); }
  };

  const handleSaveEditWeek = async (e) => {
    e.preventDefault();
    await updateWeek(selectedRoadmapId, editingWeek.id, { ...editWeekForm, weekNumber: Number(editWeekForm.weekNumber) });
    setRoadmapWeeks(await getWeeks(selectedRoadmapId));
    setEditingWeek(null);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!selectedRoadmapId || !selectedWeekId) return;
    await addLesson(selectedRoadmapId, selectedWeekId, { ...lessonForm, estimatedHours: Number(lessonForm.estimatedHours), order: Number(lessonForm.order) });
    setLessonForm({ ...EMPTY_LESSON, order: weekLessons.length + 2 });
    setWeekLessons(await getLessons(selectedRoadmapId, selectedWeekId));
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("حذف هذا الدرس؟")) return;
    await deleteLesson(selectedRoadmapId, selectedWeekId, lessonId);
    setWeekLessons(await getLessons(selectedRoadmapId, selectedWeekId));
  };

  const handleSaveEditLesson = async (e) => {
    e.preventDefault();
    await updateLesson(selectedRoadmapId, selectedWeekId, editingLesson.id, { ...editLessonForm, estimatedHours: Number(editLessonForm.estimatedHours), order: Number(editLessonForm.order) });
    setWeekLessons(await getLessons(selectedRoadmapId, selectedWeekId));
    setEditingLesson(null);
  };

  return (
    <div className="animate-fade-in space-y-8" dir="rtl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">إدارة مسارات التعلم</h2>

        {/* ── Import from JSON ── */}
        <div className="flex flex-col items-end gap-1">
          <label
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer select-none transition-all duration-300 ease-out shadow-md
              bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/40
              text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30
              ${importLoading ? "opacity-50 pointer-events-none" : "hover:-translate-y-0.5"}`}
            title="استيراد مسار كامل من ملف JSON"
          >
            {importLoading ? "⏳ جارٍ الاستيراد..." : "📥 استيراد مسار من JSON"}
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleImportJSON}
              disabled={importLoading}
            />
          </label>

          {/* Status / Error feedback */}
          {importStatus && !importError && (
            <p className="text-xs font-semibold px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
              {importStatus}
            </p>
          )}
          {importError && (
            <p className="text-xs font-semibold px-3 py-1 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/30">
              {importError}
            </p>
          )}
        </div>
      </div>

      {/* Create Roadmap Form */}
      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300 mb-4">➕ إنشاء مسار جديد</h3>
        <form onSubmit={handleAddRoadmap} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required type="text" placeholder="عنوان المسار" value={roadmapForm.title} onChange={(e) => setRoadmapForm({ ...roadmapForm, title: e.target.value })} className={inputCls} />
          <input type="text" placeholder="وصف المسار" value={roadmapForm.description} onChange={(e) => setRoadmapForm({ ...roadmapForm, description: e.target.value })} className={inputCls} />
          <select required value={roadmapForm.categoryId} onChange={(e) => setRoadmapForm({ ...roadmapForm, categoryId: e.target.value })} className={inputCls}>
            <option value="" disabled className="bg-gray-800">اختر الفئة</option>
            {categories.map((c) => <option key={c.id} value={c.id} className="bg-gray-800">{c.name}</option>)}
          </select>
          <select value={roadmapForm.level} onChange={(e) => setRoadmapForm({ ...roadmapForm, level: e.target.value })} className={inputCls}>
            {LEVELS_AR.map((l) => <option key={l} value={l} className="bg-gray-800">{l}</option>)}
          </select>
          <input type="number" min="1" max="52" placeholder="عدد الوحدات" value={roadmapForm.totalWeeks} onChange={(e) => setRoadmapForm({ ...roadmapForm, totalWeeks: e.target.value })} className={inputCls} />
          <input type="text" placeholder="اسم مقدم المحتوى (المدرب)" value={roadmapForm.instructorName} onChange={(e) => setRoadmapForm({ ...roadmapForm, instructorName: e.target.value })} className={inputCls} />
          <select value={roadmapForm.contentSource} onChange={(e) => setRoadmapForm({ ...roadmapForm, contentSource: e.target.value })} className={inputCls}>
            {ROADMAP_SOURCES.map((s) => <option key={s} value={s} className="bg-gray-800">{s}</option>)}
          </select>
          <input type="url" placeholder="الرابط المباشر للكورس أو القناة" value={roadmapForm.sourceLink} onChange={(e) => setRoadmapForm({ ...roadmapForm, sourceLink: e.target.value })} className={`md:col-span-2 ${inputCls} text-left`} dir="ltr" />
          <button type="submit" className="md:col-span-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-lg shadow-md shadow-amber-500/25 flex justify-center items-center gap-2 hover-lift transition-all duration-300 ease-out">
            <FontAwesomeIcon icon={faPlus} /> إنشاء المسار
          </button>
        </form>
      </div>

      {/* Roadmaps List */}
      {roadmaps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">المسارات الحالية</h3>
          {roadmaps.map((rm) => (
            <div key={rm.id} className={`bg-slate-50 dark:bg-slate-800 border rounded-2xl overflow-hidden transition-all ${selectedRoadmapId === rm.id ? "border-amber-400/50 ring-1 ring-amber-400/20" : "border-slate-200 dark:border-slate-700"}`}>
              <div className="p-4 flex items-center gap-4">
                <button onClick={() => setSelectedRoadmapId(selectedRoadmapId === rm.id ? null : rm.id)} className="flex-1 text-right flex items-center gap-3">
                  <FontAwesomeIcon icon={selectedRoadmapId === rm.id ? faChevronUp : faChevronDown} className="text-amber-400 w-4" />
                  <div>
                    <p className="text-slate-800 dark:text-white font-bold">{rm.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{rm.level} • {rm.totalWeeks} وحدة</p>
                  </div>
                </button>
                <button onClick={() => { setEditingRoadmap(rm); setEditRoadmapForm({ title: rm.title || "", description: rm.description || "", categoryId: rm.categoryId || "", level: rm.level || "مبتدئ", totalWeeks: rm.totalWeeks || 4 }); }} className="text-sky-400 hover:text-sky-300 px-3 py-1.5 rounded-lg hover:bg-sky-500/10 transition-all duration-300 ease-out">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
                <button onClick={() => handleDeleteRoadmap(rm.id)} className="text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all duration-300 ease-out">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>

              {selectedRoadmapId === rm.id && (
                <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-100 dark:bg-slate-900 space-y-4">
                  {/* Add Week */}
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <p className="text-sky-600 dark:text-sky-300 font-bold mb-3">➕ إضافة وحدة</p>
                    <form onSubmit={handleAddWeek} className="flex gap-3 flex-wrap">
                      <input type="number" min="1" placeholder="رقم الوحدة" value={weekForm.weekNumber} onChange={(e) => setWeekForm({ ...weekForm, weekNumber: e.target.value })} className={`${smInputCls} w-28`} />
                      <input type="text" placeholder="هدف الوحدة" value={weekForm.weekGoal} onChange={(e) => setWeekForm({ ...weekForm, weekGoal: e.target.value })} className={`${smInputCls} flex-1 min-w-[150px]`} />
                      <button type="submit" className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg shadow-sm shadow-sky-500/25 hover-lift transition-all duration-300 ease-out">إضافة</button>
                    </form>
                  </div>

                  {/* Weeks */}
                  {roadmapWeeks.map((week) => (
                    <div key={week.id} className={`bg-slate-50 dark:bg-slate-800 border rounded-xl overflow-hidden ${selectedWeekId === week.id ? "border-sky-400/50" : "border-slate-200 dark:border-slate-700"}`}>
                      <div className="p-3 flex items-center gap-3">
                        <button onClick={() => { setSelectedWeekId(selectedWeekId === week.id ? null : week.id); setExpandedWeekId(expandedWeekId === week.id ? null : week.id); }} className="flex-1 text-right flex items-center gap-2">
                          <FontAwesomeIcon icon={expandedWeekId === week.id ? faChevronUp : faChevronDown} className="text-sky-300 w-3" />
                          <span className="text-slate-800 dark:text-white font-semibold text-sm">الوحدة {week.weekNumber}</span>
                          <span className="text-slate-500 dark:text-slate-400 text-xs">{week.weekGoal}</span>
                        </button>
                        <button onClick={() => { setEditingWeek(week); setEditWeekForm({ weekNumber: week.weekNumber || 1, weekGoal: week.weekGoal || "" }); }} className="text-sky-400/70 hover:text-sky-400 transition-all duration-300 ease-out">
                          <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                        </button>
                        <button onClick={() => handleDeleteWeek(week.id)} className="text-red-400/70 hover:text-red-400 transition-all duration-300 ease-out">
                          <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
                        </button>
                      </div>

                      {expandedWeekId === week.id && (
                        <div className="border-t border-slate-100 dark:border-slate-700 p-3 bg-slate-100 dark:bg-slate-900 space-y-3">
                          {/* Add Lesson */}
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                            <p className="text-emerald-600 dark:text-emerald-300 font-bold text-sm mb-2">➕ إضافة درس</p>
                            <form onSubmit={handleAddLesson} className="space-y-2">
                              <input required type="text" placeholder="عنوان الدرس" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} className={`w-full ${smInputCls}`} />
                              <textarea placeholder="وصف الدرس (اختياري)" value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} rows="2" className={`w-full ${smInputCls}`} />
                              <div className="flex gap-2 mb-2">
                                <select value={lessonForm.source} onChange={(e) => setLessonForm({ ...lessonForm, source: e.target.value })} className={`w-1/3 ${smInputCls}`}>
                                  {SOURCES.map((s) => <option key={s} value={s} className="bg-gray-800">{s}</option>)}
                                </select>
                                <input type="url" placeholder="رابط المصدر" value={lessonForm.resourceLink} onChange={(e) => setLessonForm({ ...lessonForm, resourceLink: e.target.value })} className={`flex-1 ${smInputCls} text-left`} dir="ltr" />
                              </div>
                              <div className="flex gap-2">
                                <input type="number" min="1" placeholder="الترتيب" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: e.target.value })} className={`w-28 ${smInputCls}`} />
                                <button type="submit" className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg shadow-sm shadow-emerald-500/20 text-sm hover-lift transition-all duration-300 ease-out">إضافة الدرس</button>
                              </div>
                            </form>
                          </div>
                          {/* Lessons List */}
                          {weekLessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-2.5">
                              <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">{lesson.order}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-slate-800 dark:text-white text-sm font-medium truncate">{lesson.title}</p>
                                <p className="text-slate-500 text-xs">{lesson.source || "غير محدد"} • {lesson.estimatedHours} ساعات</p>
                              </div>
                              <button onClick={() => { setEditingLesson(lesson); setEditLessonForm({ title: lesson.title || "", description: lesson.description || "", source: lesson.source || "YouTube", resourceLink: lesson.resourceLink || "", estimatedHours: lesson.estimatedHours || 2, order: lesson.order || 1 }); }} className="text-sky-400/60 hover:text-sky-400 shrink-0 transition-all duration-300 ease-out">
                                <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                              </button>
                              <button onClick={() => handleDeleteLesson(lesson.id)} className="text-red-400/60 hover:text-red-400 shrink-0 transition-all duration-300 ease-out">
                                <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
                              </button>
                            </div>
                          ))}
                          {weekLessons.length === 0 && <p className="text-slate-500 text-xs text-center py-2">لا توجد دروس بعد.</p>}
                        </div>
                      )}
                    </div>
                  ))}
                  {roadmapWeeks.length === 0 && <p className="text-slate-500 text-sm text-center py-3">لا توجد الوحدات. أضف وحدة أولاً.</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Roadmap Modal */}
      {editingRoadmap && (
        <EditModal title="تعديل المسار" onClose={() => setEditingRoadmap(null)} onSubmit={handleSaveEditRoadmap} color="amber">
          <input required type="text" placeholder="عنوان المسار" value={editRoadmapForm.title || ""} onChange={(e) => setEditRoadmapForm({ ...editRoadmapForm, title: e.target.value })} className={`w-full ${inputCls}`} />
          <input type="text" placeholder="وصف المسار" value={editRoadmapForm.description || ""} onChange={(e) => setEditRoadmapForm({ ...editRoadmapForm, description: e.target.value })} className={`w-full ${inputCls}`} />
          <select required value={editRoadmapForm.categoryId || ""} onChange={(e) => setEditRoadmapForm({ ...editRoadmapForm, categoryId: e.target.value })} className={`w-full ${inputCls}`}>
            <option value="" disabled className="bg-gray-800">اختر الفئة</option>
            {categories.map((c) => <option key={c.id} value={c.id} className="bg-gray-800">{c.name}</option>)}
          </select>
          <select value={editRoadmapForm.level || "مبتدئ"} onChange={(e) => setEditRoadmapForm({ ...editRoadmapForm, level: e.target.value })} className={`w-full ${inputCls}`}>
            {LEVELS_AR.map((l) => <option key={l} value={l} className="bg-gray-800">{l}</option>)}
          </select>
          <input type="number" min="1" placeholder="عدد الوحدات" value={editRoadmapForm.totalWeeks || ""} onChange={(e) => setEditRoadmapForm({ ...editRoadmapForm, totalWeeks: e.target.value })} className={`w-full ${inputCls}`} />
        </EditModal>
      )}

      {/* Edit Week Modal */}
      {editingWeek && (
        <EditModal title="تعديل الوحدة" onClose={() => setEditingWeek(null)} onSubmit={handleSaveEditWeek} color="sky">
          <input required type="number" min="1" placeholder="رقم الوحدة" value={editWeekForm.weekNumber || ""} onChange={(e) => setEditWeekForm({ ...editWeekForm, weekNumber: e.target.value })} className={`w-full ${inputCls} focus:border-sky-400`} />
          <input type="text" placeholder="هدف الوحدة" value={editWeekForm.weekGoal || ""} onChange={(e) => setEditWeekForm({ ...editWeekForm, weekGoal: e.target.value })} className={`w-full ${inputCls} focus:border-sky-400`} />
        </EditModal>
      )}

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <EditModal title="تعديل الدرس" onClose={() => setEditingLesson(null)} onSubmit={handleSaveEditLesson} color="emerald">
          <input required type="text" placeholder="عنوان الدرس" value={editLessonForm.title || ""} onChange={(e) => setEditLessonForm({ ...editLessonForm, title: e.target.value })} className={`w-full ${inputCls} focus:border-emerald-400`} />
          <textarea placeholder="وصف الدرس" value={editLessonForm.description || ""} rows="2" onChange={(e) => setEditLessonForm({ ...editLessonForm, description: e.target.value })} className={`w-full ${inputCls} focus:border-emerald-400 resize-none`} />
          <select value={editLessonForm.source || "YouTube"} onChange={(e) => setEditLessonForm({ ...editLessonForm, source: e.target.value })} className={`w-full ${inputCls} focus:border-emerald-400`}>
            {SOURCES.map((s) => <option key={s} value={s} className="bg-gray-800">{s}</option>)}
          </select>
          <input type="url" placeholder="رابط المصدر" value={editLessonForm.resourceLink || ""} dir="ltr" onChange={(e) => setEditLessonForm({ ...editLessonForm, resourceLink: e.target.value })} className={`w-full ${inputCls} focus:border-emerald-400 text-left`} />
          <input type="number" min="1" placeholder="الترتيب" value={editLessonForm.order || ""} onChange={(e) => setEditLessonForm({ ...editLessonForm, order: e.target.value })} className={`w-full ${inputCls} focus:border-emerald-400`} />
        </EditModal>
      )}
    </div>
  );
};

export default RoadmapsTab;
