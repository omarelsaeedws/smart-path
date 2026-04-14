import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PageBackground from "./PageBackground";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

// backgroundType: "default" | "dashboard" | "learningPath"
const MainLayout = ({ children, backgroundType = "default", hideSidebar = false }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div
      className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden text-slate-900 dark:text-white"
      dir="rtl"
    >
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 z-0" />

      {/* Geometric background shapes */}
      <PageBackground variant={backgroundType} />

      {!hideSidebar && (
        <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      )}

      <div className={`flex-1 flex flex-col h-full relative z-10 w-full ${!hideSidebar ? "lg:w-[calc(100%-18rem)]" : ""}`}>
        {/* Mobile top bar */}
        {!hideSidebar && (
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-20 sticky top-0 shadow-sm">
            <div className="flex items-center gap-3">
              <img src="./logo.png" alt="logo" className="w-28 block dark:hidden" />
              <img src="./logo-white.png" alt="logo" className="w-28 hidden dark:block" />
            </div>
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all duration-300 ease-out hover-lift"
            >
              <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
            </button>
          </div>
        )}

        <main className="flex-1 overflow-x-hidden overflow-y-auto no-scrollbar relative w-full scroll-smooth">
          <div className="w-full min-h-full animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
