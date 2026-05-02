import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faLayerGroup, faPenToSquare, faTrashAlt, faCheckCircle, faXmark } from "@fortawesome/free-solid-svg-icons";

const CategoriesTab = ({ categories, onAdd, onUpdate, onDelete }) => {
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: "" });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name) return;
    await onAdd(form);
    setForm({ name: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await onUpdate(editing.id, editForm);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الفئة؟")) await onDelete(id);
  };

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-1/3">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">إضافة فئة جديدة</h3>
        <form onSubmit={handleAdd} className="space-y-4 bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
          <input required type="text" placeholder="اسم الفئة (مثال: برمجة، تصميم...)"
            value={form.name} onChange={(e) => setForm({ name: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-4 py-2 border border-slate-300 dark:border-slate-700 focus:border-sky-400 outline-none transition-all duration-300 ease-out" />
          <button type="submit" className="w-full py-2.5 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all duration-300 ease-out">
            <FontAwesomeIcon icon={faPlus} /> إضافة فئة
          </button>
        </form>
      </div>
      <div className="w-full lg:w-2/3">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">الفئات الحالية ({categories.length})</h3>
        {categories.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
            <FontAwesomeIcon icon={faLayerGroup} className="text-slate-400 text-4xl mb-3" />
            <p className="text-slate-500 dark:text-slate-400">لا يوجد فئات حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex justify-between items-center group hover:bg-slate-100 transition-all duration-300 ease-out">
                {editing?.id === cat.id ? (
                  <form onSubmit={handleSave} className="flex flex-1 gap-2">
                    <input autoFocus required type="text" value={editForm.name}
                      onChange={(e) => setEditForm({ name: e.target.value })}
                      className="flex-1 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white rounded-lg px-3 py-1 border border-slate-300 dark:border-slate-700 focus:border-violet-400 outline-none transition-all duration-300 ease-out" />
                    <button type="submit" className="text-green-400 hover:text-green-300 px-2 transition-all duration-300 ease-out">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </button>
                    <button type="button" onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-300 px-2 transition-all duration-300 ease-out">
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-300 flex justify-center items-center font-black">
                        {cat.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-800 dark:text-white font-bold">{cat.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(cat); setEditForm({ name: cat.name }); }} className="text-sky-400 hover:text-sky-300 p-2 transition-all duration-300 ease-out">
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300 p-2 transition-all duration-300 ease-out">
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesTab;
