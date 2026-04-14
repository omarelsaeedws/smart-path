import React from "react";

/**
 * PageBackground — Reusable geometric SaaS background (Stripe / Linear style).
 * Renders subtle blobs, lines, and shapes behind page content.
 * Controlled via `variant` prop: "default" | "dashboard" | "learningPath" | "auth" | "admin"
 * All elements are pointer-events-none and z-0.
 */

// ── DotGrid must be OUTSIDE the component to avoid React "create component
//    during render" error and ensure correct Fast Refresh behaviour. ────────
const DotGrid = () => (
  <div className="absolute inset-0 bg-[radial-gradient(circle,#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(circle,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
);

const PageBackground = ({ variant = "default" }) => {
  if (variant === "dashboard") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <DotGrid />
        {/* Primary glow — top-left */}
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-sky-300/25 to-indigo-300/15 dark:from-sky-600/15 dark:to-indigo-600/10 blur-[120px] animate-pulse"
          style={{ animationDuration: "10s" }}
        />
        {/* Secondary glow — bottom-right */}
        <div
          className="absolute -bottom-32 -right-24 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-indigo-300/20 to-purple-300/10 dark:from-indigo-600/12 dark:to-purple-600/8 blur-[100px] animate-pulse"
          style={{ animationDuration: "14s", animationDelay: "3s" }}
        />
        {/* Thin accent line */}
        <div className="absolute top-[40%] left-0 w-full h-px bg-gradient-to-r from-transparent via-sky-300/30 dark:via-sky-600/20 to-transparent" />
        {/* Geometric rings */}
        <div className="absolute top-[10%] right-[5%] w-72 h-72 rounded-full border border-sky-200/40 dark:border-sky-700/20 opacity-70" />
        <div className="absolute bottom-[15%] left-[8%] w-48 h-48 rounded-full border border-indigo-200/40 dark:border-indigo-700/20 opacity-60" />
      </div>
    );
  }

  if (variant === "learningPath") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <DotGrid />
        <div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-sky-300/20 to-indigo-300/15 dark:from-sky-600/12 dark:to-indigo-600/8 blur-[100px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute -bottom-20 -right-16 w-[450px] h-[450px] rounded-full bg-gradient-to-bl from-indigo-300/15 to-purple-300/10 dark:from-indigo-600/10 dark:to-purple-600/6 blur-[120px] animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "2s" }}
        />
        {/* Diagonal lines */}
        <div className="absolute top-[30%] left-[-5%] w-[110%] h-px bg-gradient-to-r from-transparent via-sky-300/30 dark:via-sky-700/15 to-transparent rotate-[-2deg]" />
        <div className="absolute top-[60%] left-[-5%] w-[110%] h-px bg-gradient-to-r from-transparent via-indigo-300/20 dark:via-indigo-700/12 to-transparent rotate-[1deg]" />
        {/* Geometric shapes */}
        <div className="absolute top-[12%] right-[8%] w-32 h-32 rounded-2xl border border-sky-200/50 dark:border-sky-700/25 rotate-12" />
        <div className="absolute bottom-[12%] left-[8%] w-48 h-48 rounded-3xl border border-indigo-200/40 dark:border-indigo-700/20 -rotate-6" />
      </div>
    );
  }

  if (variant === "admin") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <DotGrid />
        <div
          className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-sky-300/20 to-cyan-300/10 dark:from-sky-700/12 dark:to-cyan-700/8 blur-[120px] animate-pulse"
          style={{ animationDuration: "12s" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-violet-300/15 to-indigo-300/10 dark:from-violet-700/10 dark:to-indigo-700/6 blur-[100px] animate-pulse"
          style={{ animationDuration: "16s", animationDelay: "4s" }}
        />
        <div className="absolute top-[20%] left-[5%] w-64 h-64 rounded-full border border-sky-200/35 dark:border-sky-700/18 opacity-60" />
        <div className="absolute bottom-[20%] right-[5%] w-40 h-40 rounded-2xl border border-violet-200/35 dark:border-violet-700/18 rotate-12 opacity-50" />
      </div>
    );
  }

  if (variant === "auth") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <DotGrid />
        <div
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-sky-300/25 dark:bg-sky-600/12 blur-[100px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute -bottom-20 -right-12 w-[30rem] h-[30rem] rounded-full bg-indigo-300/20 dark:bg-indigo-600/10 blur-[120px] animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "1s" }}
        />
        <div className="absolute top-[25%] right-[10%] w-32 h-32 rounded-2xl border border-sky-200/50 dark:border-sky-700/25 rotate-45 opacity-60" />
        <div className="absolute bottom-[25%] left-[8%] w-20 h-20 rounded-full border border-indigo-200/40 dark:border-indigo-700/22 opacity-50" />
        <div className="absolute top-[60%] right-[30%] w-px h-32 bg-gradient-to-b from-transparent via-sky-300/40 dark:via-sky-600/25 to-transparent" />
      </div>
    );
  }

  // ── default ─────────────────────────────────────────────────────────────
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <DotGrid />
      <div className="absolute -top-16 -left-16 w-96 h-96 rounded-full bg-sky-300/20 dark:bg-sky-600/10 blur-[100px]" />
      <div className="absolute -bottom-16 -right-12 w-[500px] h-[500px] rounded-full bg-indigo-300/15 dark:bg-indigo-600/8 blur-[120px]" />
      <div className="absolute top-[30%] right-[15%] w-40 h-40 rounded-full border border-slate-200/60 dark:border-slate-700/30 opacity-60" />
    </div>
  );
};

export default PageBackground;
