import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { subscribeToCategories } from "../services/categoryService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faClock,
  faChevronRight,
  faCheckCircle,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

// Cycling gradient palette for category tiles
const TILE_GRADIENTS = [
  "from-sky-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-pink-600",
  "from-lime-500 to-green-600",
];

const LEVELS = [
  { value: "مبتدئ", label: "مبتدئ", desc: "لا خبرة سابقة" },
  { value: "متوسط", label: "متوسط", desc: "خبرة أساسية" },
  { value: "متقدم", label: "متقدم", desc: "خبرة جيدة" },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { currentUser, refreshUserProfile } = useAuth();

  const [step, setStep] = useState(1); // 1=level, 2=hours, 3=interests
  const [level, setLevel] = useState("");
  const [dailyStudyHours, setDailyStudyHours] = useState(2);
  const [interests, setInterests] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToCategories((data) => {
      setCategories(data);
      setCatsLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (interests.length === 0) {
      setError("الرجاء اختيار اهتمام واحد على الأقل.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        { level, dailyStudyHours, interests, isOnboarded: true, onboardingCompleted: true, updatedAt: serverTimestamp() },
        { merge: true }
      );
      await refreshUserProfile();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Onboarding save error:", err);
      setError("حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return level !== "";
    if (step === 2) return dailyStudyHours >= 1;
    return interests.length > 0;
  };

  const steps = ["مستواك", "وقتك", "اهتماماتك"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4" dir="rtl">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-sky-300/20 dark:bg-sky-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-400 to-indigo-500 shadow-xl shadow-sky-500/30 mb-6 rotate-6">
            <FontAwesomeIcon icon={faGraduationCap} className="text-white text-3xl -rotate-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">مرحباً بك في SmartPath</h1>
          <p className="text-slate-500 dark:text-slate-400">أخبرنا عنك لنخصص تجربتك</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > i + 1
                    ? "bg-green-500 text-white"
                    : step === i + 1
                    ? "bg-sky-500 text-white shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-medium ${step === i + 1 ? "text-sky-600 dark:text-sky-400" : "text-slate-400 dark:text-slate-500"}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mb-5 transition-all ${step > i + 1 ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-xl">

          {/* STEP 1: Level */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faGraduationCap} className="text-sky-500 dark:text-sky-400" />
                ما مستواك التقني الحالي؟
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">سنختار لك مسارات مناسبة بناءً على مستواك</p>
              <div className="space-y-3">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={`w-full text-right p-4 rounded-2xl border transition-all duration-200 ${
                      level === l.value
                        ? "bg-sky-50 dark:bg-sky-500/20 border-sky-400 dark:border-sky-500 shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                        : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600"
                    }`}
                  >
                    <p className="font-bold text-slate-900 dark:text-white">{l.label}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{l.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Daily Hours */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="text-sky-500 dark:text-sky-400" />
                كم ساعة يمكنك الدراسة يومياً؟
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">هذا يساعدنا في تقدير المدة الزمنية لكل مسار</p>
              <div className="text-center">
                <div className="text-7xl font-black text-slate-900 dark:text-white mb-2 tabular-nums">{dailyStudyHours}</div>
                <p className="text-sky-600 dark:text-sky-400 font-bold mb-8">ساعة / يوم</p>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={dailyStudyHours}
                  onChange={(e) => setDailyStudyHours(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between text-slate-400 dark:text-slate-500 text-xs mt-2">
                  <span>1 ساعة</span>
                  <span>12 ساعة</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Interests */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faLayerGroup} className="text-sky-500 dark:text-sky-400" />
                ما الذي يثير اهتمامك؟
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">اختر اهتماماً واحداً أو أكثر من المجالات المتاحة</p>

              {catsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full" />
                    <div className="absolute inset-0 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-slate-300 dark:text-slate-600 text-4xl mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">لا توجد فئات متاحة بعد. تواصل مع المدير.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat, idx) => {
                    const selected = interests.includes(cat.id);
                    const gradient = TILE_GRADIENTS[idx % TILE_GRADIENTS.length];
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleInterest(cat.id)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border text-right transition-all duration-200 ${
                          selected
                            ? "bg-sky-50 dark:bg-sky-500/20 border-sky-400 dark:border-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.15)]"
                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${selected ? "from-sky-400 to-indigo-600" : gradient} opacity-${selected ? "100" : "80"}`}>
                          <span className="text-white font-black text-sm">
                            {cat.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-slate-800 dark:text-white font-medium text-sm line-clamp-1">{cat.name}</span>
                        </div>
                        {selected && (
                          <FontAwesomeIcon icon={faCheckCircle} className="text-sky-500 dark:text-sky-400 text-sm flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {interests.length > 0 && (
                <p className="text-sky-600 dark:text-sky-400 text-xs text-center mt-3 font-medium">
                  ✓ تم اختيار {interests.length} {interests.length === 1 ? "اهتمام" : "اهتمامات"}
                </p>
              )}
              {error && <p className="text-red-500 dark:text-red-400 text-sm mt-3 text-center">{error}</p>}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => { setStep((s) => s - 1); setError(""); }}
                className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold rounded-2xl transition-all duration-300 ease-out"
              >
                رجوع
              </button>
            )}
            {step < 3 ? (
              <button
                disabled={!canProceed()}
                onClick={() => setStep((s) => s + 1)}
                className={`flex-1 py-3 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                  canProceed()
                    ? "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg hover:-translate-y-0.5"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
              >
                التالي
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            ) : (
              <button
                disabled={saving || interests.length === 0 || catsLoading}
                onClick={handleSubmit}
                className={`flex-1 py-3 font-bold rounded-2xl transition-all ${
                  saving || interests.length === 0 || catsLoading
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {saving ? "جاري الحفظ..." : "ابدأ رحلتك 🚀"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
