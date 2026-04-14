import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faExternalLinkAlt,
  faSearch,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { subscribeToTools } from "../services/resourceService";
import { subscribeToCategories } from "../services/categoryService";

const ToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("الكل");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubTools = subscribeToTools((data) => {
      setTools(data);
      setLoading(false);
    });
    const unsubCats = subscribeToCategories(setCategories);
    return () => {
      unsubTools();
      unsubCats();
    };
  }, []);

  // Build categoryId → name map
  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchesSearch =
        !search ||
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategoryId === "الكل" || t.categoryId === activeCategoryId;
      return matchesSearch && matchesCategory;
    });
  }, [tools, search, activeCategoryId]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10" dir="rtl">
      {/* Header */}
      <div className="mb-10 text-slate-900 dark:text-white text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md flex items-center justify-center gap-4">
          <FontAwesomeIcon
            icon={faTools}
            className="text-sky-500 dark:text-sky-400"
          />
          الأدوات التقنية
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          مجموعة من أفضل الأدوات والبرامج التي ستساعدك في رحلتك التقنية
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-6 relative">
        <input
          type="text"
          placeholder="ابحث عن أداة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl py-3 px-5 pr-12 focus:outline-none focus:border-sky-500 dark:focus:border-sky-400 focus:bg-slate-50 dark:focus:bg-white/15 placeholder:text-slate-400 dark:placeholder:text-white/40 shadow-sm transition-all duration-300 ease-out"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          <button
            onClick={() => setActiveCategoryId("الكل")}
            className={`px-4 py-2 rounded-2xl text-sm font-bold border transition-all duration-300 ${
              activeCategoryId === "الكل"
                ? "bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white shadow-sm"
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-4 py-2 rounded-2xl text-sm font-bold border transition-all duration-300 ${
                activeCategoryId === cat.id
                  ? "bg-sky-100 dark:bg-sky-500/30 border-sky-300 dark:border-sky-400/50 text-sky-700 dark:text-sky-200 shadow-md"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white shadow-sm"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}


      {/* Tools grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filtered.map((tool, i) => {
            const catName =
              categoryMap[tool.categoryId] || tool.category || null;
            return (
              <div
                key={tool.id}
                className={`card-in card-in-${Math.min(i + 1, 5)} bg-white dark:bg-slate-800 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-6 rounded-3xl hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(14,165,233,0.2)] dark:hover:shadow-[0_15px_40px_rgba(14,165,233,0.2)] transition-all duration-300 group flex flex-col h-full relative overflow-hidden`}
              >
                {/* Glow */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-400/20 pointer-events-none transition-all duration-300 ease-out" />

                {/* Icon */}
                <div className="relative z-10 mb-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br ${tool.color || "from-sky-600 to-blue-700"}`}
                  >
                    {tool.emoji || tool.icon || "🔧"}
                  </div>
                </div>

                {/* Category badge */}
                {catName && (
                  <span className="relative z-10 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-500/25 mb-2 w-fit">
                    <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                    {catName}
                  </span>
                )}

                <h3 className="relative z-10 text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-all duration-300 ease-out">
                  {tool.name}
                </h3>
                <p className="relative z-10 flex-grow text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {tool.description}
                </p>

                <div className="mt-auto relative z-10">
                  <a
                    href={tool.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-600 dark:text-sky-300 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-500/40 flex items-center justify-center gap-2 shadow-sm transition-all duration-300 ease-out"
                  >
                    <FontAwesomeIcon
                      icon={faExternalLinkAlt}
                      className="text-xs"
                    />
                    فتح الأداة
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center bg-white dark:bg-slate-800 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-3xl p-16 max-w-2xl mx-auto shadow-sm">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
            {search || activeCategoryId !== "الكل"
              ? "لا توجد نتائج"
              : "لا توجد أدوات حالياً"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {search || activeCategoryId !== "الكل"
              ? "جرب تغيير كلمة البحث أو الفئة"
              : "سيضيف المدراء أدوات تقنية قريباً"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolsPage;
