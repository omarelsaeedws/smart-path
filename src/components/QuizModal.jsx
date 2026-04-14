import React, { useState, useEffect } from "react";
import { functions } from "../lib/firebase";
import { httpsCallable } from "firebase/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faTimes,
  faTrophy,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";

/**
 * QuizModal
 * Props:
 *   lesson        – { id, title, description }
 *   onPass        – callback when score >= 60%
 *   onClose       – callback to close without passing
 */
const QuizModal = ({ lesson, onPass, onClose }) => {
  const [phase, setPhase] = useState("loading"); // loading | quiz | result
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  // ── Fetch quiz on mount ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const generateQuiz = httpsCallable(functions, "generateQuiz");
        const response = await generateQuiz({
          lessonId: lesson.id,
          title: lesson.title,
          description: lesson.description || "",
        });

        const data = response.data?.data;
        if (!data?.questions || data.questions.length === 0) {
          throw new Error("No questions returned");
        }
        setQuestions(data.questions);
        setFromCache(response.data?.fromCache || false);
        setPhase("quiz");
      } catch (err) {
        console.error("Quiz fetch error:", err);
        setError("فشل في توليد الأسئلة. يرجى المحاولة مرة أخرى.");
        setPhase("error");
      }
    };
    fetchQuiz();
  }, [lesson]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSelectAnswer = (qIdx, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setPhase("result");
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setScore(0);
    setPhase("quiz");
  };

  const allAnswered = questions.length > 0 &&
    Object.keys(selectedAnswers).length === questions.length;

  const passed = score >= 60;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl text-slate-900 dark:text-white">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-sky-50/90 dark:bg-gradient-to-r dark:from-sky-600/80 dark:to-indigo-700/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 p-5 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">اختبار الدرس</h2>
            <p className="text-sky-600 dark:text-sky-200 text-sm mt-0.5 line-clamp-1">{lesson.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-white transition-all duration-300 ease-out"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="p-6">

          {/* ── LOADING ───────────────────────────────────────────── */}
          {phase === "loading" && (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sky-600 dark:text-sky-200 font-bold text-lg">جاري توليد الأسئلة بالذكاء الاصطناعي...</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">هذا قد يستغرق لحظة</p>
            </div>
          )}

          {/* ── ERROR ─────────────────────────────────────────────── */}
          {phase === "error" && (
            <div className="flex flex-col items-center justify-center py-16 gap-6 text-center">
              <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 dark:text-red-400 text-5xl" />
              <p className="text-red-600 dark:text-red-300 font-bold text-lg">{error}</p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-2xl font-bold transition-all duration-300 ease-out"
              >
                إغلاق
              </button>
            </div>
          )}

          {/* ── QUIZ ──────────────────────────────────────────────── */}
          {phase === "quiz" && (
            <div className="space-y-6">
              {fromCache && (
                <div className="text-center text-xs text-slate-400 dark:text-slate-500 mb-2">
                  ✓ أسئلة محفوظة مسبقاً
                </div>
              )}

              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5"
                >
                  <p className="font-bold text-slate-800 dark:text-white mb-4 leading-relaxed">
                    <span className="text-sky-600 dark:text-sky-400 ml-2">{idx + 1}.</span>
                    {q.question}
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((option, oIdx) => {
                      const isSelected = selectedAnswers[idx] === option;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectAnswer(idx, option)}
                          className={`w-full text-right px-4 py-3 rounded-xl border font-medium transition-all duration-200 shadow-sm ${
                            isSelected
                              ? "bg-sky-100 dark:bg-sky-500/30 border-sky-400 text-sky-800 dark:text-sky-100 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-white/30"
                          }`}
                        >
                          <span className="text-slate-400 dark:text-slate-500 ml-3">{["أ","ب","ج","د"][oIdx]}</span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-2">
                <button
                  disabled={!allAnswered}
                  onClick={handleSubmit}
                  className={`px-12 py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 ${
                    allAnswered
                      ? "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:-translate-y-1"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                  }`}
                >
                  تسليم الإجابات
                </button>
              </div>

              <p className="text-center text-slate-500 dark:text-slate-500 text-sm">
                أجبت على {Object.keys(selectedAnswers).length} من {questions.length} أسئلة
              </p>
            </div>
          )}

          {/* ── RESULT ────────────────────────────────────────────── */}
          {phase === "result" && (
            <div className="flex flex-col items-center text-center gap-6 py-8">
              {passed ? (
                <>
                  <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-500/20 border-4 border-green-500 dark:border-green-400 flex items-center justify-center shadow-[0_0_30px_rgba(74,222,128,0.4)]">
                    <FontAwesomeIcon icon={faTrophy} className="text-green-600 dark:text-green-400 text-4xl" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-green-600 dark:text-green-300">أحسنت! اجتزت الاختبار 🎉</h3>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-500/20 border-4 border-red-500 dark:border-red-400 flex items-center justify-center">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 dark:text-red-400 text-4xl" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-300">لم تجتز الاختبار</h3>
                </>
              )}

              {/* Score ring */}
              <div className={`relative w-32 h-32 flex items-center justify-center rounded-full border-8 ${passed ? "border-green-500 dark:border-green-400 shadow-[0_0_25px_rgba(74,222,128,0.3)]" : "border-red-500 dark:border-red-400 shadow-[0_0_25px_rgba(248,113,113,0.3)]"}`}>
                <span className="text-4xl font-black text-slate-800 dark:text-white">{score}%</span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-lg">
                {passed
                  ? "يمكنك الانتقال إلى الدرس التالي الآن"
                  : "تحتاج إلى 60% للنجاح. راجع الدرس وحاول مجدداً"}
              </p>

              <div className="flex gap-4 flex-wrap justify-center">
                {passed ? (
                  <button
                    onClick={() => onPass(score)}
                    className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-2xl font-extrabold text-lg shadow-lg hover-lift transition-all duration-300 ease-out"
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
                    الدرس التالي
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleRetry}
                      className="px-8 py-3 bg-sky-100 dark:bg-sky-500/20 hover:bg-sky-200 dark:hover:bg-sky-500/30 border border-sky-300 dark:border-sky-400/30 text-sky-700 dark:text-white rounded-2xl font-bold transition-all duration-300 ease-out"
                    >
                      <FontAwesomeIcon icon={faRedoAlt} className="ml-2" />
                      إعادة المحاولة
                    </button>
                    <button
                      onClick={onClose}
                      className="px-8 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-2xl font-bold transition-all duration-300 ease-out"
                    >
                      مراجعة الدرس
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
