import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { getRoadmaps } from "../services/roadmapService";
import { getUserProgress, setActiveRoadmap } from "../services/progressService";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faCalendarWeek,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

const RoadmapsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(null); // roadmapId being started
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRoadmaps();
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
  }, [currentUser]);

  const handleStart = async (roadmapId) => {
    if (!currentUser || starting) return;
    setStarting(roadmapId);
    try {
      // Save as active roadmap
      await setActiveRoadmap(currentUser.uid, roadmapId);
      navigate(`/roadmap/${roadmapId}`);
    } catch (err) {
      console.error("Error starting roadmap:", err);
      setStarting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center w-full">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-white/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 relative overflow-hidden w-full animate-fade-in-up" dir="rtl">
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-10 animate-fade-in-up stagger-1">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md flex items-center gap-3">
            <FontAwesomeIcon icon={faBookOpen} className="text-sky-400" />
            مسارات التعلم
          </h1>
          <p className="text-white/60 mt-2">اختر مساراً وابدأ رحلتك التعليمية الآن</p>
        </div>

        {/* Empty state */}
        {roadmaps.length === 0 && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-16 text-center shadow-xl">
            <FontAwesomeIcon icon={faBookOpen} className="text-white/20 text-6xl mb-6" />
            <h2 className="text-2xl text-white font-bold mb-4">لا توجد مسارات حالياً</h2>
            <p className="text-white/60">سيضيف المدراء مسارات تعليمية قريباً. تفقد هذه الصفحة لاحقاً.</p>
          </div>
        )}

        {/* Roadmap cards */}
        {roadmaps.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up stagger-2">
            {roadmaps.map((rm) => {
              const progress = progressMap[rm.id] || 0;
              const isStarting = starting === rm.id;

              return (
                <div
                  key={rm.id}
                  onClick={() => setSelectedRoadmap(rm)}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(14,165,233,0.25)] flex flex-col justify-between min-h-[320px] group cursor-pointer"
                >
                  <div>
                    {/* Badges */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-sky-500/20 text-sky-200 text-xs font-bold px-3 py-1 rounded-full border border-sky-500/30">
                        {rm.level || "عام"}
                      </span>
                      <span className="bg-indigo-500/20 text-indigo-200 text-xs px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarWeek} className="text-xs" />
                        {rm.totalWeeks || 0} أسابيع
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-sky-300 transition-colors">
                      {rm.title}
                    </h3>
                    <p className="text-white/60 text-sm line-clamp-3 mb-4">{rm.description}</p>
                  </div>

                  <div className="mt-auto space-y-4">
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
                      className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 bg-white/5 border border-white/10 text-white/80 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-indigo-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg"
                    >
                      {isStarting ? (
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FontAwesomeIcon icon={progress > 0 ? faPlay : faPlay} />
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
            <button onClick={() => setSelectedRoadmap(null)} className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors cursor-pointer text-xl w-8 h-8 flex items-center justify-center rounded-full bg-white/5">✕</button>
            
            <div>
              <div className="flex gap-2 mb-3">
                <span className="bg-sky-500/20 text-sky-200 text-xs font-bold px-3 py-1 rounded-full border border-sky-500/30">
                  {selectedRoadmap.level || "عام"}
                </span>
                <span className="bg-indigo-500/20 text-indigo-200 text-xs px-3 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                  <FontAwesomeIcon icon={faCalendarWeek} className="text-xs" />
                  {selectedRoadmap.totalWeeks || 0} أسابيع
                </span>
              </div>
              <h2 className="text-3xl font-black text-white leading-tight">{selectedRoadmap.title}</h2>
            </div>
            
            <p className="text-white/70 text-base leading-relaxed">{selectedRoadmap.description}</p>
            
            {/* Additional Admin Data */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col gap-3 my-2">
              <h4 className="text-sky-300 font-bold text-sm mb-1 border-b border-white/10 pb-2">تفاصيل إضافية</h4>
              
              <div className="flex gap-2 items-center text-sm">
                <span className="text-white/50 w-24 line-clamp-1">المدرب:</span>
                <span className="text-white font-bold">{selectedRoadmap.instructorName || "غير محدد"}</span>
              </div>
              
              <div className="flex gap-2 items-center text-sm">
                <span className="text-white/50 w-24 line-clamp-1">مصدر المحتوى:</span>
                <span className="text-white font-bold">{selectedRoadmap.contentSource || "غير محدد"}</span>
              </div>
              
              {selectedRoadmap.sourceLink && (
                <div className="flex gap-2 items-center text-sm">
                  <span className="text-white/50 w-24 line-clamp-1">رابط المصدر:</span>
                  <a href={selectedRoadmap.sourceLink} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 transition-colors cursor-pointer font-bold inline-flex items-center gap-1">
                    زيارة الرابط
                    <FontAwesomeIcon icon={faPlay} className="text-[10px]" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-2 pt-5 border-t border-white/10">
              <button
                onClick={() => handleStart(selectedRoadmap.id)}
                disabled={!!starting}
                className={`flex-1 font-bold py-3 rounded-2xl transition cursor-pointer flex justify-center items-center gap-2 ${
                  starting === selectedRoadmap.id 
                    ? "bg-sky-500/50 text-white cursor-wait"
                    : "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {starting === selectedRoadmap.id ? "جاري التحميل..." : (progressMap[selectedRoadmap.id] > 0 ? "متابعة التعلم" : "ابدأ التعلم")}
              </button>
              <button
                onClick={() => setSelectedRoadmap(null)}
                className="w-1/3 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-2xl transition cursor-pointer"
              >
                إغلاق
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
