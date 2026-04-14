import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const GlobalLoader = () => {
  // ------------------------------------------------------------------------
  // Local State & Dependencies
  // ------------------------------------------------------------------------
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const location = useLocation();

  // ------------------------------------------------------------------------
  // Action Handlers
  // ------------------------------------------------------------------------
  const hideLoader = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsFadingOut(false);
      document.body.style.overflow = "unset";
    }, 300);
  };

  const showLoader = () => {
    setIsVisible(true);
    setIsFadingOut(false);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      hideLoader();
    }, 500);
  };

  // ------------------------------------------------------------------------
  // Effects
  // ------------------------------------------------------------------------
  useEffect(() => {
    const handleLoad = () => showLoader();
    if (document.readyState === "complete") {
      showLoader();
    } else {
      window.addEventListener("load", handleLoad);
    }
    return () => {
      window.removeEventListener("load", handleLoad);
      document.body.style.overflow = "unset";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    showLoader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // ------------------------------------------------------------------------
  // Component Render
  // ------------------------------------------------------------------------
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full" />
          <div className="absolute inset-0 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-2 bg-sky-500/10 rounded-full animate-pulse" />
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">

          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-widest animate-pulse">
            جاري التحميل...
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
