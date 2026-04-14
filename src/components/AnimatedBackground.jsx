import React from "react";
import PageBackground from "./PageBackground";

// Auth background — uses the "auth" variant of PageBackground
// for consistent SaaS-style geometric background across all auth pages.
const AnimatedBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <PageBackground variant="auth" />
      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center animate-fade-in">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
