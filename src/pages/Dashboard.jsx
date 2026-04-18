import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getActiveRoadmapId,
  getUserProgress,
} from "../services/progressService";
import { getRoadmapById, getRoadmaps } from "../services/roadmapService";
import { subscribeToResources } from "../services/resourceService";
import { subscribeToApplications } from "../services/applicationService";
import { subscribeToCategories } from "../services/categoryService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faArrowLeft,
  faCalendarWeek,
  faStar,
  faChevronLeft,
  faTools,
  faExternalLinkAlt,
  faLaptopCode,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

// ── Circular Progress ──────────────────────────────────────────────────────
const CircularProgress = ({ value }) => {
  const radius = 75;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        {/* Track — theme-aware */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-slate-200 dark:text-slate-600"
        />
        {/* Progress arc */}
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 1s ease-in-out",
          }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-sky-500 dark:text-sky-400"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-slate-900 dark:text-white">
          {value}%
        </span>
      </div>
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [progressData, setProgressData] = useState({
    completedLessons: [],
    progress: 0,
  });
  const [allRoadmaps, setAllRoadmaps] = useState([]);
  const [tools, setTools] = useState([]);
  const [applications, setApplications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const unsubTools = subscribeToResources(setTools);
    const unsubApps = subscribeToApplications(setApplications);
    const unsubCats = subscribeToCategories(setCategories);

    const load = async () => {
      try {
        const activeId = await getActiveRoadmapId(currentUser.uid);
        if (activeId) {
          const [rm, progress] = await Promise.all([
            getRoadmapById(activeId),
            getUserProgress(currentUser.uid, activeId),
          ]);
          setActiveRoadmap(rm ? { ...rm, id: activeId } : null);
          setProgressData(progress || { completedLessons: [], progress: 0 });
        }
        const all = await getRoadmaps();
        setAllRoadmaps(all);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("حدث خطأ، حاول مرة أخرى");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => {
      unsubTools();
      unsubApps();
      unsubCats();
    };
  }, [currentUser]);


  const displayName =
    userProfile?.displayName ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "المستخدم";

  const completedCount = progressData.completedLessons?.length || 0;
  const progress = progressData.progress || 0;

  // ── Interest-based filtering ──────────────────────────────────────────────
  const userInterests = userProfile?.interests || [];
  const hasInterests = userInterests.length > 0;

  // Build categoryId → name map
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  // Filter roadmaps by interests; fall back to first 3 if no match
  const filteredRoadmaps = hasInterests
    ? allRoadmaps.filter((rm) => userInterests.includes(rm.categoryId))
    : allRoadmaps;
  const suggestedRoadmaps = (
    filteredRoadmaps.length > 0 ? filteredRoadmaps : allRoadmaps
  ).slice(0, 3);

  // Filter applications by interests; fall back to first 3
  const filteredApps = hasInterests
    ? applications.filter((app) => userInterests.includes(app.categoryId))
    : applications;
  const suggestedApps = (
    filteredApps.length > 0 ? filteredApps : applications
  ).slice(0, 3);

  // Filter tools by interests; fall back to first 3
  const filteredTools = hasInterests
    ? tools.filter((t) => userInterests.includes(t.categoryId))
    : tools;
  const suggestedTools = (
    filteredTools.length > 0 ? filteredTools : tools
  ).slice(0, 3);

  return (
    <div
      className="p-6 sm:p-10 relative overflow-hidden w-full animate-fade-in-up"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col gap-8">
        {/* ── Welcome header ── */}
        <div className="flex items-center gap-4 animate-fade-in-up stagger-1">
          <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-2xl text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 shadow-inner flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              مرحباً، {displayName} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              دعنا نكمل مسار تعلمك اليوم
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* ── Active roadmap card ── */}
        {activeRoadmap ? (
          <div className="bg-white/80 dark:bg-slate-800 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl shadow-xl dark:shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-[0_15px_40px_rgba(14,165,233,0.15)] dark:hover:shadow-[0_15px_40px_rgba(14,165,233,0.25)] animate-fade-in-up stagger-2 transition-all duration-300 ease-out">
            <div className="flex-1 text-right w-full">
              <span className="inline-block bg-sky-100 dark:bg-sky-500/30 text-sky-700 dark:text-sky-100 font-bold px-4 py-1.5 rounded-full text-sm mb-4 border border-sky-200 dark:border-sky-400/30">
                المسار الحالي النشط
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3 leading-tight">
                {activeRoadmap.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base mb-6 line-clamp-2">
                {activeRoadmap.description}
              </p>
              <div className="flex gap-4 mb-6 flex-wrap">
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 flex-1 min-w-[110px]">
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                    الدروس المكتملة
                  </p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {completedCount}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 flex-1 min-w-[110px]">
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                    المستوى
                  </p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {activeRoadmap.level || "—"}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 flex-1 min-w-[110px]">
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">
                    عدد الأسابيع
                  </p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">
                    {activeRoadmap.totalWeeks || 0}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate(`/roadmap/${activeRoadmap.id}`)}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover-lift transition-all duration-300 ease-out"
                >
                  متابعة التعلم
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button
                  onClick={() => navigate("/roadmaps")}
                  className="px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold rounded-2xl hover-lift transition-all duration-300 ease-out"
                >
                  تغيير المسار
                </button>
              </div>
            </div>
            <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 flex flex-col items-center gap-3 hover-lift">
              <p className="text-slate-600 dark:text-slate-300 font-bold text-sm">
                نسبة الإنجاز
              </p>
              <CircularProgress value={progress} />
              <p className="text-slate-500 dark:text-slate-400 text-xs text-center">
                {progress === 100 ? "🎉 أتممت المسار!" : "استمر للأمام!"}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 dark:bg-slate-800 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-3xl p-10 text-center">
            <FontAwesomeIcon
              icon={faBookOpen}
              className="text-slate-300 dark:text-slate-600 text-6xl mb-6"
            />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
              لم تبدأ أي مسار بعد
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              اختر مساراً من المكتبة وابدأ رحلتك التعليمية
            </p>
            <button
              onClick={() => navigate("/roadmaps")}
              className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold py-4 px-10 rounded-2xl shadow-lg hover-lift"
            >
              استعراض المسارات
            </button>
          </div>
        )}

        {/* ── Suggested Roadmaps (interest-filtered) ── */}
        {suggestedRoadmaps.length > 0 && (
          <div className="animate-fade-in-up stagger-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                {hasInterests ? "مسارات تناسب اهتماماتك" : "مسارات مقترحة"}
              </h2>
              <button
                onClick={() => navigate("/roadmaps")}
                className="text-sky-500 dark:text-sky-300 hover:text-sky-600 dark:hover:text-sky-200 font-bold text-sm flex items-center gap-1 transition-all duration-300 ease-out"
              >
                عرض الكل
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {suggestedRoadmaps.map((rm) => (
                <div
                  key={rm.id}
                  onClick={() => navigate("/roadmaps")}
                  className="bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 cursor-pointer hover:bg-white dark:hover:bg-slate-700 group hover-lift transition-all duration-300 ease-out"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-200 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-500/30">
                      {rm.level || "عام"}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-xs flex items-center gap-1">
                      <FontAwesomeIcon
                        icon={faCalendarWeek}
                        className="text-xs"
                      />
                      {rm.totalWeeks || 0}w
                    </span>
                  </div>
                  {categoryMap[rm.categoryId] && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20 mb-2">
                      <FontAwesomeIcon icon={faTag} className="text-[9px]" />
                      {categoryMap[rm.categoryId]}
                    </span>
                  )}
                  <h3 className="text-slate-800 dark:text-white font-bold mb-1 line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-all duration-300 ease-out">
                    {rm.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">
                    {rm.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Suggested Applications (interest-filtered) ── */}
        {suggestedApps.length > 0 && (
          <div className="animate-fade-in-up stagger-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faLaptopCode}
                  className="text-violet-500 dark:text-violet-400"
                />
                {hasInterests ? "تطبيقات تناسب اهتماماتك" : "تطبيقات مقترحة"}
              </h2>
              <button
                onClick={() => navigate("/applications")}
                className="text-sky-500 dark:text-sky-300 hover:text-sky-600 dark:hover:text-sky-200 font-bold text-sm flex items-center gap-1 transition-all duration-300 ease-out"
              >
                عرض الكل
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {suggestedApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:bg-white dark:hover:bg-slate-700 group flex flex-col hover-lift transition-all duration-300 ease-out"
                >
                  {categoryMap[app.categoryId] && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20 mb-2 w-fit">
                      <FontAwesomeIcon icon={faTag} className="text-[9px]" />
                      {categoryMap[app.categoryId]}
                    </span>
                  )}
                  <h3 className="text-slate-800 dark:text-white font-bold mb-1 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-300 flex-1 transition-all duration-300 ease-out">
                    {app.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-3">
                    {app.description}
                  </p>
                  {app.link ? (
                    <a
                      href={app.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto text-center py-2 bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 text-violet-600 dark:text-violet-300 text-xs font-bold rounded-lg border border-violet-100 dark:border-violet-500/20 flex items-center justify-center gap-1 transition-all duration-300 ease-out"
                    >
                      <FontAwesomeIcon
                        icon={faExternalLinkAlt}
                        className="text-[10px]"
                      />
                      عرض المشروع
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Suggested Tools (interest-filtered) ── */}
        {suggestedTools.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faTools}
                  className="text-emerald-500 dark:text-emerald-400"
                />
                {hasInterests ? "أدوات تناسب اهتماماتك" : "اقتراحات الأدوات"}
              </h2>
              <button
                onClick={() => navigate("/resources")}
                className="text-emerald-500 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 font-bold text-sm flex items-center gap-1 transition-all duration-300 ease-out"
              >
                عرض الكل
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {suggestedTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:bg-white dark:hover:bg-slate-700 group flex flex-col h-full hover-lift transition-all duration-300 ease-out"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {tool.logoUrl ? (
                        <img
                          src={tool.logoUrl}
                          alt={tool.name}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <span
                        className="w-full h-full items-center justify-center text-emerald-600 dark:text-emerald-400 text-lg"
                        style={{ display: tool.logoUrl ? "none" : "flex" }}
                      >
                        <FontAwesomeIcon icon={faTools} />
                      </span>
                    </div>
                    <h3 className="text-slate-800 dark:text-white font-bold line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-all duration-300 ease-out">
                      {tool.name}
                    </h3>
                  </div>
                  {(categoryMap[tool.categoryId] || tool.category) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 mb-2 w-fit">
                      <FontAwesomeIcon icon={faTag} className="text-[9px]" />
                      {categoryMap[tool.categoryId] || tool.category}
                    </span>
                  )}
                  <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4 flex-grow">
                    {tool.description}
                  </p>
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full text-center py-2 bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-300 text-xs font-bold rounded-lg border border-emerald-100 dark:border-slate-700 flex items-center justify-center gap-2 transition-all duration-300 ease-out"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                    فتح الأداة
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
