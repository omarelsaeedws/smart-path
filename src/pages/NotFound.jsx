import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  // ------------------------------------------------------------------------
  // Local State & Dependencies
  // ------------------------------------------------------------------------
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  // ------------------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // ------------------------------------------------------------------------
  // Component Render
  // ------------------------------------------------------------------------
  return (
    <div className="min-h-screen rtl relative flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 px-4 py-8">
      {/* Animated Background Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-sky-200/50 dark:bg-sky-600/20 blur-3xl filter transition-colors"></div>
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-indigo-200/40 dark:bg-indigo-600/20 blur-3xl filter delay-500 transition-colors"></div>
        <div className="absolute top-[20%] right-[10%] h-[30%] w-[30%] animate-pulse rounded-full bg-violet-200/40 dark:bg-violet-600/20 blur-3xl filter delay-1000 transition-colors"></div>
      </div>

      <div
        className={`relative z-10 w-full max-w-lg transform rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 p-8 text-center shadow-xl backdrop-blur-xl sm:p-12 transition-all duration-1000 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Warning Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 shadow-inner backdrop-blur-md border border-red-100 dark:border-red-500/20 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white drop-shadow-sm sm:text-8xl transition-colors">
          404
        </h1>

        <h2 className="mb-4 text-2xl font-bold text-slate-800 dark:text-slate-200 sm:text-3xl transition-colors">
          الصفحة غير موجودة
        </h2>

        <p className="mb-8 text-base text-slate-500 dark:text-slate-400 sm:text-lg transition-colors">
          يبدو أنك وصلت إلى رابط غير صحيح أو تم حذف الصفحة التي تبحث عنها.
        </p>

        <button
          onClick={() => navigate("/")}
          className="group relative inline-flex w-full sm:w-auto items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-8 py-3.5 font-bold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 hover-lift transition-all duration-300 ease-out"
        >
          <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-20 group-hover:-translate-x-40 transition-all duration-700 ease-in-out"></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}

export default NotFound;
