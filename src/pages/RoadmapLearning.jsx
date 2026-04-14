import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getRoadmapById, getWeeks, getLessons } from "../services/roadmapService";
import { getUserProgress, markLessonComplete, isLessonUnlocked } from "../services/progressService";
import QuizModal from "../components/QuizModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faLock,
  faChevronDown,
  faChevronUp,
  faCalendarWeek,
  faClock,
  faLink,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

// Helper to extract YouTube ID
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const RoadmapLearning = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [roadmap, setRoadmap] = useState(null);
  const [weeks, setWeeks] = useState([]);
  const [allLessons, setAllLessons] = useState([]); // flat sorted list
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expandedLessonId, setExpandedLessonId] = useState(null);
  const [quizLesson, setQuizLesson] = useState(null); // lesson object when quiz is open

  // ── Load roadmap data ─────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!currentUser || !roadmapId) return;
    try {
      const [rm, weeksData, userProgress] = await Promise.all([
        getRoadmapById(roadmapId),
        getWeeks(roadmapId),
        getUserProgress(currentUser.uid, roadmapId),
      ]);

      if (!rm) {
        setError("لم يتم العثور على المسار.");
        return;
      }

      setRoadmap(rm);
      setCompletedLessons(userProgress.completedLessons || []);
      setProgress(userProgress.progress || 0);

      // Load lessons for each week
      const weeksWithLessons = await Promise.all(
        weeksData.map(async (week) => {
          const lessons = await getLessons(roadmapId, week.id);
          return { ...week, lessons };
        })
      );

      setWeeks(weeksWithLessons);

      // Build a flat, ordered list of all lessons for unlock logic
      const flat = weeksWithLessons.flatMap((w) => w.lessons);
      setAllLessons(flat);
    } catch (err) {
      console.error("Error loading roadmap:", err);
      setError("حدث خطأ أثناء تحميل المسار.");
    } finally {
      setLoading(false);
    }
  }, [currentUser, roadmapId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Quiz pass handler ─────────────────────────────────────────────────────
  const handleQuizPass = async () => {
    if (!quizLesson) return;
    try {
      const result = await markLessonComplete(
        currentUser.uid,
        roadmapId,
        quizLesson.id,
        allLessons.length
      );
      setCompletedLessons(result.completedLessons);
      setProgress(result.progress);
    } catch (err) {
      console.error("Error saving progress:", err);
    } finally {
      setQuizLesson(null);
      setExpandedLessonId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-900 dark:text-white" dir="rtl">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-600 rounded-full" />
          <div className="absolute inset-0 border-4 border-sky-500 dark:border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-screen w-full" dir="rtl">
        <div className="bg-white/80 dark:bg-slate-800 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center text-slate-800 dark:text-white">
          <h2 className="text-2xl font-bold mb-2">عذراً</h2>
          <p className="text-slate-500 dark:text-slate-200 mb-6">{error || "لم يتم العثور على المسار"}</p>
          <button
            onClick={() => navigate("/roadmaps")}
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 ease-out"
          >
            العودة للمسارات
          </button>
        </div>
      </div>
    );
  }

  const totalLessons = allLessons.length;
  const completedCount = completedLessons.length;

  return (
    <div className="p-6 md:p-8 lg:p-10 relative overflow-x-hidden overflow-y-auto w-full min-h-screen" dir="rtl">
      
      {/* Top Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8 relative z-20 animate-fade-in-up">
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-white/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-bold py-2.5 px-6 rounded-2xl flex items-center gap-3 shadow-sm cursor-pointer hover-lift transition-all duration-300 ease-out"
        >
          <FontAwesomeIcon icon={faArrowRight} />
          العودة إلى لوحة التحكم
        </button>
      </div>

      {/* Quiz Modal */}
      {quizLesson && (
        <QuizModal
          lesson={quizLesson}
          onPass={handleQuizPass}
          onClose={() => setQuizLesson(null)}
        />
      )}

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── Header Card ──────────────────────────────────────── */}
        <div className="bg-white/80 dark:bg-slate-800 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-none rounded-3xl p-8 mb-10 text-slate-900 dark:text-white animate-fade-in-up stagger-1">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-sky-100 dark:bg-sky-500/30 text-sky-700 dark:text-sky-200 border border-sky-200 dark:border-transparent px-3 py-1 rounded-full text-sm font-bold">
              {roadmap.level || "عام"}
            </span>
            <span className="bg-indigo-100 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-transparent px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendarWeek} className="text-xs" />
              {roadmap.totalWeeks || 0} أسابيع
            </span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2">{roadmap.title}</h1>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{roadmap.description}</p>

          {/* Progress bar */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-sky-600 dark:text-sky-300">التقدم الدراسي</span>
              <span className="text-3xl font-black">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">
              أنجزت <span className="text-slate-800 dark:text-white font-bold">{completedCount}</span> درساً من أصل{" "}
              <span className="text-slate-800 dark:text-white font-bold">{totalLessons}</span> درس
            </p>
          </div>
        </div>

        {/* ── Weeks & Lessons ──────────────────────────────────── */}
        <div className="space-y-10 animate-fade-in-up stagger-2">
          {weeks.map((week) => (
            <div key={week.id}>
              {/* Week header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg rotate-12">
                  <FontAwesomeIcon icon={faCalendarWeek} className="text-white text-xl -rotate-12" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">الأسبوع {week.weekNumber}</h2>
                  {week.weekGoal && (
                    <p className="text-sky-600 dark:text-sky-200 text-sm font-medium">{week.weekGoal}</p>
                  )}
                </div>
              </div>

              {/* Lessons */}
              <div className="grid gap-4 border-r-2 border-slate-200 dark:border-slate-700 pr-6 mr-6">
                {week.lessons.map((lesson) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const unlocked = isLessonUnlocked(completedLessons, allLessons, lesson.id);
                  const isExpanded = expandedLessonId === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      className={`bg-white/60 dark:bg-slate-800 border rounded-2xl overflow-hidden transition-all duration-300 ${
                        isExpanded
                          ? "ring-2 ring-sky-500/50 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-md"
                          : unlocked
                          ? "border-slate-200 dark:border-slate-700 hover:bg-white/90 dark:hover:bg-slate-700 cursor-pointer shadow-sm"
                          : "border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {/* Lesson header row */}
                      <div
                        onClick={() => {
                          if (!unlocked) return;
                          setExpandedLessonId(isExpanded ? null : lesson.id);
                        }}
                        className="p-5 flex items-center gap-4 w-full"
                      >
                        {/* Status icon */}
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-sm flex-shrink-0 transition-colors ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : unlocked
                              ? "bg-sky-500 text-white"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-white"
                          }`}
                        >
                          {isCompleted ? (
                            <FontAwesomeIcon icon={faCheckCircle} />
                          ) : !unlocked ? (
                            <FontAwesomeIcon icon={faLock} className="text-slate-400 dark:text-slate-400" />
                          ) : (
                            <span className="text-sm">{lesson.order || "•"}</span>
                          )}
                        </div>

                        <div className="flex-1">
                          <h4
                            className={`text-lg font-bold transition-colors duration-300 ${
                              isCompleted ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs mt-1">
                            {lesson.estimatedHours && (
                              <span className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faClock} />
                                {lesson.estimatedHours} ساعات
                              </span>
                            )}
                            {!unlocked && (
                              <span className="text-amber-600 dark:text-amber-400/70 font-medium">
                                🔒 أكمل الدرس السابق أولاً
                              </span>
                            )}
                          </div>
                        </div>

                        {unlocked && (
                          <FontAwesomeIcon
                            icon={isExpanded ? faChevronUp : faChevronDown}
                            className="text-slate-400 dark:text-slate-500 w-4 h-4 flex-shrink-0"
                          />
                        )}
                      </div>

                      {/* Expanded lesson content */}
                      <div
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${
                          isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="p-6 pt-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                          {/* Description */}
                          {lesson.description && (
                            <div className="py-4">
                              <h5 className="text-sky-600 dark:text-sky-300 font-bold mb-2">ماذا ستتعلم؟</h5>
                              <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                                {lesson.description}
                              </p>
                            </div>
                          )}

                          {/* Resource link / Video */}
                          {lesson.resourceLink && lesson.resourceLink !== "pending" && (
                            <div className="mb-6">
                              {(() => {
                                const videoId = getYouTubeId(lesson.resourceLink);
                                if (videoId) {
                                  return (
                                    <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-slate-200 dark:border-slate-700" style={{ paddingTop: "56.25%" }}>
                                      <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title="Lesson Video"
                                        allowFullScreen
                                      ></iframe>
                                    </div>
                                  );
                                }
                                return (
                                  <a
                                    href={lesson.resourceLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-sky-50 dark:bg-sky-500/20 hover:bg-sky-100 dark:hover:bg-sky-500/30 border border-sky-200 dark:border-sky-400/30 text-sky-600 dark:text-sky-300 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ease-out"
                                  >
                                    <FontAwesomeIcon icon={faLink} />
                                    رابط المصدر التعليمي
                                  </a>
                                );
                              })()}
                            </div>
                          )}

                          {/* Action button */}
                          <div className="flex justify-end mt-4">
                            {isCompleted ? (
                              <span className="flex items-center gap-2 px-6 py-2.5 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30 rounded-xl font-bold text-sm">
                                <FontAwesomeIcon icon={faCheckCircle} />
                                تم الإنجاز
                              </span>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQuizLesson(lesson);
                                }}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg hover-lift transition-all duration-300 ease-out"
                              >
                                <FontAwesomeIcon icon={faArrowRight} />
                                إنهاء الدرس واجتياز الاختبار
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {week.lessons.length === 0 && (
                  <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-4">
                    لا توجد دروس في هذا الأسبوع بعد.
                  </p>
                )}
              </div>
            </div>
          ))}

          {weeks.length === 0 && (
            <div className="bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center text-slate-800 dark:text-white">
              <p className="text-slate-500 dark:text-slate-400">لا توجد أسابيع في هذا المسار بعد.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadmapLearning;
