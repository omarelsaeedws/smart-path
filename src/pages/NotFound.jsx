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
    <div className="min-h-screen rtl relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 px-4 py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-sky-300/30 blur-3xl filter transition-all duration-1000 ease-in-out"></div>
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-blue-400/20 blur-3xl filter transition-all duration-1000 ease-in-out delay-500"></div>
        <div className="absolute top-[20%] right-[10%] h-[30%] w-[30%] animate-pulse rounded-full bg-white/10 blur-3xl filter transition-all duration-1000 ease-in-out delay-1000"></div>
      </div>

      <div
        className={`relative z-10 w-full max-w-lg transform rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-xl backdrop-blur-xl transition-all duration-1000 ease-out sm:p-12 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 shadow-inner backdrop-blur-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
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

        <h1 className="mb-2 text-7xl font-bold tracking-tighter text-white drop-shadow-md sm:text-8xl">
          404
        </h1>
        
        <h2 className="mb-4 text-2xl font-semibold text-white/90 sm:text-3xl">
          الصفحة غير موجودة
        </h2>
        
        <p className="mb-8 text-base text-white/80 sm:text-lg">
          يبدو أنك وصلت إلى رابط غير صحيح أو تم حذف الصفحة التي تبحث عنها.
        </p>

        <button
          onClick={() => navigate("/")}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-white/20 px-8 py-3 font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-blue-500 active:scale-95"
        >
          <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}

export default NotFound;
