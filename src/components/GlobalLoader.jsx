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
    const handleLoad = () => {
      showLoader();
    };

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
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 flex flex-col items-center justify-center transition-opacity duration-300 ease-in-out ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="absolute w-10 h-10 bg-white/10 rounded-full animate-pulse"></div>
        </div>

        <div className="text-white text-xl font-medium tracking-widest animate-pulse mt-4 drop-shadow-md shadow-black">
          جاري التحميل...
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
