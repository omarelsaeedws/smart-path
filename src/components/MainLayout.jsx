import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const MainLayout = ({ children, backgroundType = "default", hideSidebar = false }) => {
  // ------------------------------------------------------------------------
  // Local State
  // ------------------------------------------------------------------------
  const [isMobileOpen, setIsMobileOpen] = useState(false);

 
  // ------------------------------------------------------------------------
  // Render Helpers
  // ------------------------------------------------------------------------
  const renderBackground = () => {
    if (backgroundType === "learningPath") {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 rounded-full blur-[100px] animate-pulse"
            style={{ animationDuration: "8s" }}
          ></div>
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/20 to-purple-500/20 rounded-full blur-[120px] animate-pulse"
            style={{ animationDuration: "12s", animationDelay: "1s" }}
          ></div>

          <div
            className="absolute top-[20%] right-[30%] w-4 h-4 rounded-full bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-bounce"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-[30%] left-[20%] w-6 h-6 rounded-full bg-sky-400/20 shadow-[0_0_20px_rgba(56,189,248,0.8)] animate-bounce"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-[40%] left-[40%] w-3 h-3 rounded-full bg-indigo-400/20 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-bounce"
            style={{ animationDuration: "5s", animationDelay: "1.5s" }}
          ></div>

          <div className="absolute top-[10%] right-[10%] w-32 h-32 rounded-[2rem] border border-white/5 rotate-12 transition-transform duration-1000"></div>
          <div className="absolute bottom-[10%] left-[10%] w-48 h-48 rounded-[3rem] border border-white/5 -rotate-12 transition-transform duration-1000"></div>

          <div className="absolute top-[50%] right-[-10%] w-96 h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent -rotate-45"></div>
          <div className="absolute bottom-[20%] left-[-20%] w-[500px] h-1 bg-gradient-to-r from-transparent via-sky-400/10 to-transparent rotate-45"></div>
        </div>
      );
    }

    if (backgroundType === "dashboard") {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

          <div
            className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-sky-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"
            style={{ animationDuration: "10s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse"
            style={{ animationDuration: "14s", animationDelay: "2s" }}
          ></div>
        </div>
      );
    }

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-300/10 rounded-full blur-[120px]"></div>
      </div>
    );
  };

  // ------------------------------------------------------------------------
  // Component Render
  // ------------------------------------------------------------------------
  return (
    <div
      className="flex h-screen bg-[#0f172a] overflow-hidden text-white"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] z-0"></div>
      {renderBackground()}

      {!hideSidebar && <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />}

      <div className={`flex-1 flex flex-col h-full relative z-10 w-full ${!hideSidebar ? 'lg:w-[calc(100%-18rem)]' : ''}`}>
        {!hideSidebar && (
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-white/5 backdrop-blur-md z-20 sticky top-0">
            <div className="flex items-center gap-3">
              <img src="./logo.png" alt="logo" className="w-30" />
            </div>
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors"
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
