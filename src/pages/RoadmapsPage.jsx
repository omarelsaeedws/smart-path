import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { getRoadmaps } from "../services/roadmapService";
import { getUserProgress, setActiveRoadmap } from "../services/progressService";
import { subscribeToCategories } from "../services/categoryService";
import { submitRating, getUserRating } from "../services/ratingService";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faCalendarWeek,
  faPlay,
  faStar as faStarSolid,
  faTag,
} from "@fortawesome/free-solid-svg-icons";

// ── Skeleton Card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden animate-pulse h-[320px] p-6 flex flex-col justify-between">
    <div>
      <div className="flex justify-between mb-4">
        <div className="h-6 w-16 bg-white/10 rounded-full" />
        <div className="h-6 w-20 bg-white/10 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-white/10 rounded-full mb-3" />
      <div className="h-4 w-full bg-white/10 rounded-full mb-2" />
      <div className="h-4 w-2/3 bg-white/10 rounded-full" />
    </div>
    <div className="h-12 w-full bg-white/10 rounded-2xl" />
  </div>
);

const RoadmapsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [roadmaps, setRoadmaps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(null);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  // Filters
  const [activeCategoryId, setActiveCategoryId] = useState("الكل");

  // Ratings
  const [userRating, setUserRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    let unsubCats;
    const load = async () => {
      try {
        const [data] = await Promise.all([
          getRoadmaps(),
          new Promise(resolve => {
            unsubCats = subscribeToCategories(cats => resolve(setCategories(cats)));
          })
        ]);
        
        setRoadmaps(data);

        if (currentUser) {
          const entries = await Promise.all(
            data.map(async (rm) => {
              const p = await getUserProgress(currentUser.uid, rm.id);
              return [rm.id, p.progress || 0];
            })
          );
          setProgressMap(Object.fromEntries(entries));
        }
      } catch (err) {
        console.error("Error loading roadmaps:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      if (unsubCats) unsubCats();
    };
  }, [currentUser]);

  // Load user's rating when a roadmap is selected
  useEffect(() => {
    if (selectedRoadmap && currentUser) {
      getUserRating(currentUser.uid, selectedRoadmap.id)
        .then(r => setUserRating(r || 0))
        .catch(console.error);
    } else {
      setUserRating(0);
    }
  }, [selectedRoadmap, currentUser]);

  const handleStart = async (roadmapId) => {
    if (!currentUser || starting) return;
    setStarting(roadmapId);
    try {
      await setActiveRoadmap(currentUser.uid, roadmapId);
      navigate(`/roadmap/${roadmapId}`);
    } catch (err) {
      console.error("Error starting roadmap:", err);
      setStarting(null);
    }
  };

  const handleRate = async (starValue) => {
    if (!currentUser || submittingRating || !selectedRoadmap) return;
    setSubmittingRating(true);
    try {
      const result = await submitRating(currentUser.uid, selectedRoadmap.id, starValue);
      setUserRating(starValue);
      if (result) {
        // Update local state without full refetch
        setRoadmaps(prev => prev.map(rm => 
          rm.id === selectedRoadmap.id 
            ? { ...rm, averageRating: result.newAvg, ratingCount: result.newCount } 
            : rm
        ));
        setSelectedRoadmap(prev => ({
          ...prev, 
          averageRating: result.newAvg, 
          ratingCount: result.newCount 
        }));
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setSubmittingRating(false);
    }
  };

  // Build categoryName map
  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  // Filter roadmaps
  const filtered = useMemo(() => {
    return roadmaps.filter((rm) => 
      activeCategoryId === "الكل" || rm.categoryId === activeCategoryId
    );
  }, [roadmaps, activeCategoryId]);

  return (
    <div className="p-6 sm:p-10 relative overflow-hidden w-full animate-fade-in-up" dir="rtl">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-8 animate-fade-in-up stagger-1">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md flex items-center gap-3 mb-2">
            <FontAwesomeIcon icon={faBookOpen} className="text-sky-400" />
            مسارات التعلم
          </h1>
          <p className="text-white/60">اختر مساراً وابدأ رحلتك التعليمية الآن</p>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap items-center mb-8 animate-fade-in-up stagger-2">
          <span className="text-white/40 text-xs font-medium ml-1">تصفية بالفئة:</span>
          <button
            onClick={() => setActiveCategoryId("الكل")}
            className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 border ${
              activeCategoryId === "الكل"
                ? "bg-sky-500 border-sky-400 text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
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
                  ? "bg-sky-500/30 border-sky-400/50 text-sky-200 shadow-md"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-16 text-center shadow-xl">
            <FontAwesomeIcon icon={faBookOpen} className="text-white/20 text-6xl mb-6" />
            <h2 className="text-2xl text-white font-bold mb-4">لا توجد مسارات حالياً</h2>
            <p className="text-white/60">
              {activeCategoryId === "الكل" 
                ? "سيضيف المدراء مسارات تعليمية قريباً. تفقد هذه الصفحة لاحقاً."
                : "لا توجد مسارات لهذه الفئة حالياً."}
            </p>
          </div>
        )}

        {/* Roadmap cards */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up stagger-3">
            {filtered.map((rm) => {
              const progress = progressMap[rm.id] || 0;
              const isStarting = starting === rm.id;
              const catName = categoryMap[rm.categoryId];
              const avgRating = rm.averageRating || 0;

              return (
                <div
                  key={rm.id}
                  onClick={() => setSelectedRoadmap(rm)}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(14,165,233,0.25)] hover:border-white/20 flex flex-col justify-between min-h-[320px] group cursor-pointer"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex justify-between items-start mb-4 gap-2 flex-wrap">
                      <div className="flex gap-2">
                        <span className="bg-sky-500/20 text-sky-200 text-xs font-bold px-2.5 py-1 rounded-full border border-sky-500/30">
                          {rm.level || "عام"}
                        </span>
                        {catName && (
                          <span className="bg-violet-500/20 text-violet-200 text-xs font-bold px-2.5 py-1 rounded-full border border-violet-500/30 flex items-center gap-1">
                            <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                            {catName}
                          </span>
                        )}
                      </div>
                      <span className="bg-indigo-500/20 text-indigo-200 text-xs px-2.5 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarWeek} className="text-xs" />
                        {rm.totalWeeks || 0} أسابيع
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-sky-300 transition-colors">
                      {rm.title}
                    </h3>
                    <p className="text-white/50 text-sm line-clamp-3 mb-4 leading-relaxed">{rm.description}</p>
                  </div>

                  <div className="mt-auto space-y-4">
                    {/* Rating Badge */}
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <FontAwesomeIcon icon={faStarSolid} className={avgRating > 0 ? "text-amber-400" : "text-white/20"} />
                      <span className={avgRating > 0 ? "text-amber-400" : "text-white/40"}>
                        {avgRating > 0 ? `${avgRating} / 5` : "لا يوجد تقييم"}
                      </span>
                      {rm.ratingCount > 0 && <span className="text-white/30 font-normal">({rm.ratingCount})</span>}
                    </div>

                    {/* Progress bar */}
                    {progress > 0 && (
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-white/60 text-xs">التقدم</span>
                          <span className="text-sky-300 font-bold text-sm">{progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* CTA button placeholder */}
                    <div
                      className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 border ${
                        progress > 0 
                          ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-transparent shadow-lg shadow-sky-500/20" 
                          : "bg-white/5 border-white/10 text-white/80 group-hover:bg-sky-500/20 group-hover:border-sky-500/40 group-hover:text-sky-300"
                      }`}
                    >
                      {isStarting ? (
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FontAwesomeIcon icon={progress > 0 ? faPlay : faPlay} className="text-xs" />
                      )}
                      {progress > 0 ? "متابعة التعلم" : "عرض التفاصيل"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ROADMAP DETAILS MODAL */}
      {selectedRoadmap && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 w-screen h-screen" dir="rtl">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" onClick={() => setSelectedRoadmap(null)}></div>
          <div className="bg-[#1e293b] border border-white/20 rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl animate-fade-in-up flex flex-col gap-5 transform scale-95 origin-center transition-all duration-300" style={{ transform: "scale(1)" }}>
            <button onClick={() => setSelectedRoadmap(null)} className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors cursor-pointer text-xl w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10">✕</button>
            
            <div>
              <div className="flex gap-2 mb-3">
                <span className="bg-sky-500/20 text-sky-200 text-xs font-bold px-3 py-1 rounded-full border border-sky-500/30">
                  {selectedRoadmap.level || "عام"}
                </span>
                {categoryMap[selectedRoadmap.categoryId] && (
                  <span className="bg-violet-500/20 text-violet-200 text-xs font-bold px-3 py-1 rounded-full border border-violet-500/30 flex items-center gap-1">
                    <FontAwesomeIcon icon={faTag} className="text-[10px]" />
                    {categoryMap[selectedRoadmap.categoryId]}
                  </span>
                )}
                <span className="bg-indigo-500/20 text-indigo-200 text-xs px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendarWeek} className="text-xs" />
                  {selectedRoadmap.totalWeeks || 0} أسابيع
                </span>
              </div>
              <h2 className="text-3xl font-black text-white leading-tight">{selectedRoadmap.title}</h2>
            </div>
            
            <p className="text-white/70 text-base leading-relaxed">{selectedRoadmap.description}</p>
            
            {/* Rating Section inside Modal */}
            <div className="bg-white/5 rounded-2xl p-4 border border-emerald-500/20 flex flex-col gap-2 items-center text-center">
              <p className="text-white/70 text-sm font-medium">ما تقييمك لهذا المسار؟</p>
              <div className="flex flex-row-reverse justify-center gap-2 group">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    disabled={submittingRating}
                    className={`text-2xl transition-all duration-200 p-1 
                      ${star <= userRating ? "text-amber-400" : "text-white/20"} 
                      hover:scale-110 hover:text-amber-300 peer peer-hover:text-amber-300`}
                    title={`تقييم بـ ${star} نجوم`}
                  >
                    <FontAwesomeIcon icon={faStarSolid} />
                  </button>
                ))}
              </div>
              <p className="text-white/40 text-xs">
                {selectedRoadmap.averageRating > 0 
                  ? `متوسط التقييم: ⭐ ${selectedRoadmap.averageRating} من ${selectedRoadmap.ratingCount} مستخدم`
                  : "كن أول من يقيم هذا المسار!"}
              </p>
            </div>

            {/* Additional Admin Data */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col gap-3">
              <h4 className="text-sky-300 font-bold text-sm mb-1 border-b border-white/10 pb-2">تفاصيل إضافية</h4>
              <div className="flex gap-2 items-center text-sm">
                <span className="text-white/50 w-24">المدرب:</span>
                <span className="text-white font-bold">{selectedRoadmap.instructorName || "غير محدد"}</span>
              </div>
              <div className="flex gap-2 items-center text-sm">
                <span className="text-white/50 w-24">مصدر المحتوى:</span>
                <span className="text-white font-bold">{selectedRoadmap.contentSource || "غير محدد"}</span>
              </div>
              {selectedRoadmap.sourceLink && (
                <div className="flex gap-2 items-center text-sm">
                  <span className="text-white/50 w-24">رابط المصدر:</span>
                  <a href={selectedRoadmap.sourceLink} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors font-bold inline-flex items-center gap-1">
                    زيارة الرابط <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
                  </a>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2 pt-2">
              <button
                onClick={() => handleStart(selectedRoadmap.id)}
                disabled={!!starting}
                className={`flex-1 font-bold py-3.5 rounded-2xl transition cursor-pointer flex justify-center items-center gap-2 ${
                  starting === selectedRoadmap.id 
                    ? "bg-sky-500/50 text-white cursor-wait"
                    : "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {starting === selectedRoadmap.id ? "جاري التحميل..." : (progressMap[selectedRoadmap.id] > 0 ? "متابعة التعلم" : "ابدأ التعلم")}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};

export default RoadmapsPage;
