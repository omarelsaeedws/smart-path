import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPenToSquare, faTrashAlt, faXmark } from "@fortawesome/free-solid-svg-icons";

const EMPTY_FORM = {
  name: "",
  category: "",
  categoryId: "",
  description: "",
  link: "",
  logoUrl: "",
};

const inputCls =
  "w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-4 py-2 border border-slate-300 dark:border-slate-700 focus:border-sky-400 outline-none transition-all duration-300 ease-out";

const ResourcesTab = ({ resources, categories, onAdd, onUpdate, onDelete }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingResource, setEditingResource] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name || !form.link) return;
    await onAdd(form);
    setForm(EMPTY_FORM);
  };

  const openEdit = (res) => {
    setEditingResource(res);
    setEditForm({
      name: res.name || "",
      categoryId: res.categoryId || "",
      description: res.description || "",
      link: res.link || "",
      logoUrl: res.logoUrl || "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    await onUpdate(editingResource.id, editForm);
    setEditingResource(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الأداة؟")) await onDelete(id);
  };

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-8">
      {/* Add Form */}
      <div className="w-full lg:w-1/3">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">إضافة أداة/مصدر</h3>
        <form
          onSubmit={handleAdd}
          className="space-y-4 bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700"
        >
          <input
            required
            type="text"
            placeholder="اسم الأداة"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
          />
          <select
            required
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className={inputCls}
          >
            <option value="" disabled className="bg-gray-800">اختر الفئة</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-gray-800">{c.name}</option>
            ))}
          </select>
          <textarea
            required
            placeholder="وصف الأداة"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows="3"
            className={inputCls}
          />
          <input
            required
            type="url"
            placeholder="رابط الأداة"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className={`${inputCls} text-left`}
            dir="ltr"
          />
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">رابط صورة الأداة (اختياري)</span>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={form.logoUrl}
              dir="ltr"
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className={`${inputCls} text-left text-sm`}
            />
            {form.logoUrl && (
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={form.logoUrl}
                  alt="preview"
                  loading="lazy"
                  className="w-10 h-10 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <span className="text-xs text-slate-400">معاينة</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all duration-300 ease-out"
          >
            <FontAwesomeIcon icon={faPlus} /> إضافة الأداة
          </button>
        </form>
      </div>

      {/* List */}
      <div className="w-full lg:w-2/3">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">الأدوات الحالية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 relative group"
            >
              <div className="flex items-start gap-3">
                {res.logoUrl ? (
                  <img
                    src={res.logoUrl}
                    alt={res.name}
                    loading="lazy"
                    className="w-10 h-10 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 shrink-0"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg shrink-0">
                    {res.name?.charAt(0)?.toUpperCase() || "🔧"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-xs mb-1">
                    {res.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-800 dark:text-white truncate">{res.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{res.description}</p>
                </div>
              </div>
              <div className="absolute top-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => openEdit(res)}
                  className="text-sky-400 hover:text-sky-300 p-1.5"
                  title="تعديل"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                </button>
                <button
                  onClick={() => handleDelete(res.id)}
                  className="text-red-400 hover:text-red-300 p-1.5"
                  title="حذف"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir="rtl">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">تعديل الأداة</h3>
              <button onClick={() => setEditingResource(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <input required type="text" placeholder="اسم الأداة" value={editForm.name || ""}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className={inputCls} />
              <select required value={editForm.categoryId || ""}
                onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                className={inputCls}>
                <option value="" disabled className="bg-gray-800">اختر الفئة</option>
                {categories.map((c) => (<option key={c.id} value={c.id} className="bg-gray-800">{c.name}</option>))}
              </select>
              <textarea placeholder="وصف الأداة" value={editForm.description || ""} rows="3"
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className={`${inputCls} resize-none`} />
              <input required type="url" placeholder="رابط الأداة" value={editForm.link || ""} dir="ltr"
                onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                className={`${inputCls} text-left`} />
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">رابط صورة الأداة (اختياري)</span>
                <input type="url" placeholder="https://example.com/logo.png"
                  value={editForm.logoUrl || ""} dir="ltr"
                  onChange={(e) => setEditForm({ ...editForm, logoUrl: e.target.value })}
                  className={`${inputCls} text-left text-sm`} />
                {editForm.logoUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    <img src={editForm.logoUrl} alt="preview" loading="lazy"
                      className="w-10 h-10 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1"
                      onError={(e) => { e.target.style.display = "none"; }} />
                    <span className="text-xs text-slate-400">معاينة</span>
                  </div>
                )}
              </div>
              <button type="submit"
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg shadow-md flex justify-center items-center gap-2 transition-all duration-300">
                حفظ التعديلات
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesTab;
