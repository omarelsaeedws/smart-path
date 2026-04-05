import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getActiveRoadmapId, getUserProgress } from "../services/progressService";
import { getRoadmapById, getRoadmaps } from "../services/roadmapService";
import { subscribeToResources } from "../services/resourceService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faArrowLeft,
  faCalendarWeek,
  faStar,
  faChevronLeft,
  faTools,
  faExternalLinkAlt,
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
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle stroke="rgba(255,255,255,0.15)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease-in-out" }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-sky-400"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-black text-white">{value}%</span>
      </div>
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const [activeRoadmap, setActiveRoadmap] = useState(null); // { id, title, description, level, totalWeeks }
  const [progressData, setProgressData] = useState({ completedLessons: [], progress: 0 });
  const [suggestedRoadmaps, setSuggestedRoadmaps] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const unsub = subscribeToResources((data) => {
      setTools(data.slice(0, 3));
    });

    const load = async () => {
      try {
        // 1. Get active roadmap ID
        const activeId = await getActiveRoadmapId(currentUser.uid);

        if (activeId) {
          const [rm, progress] = await Promise.all([
            getRoadmapById(activeId),
            getUserProgress(currentUser.uid, activeId),
          ]);
          setActiveRoadmap(rm ? { ...rm, id: activeId } : null);
          setProgressData(progress || { completedLessons: [], progress: 0 });
        }

        // 2. Get suggested roadmaps (first 3)
        const all = await getRoadmaps();
        setSuggestedRoadmaps(all.slice(0, 3));
      } catch (err) {
        console.error("Dashboard load error:", err);
        setError("حدث خطأ، حاول مرة أخرى");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => unsub();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-white/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const displayName =
    userProfile?.displayName ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "المستخدم";

  const completedCount = progressData.completedLessons?.length || 0;
  const progress = progressData.progress || 0;

  return (
    <div className="p-6 sm:p-10 relative overflow-hidden w-full animate-fade-in-up" dir="rtl">
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col gap-8">

        {/* ── Welcome header ─────────────────────────────────── */}
        <div className="flex items-center gap-4 animate-fade-in-up stagger-1">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center font-bold text-2xl text-white border border-white/30 shadow-inner flex-shrink-0">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">
              مرحباً، {displayName} 👋
            </h1>
            <p className="text-white/60">دعنا نكمل مسار تعلمك اليوم</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* ── Active roadmap card ────────────────────────────── */}
        {activeRoadmap ? (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-[0_15px_40px_rgba(14,165,233,0.25)] transition-shadow duration-500 animate-fade-in-up stagger-2">
            {/* Info */}
            <div className="flex-1 text-right w-full">
              <span className="inline-block bg-sky-500/30 text-sky-100 font-bold px-4 py-1.5 rounded-full text-sm mb-4 border border-sky-400/30">
                المسار الحالي النشط
              </span>
              <h2 className="text-3xl font-extrabold text-white mb-3 leading-tight">
                {activeRoadmap.title}
              </h2>
              <p className="text-white/70 text-base mb-6 line-clamp-2">{activeRoadmap.description}</p>

              {/* Stats */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 min-w-[110px]">
                  <p className="text-white/50 text-xs mb-1">الدروس المكتملة</p>
                  <p className="text-2xl font-bold text-white">{completedCount}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 min-w-[110px]">
                  <p className="text-white/50 text-xs mb-1">المستوى</p>
                  <p className="text-2xl font-bold text-white">{activeRoadmap.level || "—"}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 min-w-[110px]">
                  <p className="text-white/50 text-xs mb-1">عدد الأسابيع</p>
                  <p className="text-2xl font-bold text-white">{activeRoadmap.totalWeeks || 0}</p>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate(`/roadmap/${activeRoadmap.id}`)}
                  className="flex-1 bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2"
                >
                  متابعة التعلم
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button
                  onClick={() => navigate("/roadmaps")}
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl transition-all hover:-translate-y-0.5"
                >
                  تغيير المسار
                </button>
              </div>
            </div>

            {/* Progress ring */}
            <div className="flex-shrink-0 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-300">
              <p className="text-white/70 font-bold text-sm">نسبة الإنجاز</p>
              <CircularProgress value={progress} />
              <p className="text-white/50 text-xs text-center ">
                {progress === 100 ? "🎉 أتممت المسار!" : "استمر للأمام!"}
              </p>
            </div>
          </div>
        ) : (
          /* No active roadmap → CTA */
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center">
            <FontAwesomeIcon icon={faBookOpen} className="text-white/20 text-6xl mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">لم تبدأ أي مسار بعد</h2>
            <p className="text-white/60 mb-8">اختر مساراً من المكتبة وابدأ رحلتك التعليمية</p>
            <button
              onClick={() => navigate("/roadmaps")}
              className="bg-gradient-to-r from-sky-400 to-indigo-500 text-white font-bold py-4 px-10 rounded-2xl hover:-translate-y-1 transition-all shadow-lg"
            >
              استعراض المسارات
            </button>
          </div>
        )}

        {/* ── Suggested roadmaps ─────────────────────────────── */}
        {suggestedRoadmaps.length > 0 && (
          <div className="animate-fade-in-up stagger-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                مسارات مقترحة
              </h2>
              <button
                onClick={() => navigate("/roadmaps")}
                className="text-sky-300 hover:text-sky-200 font-bold text-sm flex items-center gap-1 transition-colors"
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
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-sky-500/20 text-sky-200 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-500/30">
                      {rm.level || "عام"}
                    </span>
                    <span className="text-white/40 text-xs flex items-center gap-1">
                      <FontAwesomeIcon icon={faCalendarWeek} className="text-xs" />
                      {rm.totalWeeks || 0}w
                    </span>
                  </div>
                  <h3 className="text-white font-bold mb-1 line-clamp-2 group-hover:text-sky-300 transition-colors">
                    {rm.title}
                  </h3>
                  <p className="text-white/50 text-xs line-clamp-2">{rm.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Suggested Tools ────────────────────────────────── */}
        {tools.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FontAwesomeIcon icon={faTools} className="text-emerald-400" />
                اقتراحات الأدوات
              </h2>
              <button
                onClick={() => navigate("/resources")}
                className="text-sky-300 hover:text-sky-200 font-bold text-sm flex items-center gap-1 transition-colors"
              >
                عرض الكل
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
                      <FontAwesomeIcon icon={faTools} />
                    </div>
                    <h3 className="text-white font-bold line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {tool.name}
                    </h3>
                  </div>
                  <p className="text-white/50 text-xs line-clamp-2 mb-4 flex-grow">
                    {tool.description}
                  </p>
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full text-center py-2 bg-white/5 hover:bg-white/10 text-emerald-300 text-xs font-bold rounded-lg border border-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} /> فتح الأداة
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
