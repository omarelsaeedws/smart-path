import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faLaptopCode, faPenToSquare, faTrashAlt, faXmark } from "@fortawesome/free-solid-svg-icons";

const EMPTY = { title: "", description: "", categoryId: "", level: "Beginner", link: "", image: "" };

const LEVEL_LABELS = { Beginner: "مبتدئ", Intermediate: "متوسط", Advanced: "متقدم" };
const LEVEL_COLORS = {
  Beginner: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Intermediate: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Advanced: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

const inputCls = "w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-4 py-2.5 border border-slate-300 dark:border-slate-700 focus:border-violet-400 outline-none transition-all duration-300 ease-out";

const LevelSelect = ({ value, onChange }) => (
  <select value={value} onChange={onChange} className={inputCls}>
    <option value="Beginner" className="bg-gray-800">مبتدئ</option>
    <option value="Intermediate" className="bg-gray-800">متوسط</option>
    <option value="Advanced" className="bg-gray-800">متقدم</option>
  </select>
);

// CategorySelect defined OUTSIDE parent — avoids remount on every render
const CategorySelect = ({ value, onChange, categories }) => (
  <select required value={value} onChange={onChange} className={inputCls}>
    <option value="" disabled className="bg-gray-800">اختر الفئة</option>
    {categories.map((c) => (
      <option key={c.id} value={c.id} className="bg-gray-800">{c.name}</option>
    ))}
  </select>
);

const ApplicationsTab = ({ applications, categories, onAdd, onUpdate, onDelete }) => {
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title) return;
    await onAdd(form);
    setForm(EMPTY);
  };

  const openEdit = (app) => {
    setEditing(app);
    setEditForm({ title: app.title || "", description: app.description || "", categoryId: app.categoryId || "", level: app.level || "Beginner", link: app.link || "", image: app.image || "" });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    await onUpdate(editing.id, editForm);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التطبيق؟")) await onDelete(id);
  };



  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-8" dir="rtl">
      {/* Add Form */}
      <div className="w-full lg:w-1/3 shrink-0">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">إضافة تطبيق عملي</h3>
        <form onSubmit={handleAdd} className="space-y-3 bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <input required type="text" placeholder="عنوان التطبيق" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
          <textarea placeholder="وصف التطبيق" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" className={`${inputCls} resize-none`} />
          <CategorySelect value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} categories={categories} />
          <LevelSelect value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
          <input type="url" placeholder="رابط المشروع (اختياري)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className={`${inputCls} text-left`} dir="ltr" />
          <input type="url" placeholder="رابط الصورة (اختياري)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={`${inputCls} text-left`} dir="ltr" />
          <button type="submit" className="w-full py-2.5 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all duration-300 ease-out">
            <FontAwesomeIcon icon={faPlus} /> إضافة التطبيق
          </button>
        </form>
      </div>

      {/* List */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">التطبيقات الحالية ({applications.length})</h3>
        {applications.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center">
            <FontAwesomeIcon icon={faLaptopCode} className="text-slate-400 text-5xl mb-4" />
            <p className="text-slate-500 dark:text-slate-400">لا توجد تطبيقات حالياً. أضف أول تطبيق.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 group relative flex flex-col gap-2 hover:border-violet-400/30 transition-all duration-300 ease-out">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border mb-1 ${LEVEL_COLORS[app.level] || LEVEL_COLORS.Beginner}`}>
                      {LEVEL_LABELS[app.level] || app.level}
                    </span>
                    <h4 className="text-slate-800 dark:text-white font-bold line-clamp-1">{app.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mt-1">{app.description}</p>
                  </div>
                  {app.image && (
                    <img src={app.image} alt={app.title} loading="lazy"
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      onError={(e) => { e.target.style.display = "none"; }} />
                  )}
                </div>
                {app.link && (
                  <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-sky-400 text-xs hover:underline truncate" dir="ltr">
                    {app.link}
                  </a>
                )}
                <div className="flex gap-2 mt-1">
                  <button onClick={() => openEdit(app)} className="flex-1 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-500/20 hover:bg-violet-100 dark:hover:bg-violet-500/40 border border-violet-200 dark:border-violet-400/30 text-violet-700 dark:text-violet-300 text-sm font-semibold flex items-center justify-center gap-1 hover-lift transition-all duration-300 ease-out">
                    <FontAwesomeIcon icon={faPenToSquare} className="text-xs" /> تعديل
                  </button>
                  <button onClick={() => handleDelete(app.id)} className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/40 border border-red-200 dark:border-red-400/30 text-red-600 dark:text-red-300 hover-lift transition-all duration-300 ease-out">
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" dir="rtl">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <button onClick={() => setEditing(null)} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 flex items-center justify-center transition-all duration-300 ease-out">
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">تعديل التطبيق</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <input required type="text" placeholder="عنوان التطبيق" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className={inputCls} />
              <textarea placeholder="وصف التطبيق" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows="3" className={`${inputCls} resize-none`} />
              <select required value={editForm.categoryId} onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })} className={inputCls}>
                <option value="" disabled className="bg-gray-800">اختر الفئة</option>
                {categories.map((c) => <option key={c.id} value={c.id} className="bg-gray-800">{c.name}</option>)}
              </select>
              <LevelSelect value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value })} />
              <input type="url" placeholder="رابط المشروع (اختياري)" value={editForm.link} onChange={(e) => setEditForm({ ...editForm, link: e.target.value })} className={`${inputCls} text-left`} dir="ltr" />
              <input type="url" placeholder="رابط الصورة (اختياري)" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} className={`${inputCls} text-left`} dir="ltr" />
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-3 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-xl shadow-md shadow-violet-500/25 hover-lift transition-all duration-300 ease-out">حفظ التعديلات</button>
                <button type="button" onClick={() => setEditing(null)} className="w-1/3 py-3 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-all duration-300 ease-out">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsTab;
