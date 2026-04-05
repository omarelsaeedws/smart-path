import React from "react";

// ------------------------------------------------------------------------
// Component Render
// ------------------------------------------------------------------------
const AnimatedBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600 bg-[length:400%_400%] animate-gradient overflow-hidden flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/20 rounded-full mix-blend-overlay filter blur-xl animate-float" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-white/10 rounded-full mix-blend-overlay filter blur-2xl animate-float-slow" />

      <div className="absolute top-[20%] right-[10%] w-32 h-32 bg-white/10 rotate-45 animate-float-delayed rounded-xl" />
      <div className="absolute bottom-[20%] left-[15%] w-24 h-24 bg-white/10 -rotate-12 animate-float rounded-lg" />

      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 C20,80 30,20 50,50 C70,80 80,20 100,50"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          className="animate-float-slow"
        />
        <path
          d="M0,60 C25,90 35,30 60,60 C80,90 90,30 100,60"
          fill="none"
          stroke="white"
          strokeWidth="0.3"
          className="animate-float-delayed"
        />
      </svg>

      {/* Floating small dots */}
      <div className="absolute top-[30%] left-[30%] w-2 h-2 bg-white/40 rounded-full animate-float" />
      <div className="absolute top-[60%] right-[30%] w-3 h-3 bg-white/30 rounded-full animate-float-delayed" />
      <div className="absolute bottom-[40%] left-[40%] w-2 h-2 bg-white/50 rounded-full animate-float-slow" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
