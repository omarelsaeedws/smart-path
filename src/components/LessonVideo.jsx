import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faXmark, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

// ── Helpers ───────────────────────────────────────────────────────────────────

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const thumbUrl = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;



const VideoModal = ({ videoId, title, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const modal = (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.85)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* All inline styles — no Tailwind class can create a stacking context here */}
      <div
        style={{
          position: "relative", width: "100%", maxWidth: "896px",
          borderRadius: "1rem", background: "#000",
          boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "10px", left: "10px", zIndex: 10,
            width: "36px", height: "36px", borderRadius: "50%",
            background: "rgba(255,255,255,0.25)", border: "none",
            color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
          }}
          aria-label="إغلاق الفيديو"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        {/* 16:9 ratio container */}
        <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: "1rem", overflow: "hidden" }}>
          <iframe
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

// ── LessonVideo ───────────────────────────────────────────────────────────────

const LessonVideo = ({ url, title }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const videoId   = getYouTubeId(url);
  const openModal  = useCallback(() => setModalOpen(true),  []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  if (!videoId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-sky-50 dark:bg-sky-500/20 hover:bg-sky-100 dark:hover:bg-sky-500/30 border border-sky-200 dark:border-sky-400/30 text-sky-600 dark:text-sky-300 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ease-out"
      >
        <FontAwesomeIcon icon={faExternalLinkAlt} />
        رابط المصدر التعليمي
      </a>
    );
  }

  return (
    <>
      {/* Thumbnail preview — iframe never rendered until click */}
      <button
        type="button"
        onClick={openModal}
        className="relative w-full group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        aria-label={`تشغيل فيديو: ${title}`}
      >
        <img
          src={thumbUrl(videoId)}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full aspect-video object-cover "
          onError={(e) => { e.target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`; }}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-500 shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
            <FontAwesomeIcon icon={faPlay} className="text-white text-2xl translate-x-0.5" />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 fill-red-500" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
          </svg>
          YouTube
        </div>
      </button>

      {modalOpen && <VideoModal videoId={videoId} title={title} onClose={closeModal} />}
    </>
  );
};

export default LessonVideo;
