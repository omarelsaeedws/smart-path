import React, { useState, useEffect, useMemo } from "react";
import { subscribeToApplications } from "../services/applicationService";
import { subscribeToCategories } from "../services/categoryService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLaptopCode,
  faSearch,
  faExternalLinkAlt,
  faLayerGroup,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

// ── Level helpers ────────────────────────────────────────────────────────────
const LEVELS = ["الكل", "Beginner", "Intermediate", "Advanced"];

const levelConfig = {
  Beginner: {
    label: "مبتدئ",
    bg: "bg-emerald-500/20",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  Intermediate: {
    label: "متوسط",
    bg: "bg-amber-500/20",
    text: "text-amber-300",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
  },
  Advanced: {
    label: "متقدم",
    bg: "bg-rose-500/20",
    text: "text-rose-300",
    border: "border-rose-500/30",
    dot: "bg-rose-400",
  },
};

const gradients = [
  "from-sky-600 to-indigo-700",
  "from-violet-600 to-purple-700",
  "from-emerald-600 to-teal-700",
  "from-rose-600 to-pink-700",
  "from-amber-600 to-orange-700",
  "from-cyan-600 to-blue-700",
];

// ── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-200 dark:bg-slate-800" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-1/4" />
      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-full w-2/3" />
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-2xl mt-4" />
    </div>
  </div>
);

// ── Application Card ─────────────────────────────────────────────────────────
const ApplicationCard = ({ app, index, categoryName }) => {
  const cfg = levelConfig[app.level] || levelConfig["Beginner"];
  const grad = gradients[index % gradients.length];

  return (
    <div className="bg-white dark:bg-slate-800 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-[0.3rem] hover:shadow-lg transition-all duration-300 ease-out">
      {/* Image / Placeholder */}
      <div className="relative h-44 overflow-hidden">
        {app.image ? (
          <img
            src={app.image}
            alt={app.title}
            className="w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        {/* Fallback gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${grad} flex items-center justify-center ${app.image ? "hidden" : "flex"}`}
        >
          <FontAwesomeIcon icon={faLaptopCode} className="text-white/30 text-5xl" />
        </div>
        {/* Level badge overlay */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category badge */}
        {categoryName && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/25 mb-2 w-fit">
            <FontAwesomeIcon icon={faTag} className="text-[10px]" />
            {categoryName}
          </span>
        )}

        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 line-clamp-2 group-hover:text-sky-500 dark:group-hover:text-sky-300 leading-snug transition-all duration-300 ease-out">
          {app.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed flex-1">
          {app.description || "لا يوجد وصف لهذا التطبيق."}
        </p>

        {/* CTA */}
        <div className="mt-5">
          {app.link ? (
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg hover-lift transition-all duration-300 ease-out"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
              عرض المشروع
            </a>
          ) : (
            <button
              disabled
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-bold text-sm cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faLaptopCode} className="text-xs" />
              لا يوجد رابط
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────────────────────
const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLevel, setActiveLevel] = useState("الكل");
  const [activeCategoryId, setActiveCategoryId] = useState("الكل");

  useEffect(() => {
    const unsubApps = subscribeToApplications((data) => {
      setApplications(data);
      setLoading(false);
    });
    const unsubCats = subscribeToCategories(setCategories);
    return () => {
      unsubApps();
      unsubCats();
    };
  }, []);

  // Build categoryId → name map for fast lookup
  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !searchQuery ||
        app.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = activeLevel === "الكل" || app.level === activeLevel;
      const matchesCategory =
        activeCategoryId === "الكل" || app.categoryId === activeCategoryId;
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [applications, searchQuery, activeLevel, activeCategoryId]);

  return (
    <div className="p-6 sm:p-10 relative overflow-hidden w-full animate-fade-in-up" dir="rtl">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* ── Header ── */}
        <div className="mb-10 animate-fade-in-up stagger-1">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white drop-shadow-md flex items-center gap-3">
            <FontAwesomeIcon icon={faLaptopCode} className="text-sky-500 dark:text-sky-400" />
            التطبيقات العملية
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            استعرض المشاريع العملية وابدأ التطبيق الفعلي لما تعلمته
          </p>
        </div>

        {/* ── Controls ── */}
        <div className="flex flex-col gap-4 mb-8 animate-fade-in-up stagger-2">
          {/* Row 1: Search */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <FontAwesomeIcon icon={faSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm" />
              <input
                type="text"
                placeholder="ابحث عن تطبيق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl py-3 pr-11 pl-4 placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 focus:bg-slate-50 dark:focus:bg-white/10 shadow-sm transition-all duration-300 ease-out"
              />
            </div>
          </div>

          {/* Row 2: Level Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-slate-500 dark:text-slate-500 text-xs font-medium ml-1">المستوى:</span>
            {LEVELS.map((lvl) => {
              const cfg = levelConfig[lvl];
              const isActive = activeLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setActiveLevel(lvl)}
                  className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                    isActive
                      ? lvl === "الكل"
                        ? "bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                        : `${cfg.bg} ${cfg.border} ${cfg.text} shadow-md`
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white shadow-sm"
                  }`}
                >
                  {lvl === "الكل" ? "الكل" : cfg.label}
                </button>
              );
            })}
          </div>

          {/* Row 3: Category Filter (dynamic) */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-slate-500 dark:text-slate-500 text-xs font-medium ml-1">الفئة:</span>
              <button
                onClick={() => setActiveCategoryId("الكل")}
                className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                  activeCategoryId === "الكل"
                    ? "bg-violet-500 border-violet-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white shadow-sm"
                }`}
              >
                الكل
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 border ${
                    activeCategoryId === cat.id
                      ? "bg-violet-100 dark:bg-violet-500/30 border-violet-300 dark:border-violet-400/50 text-violet-700 dark:text-violet-200 shadow-md"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white shadow-sm"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Loading Skeletons ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white dark:bg-slate-800 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-16 text-center shadow-xl animate-fade-in-up">
            <FontAwesomeIcon icon={faLayerGroup} className="text-slate-300 dark:text-slate-600 text-6xl mb-6" />
            <h2 className="text-2xl text-slate-800 dark:text-white font-bold mb-3">
              {applications.length === 0 ? "لا توجد تطبيقات حالياً" : "لا توجد نتائج مطابقة"}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {applications.length === 0
                ? "سيضيف المدراء تطبيقات عملية قريباً."
                : "جرب تغيير كلمة البحث أو تصفية المستوى أو الفئة."}
            </p>
          </div>
        )}

        {/* ── Cards Grid ── */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up stagger-3">
            {filtered.map((app, i) => (
              <ApplicationCard
                key={app.id}
                app={app}
                index={i}
                categoryName={categoryMap[app.categoryId] || null}
              />
            ))}
          </div>
        )}

        {/* ── Stats footer ── */}
        {!loading && applications.length > 0 && (
          <p className="text-center text-slate-400 dark:text-slate-500 text-sm mt-10">
            {filtered.length} من {applications.length} تطبيق متاح
          </p>
        )}
      </div>
    </div>
  );
};

export default ApplicationsPage;
