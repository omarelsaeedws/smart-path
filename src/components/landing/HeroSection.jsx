import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
export const HeroSection = ({ scrollY }) => {
  const [typedText, setTypedText] = useState("");
  const fullText = "اصنع مسارك التعليمي بخطوات ذكية مدعومة بالذكاء الاصطناعي";
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []);
  return (
    <section className="container mx-auto px-6 pt-24 pb-32 min-h-[85vh] flex flex-col xl:flex-row items-center justify-center gap-16 xl:gap-24 relative">
      <div className="flex-1 text-center xl:text-right relative z-10 w-full max-w-3xl mx-auto xl:mx-0">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-sky-100 dark:border-sky-800/50 shadow-sm text-sky-600 dark:text-sky-400 font-bold text-sm mb-8 animate-fade-in group hover:border-sky-200 dark:hover:border-sky-700 transition-all duration-300 ease-out">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500 group-hover:bg-sky-400 transition-all duration-300 ease-out"></span>
          </span>
          مدعوم بالذكاء الاصطناعي
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white leading-[1.3] tracking-tighter min-h-[140px] md:min-h-[100px]">
          {typedText}
          <span className="animate-blink border-r-4 border-sky-400 ml-2"></span>
        </h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-xl mx-auto xl:mx-0 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          احصل على مسارات تعليمية منظمة، تتبع تقدمك، وافتح الدروس من خلال اختبارات ذكية. يقضي Smart Path على التشتت ويقدم لك رحلة مخصصة من التأسيس إلى التطبيقات الواقعية.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start animate-slide-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
          <Link
            to="/register"
            className="group overflow-hidden relative inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-sky-500 to-sky-400 text-white rounded-full font-bold shadow-[0_8px_20px_rgb(14,165,233,0.25)] hover:shadow-[0_15px_30px_rgb(14,165,233,0.4)] hover-lift transition-all duration-300 ease-out"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-all duration-300 ease-out"></div>
            ابدأ مسارك التعليمي
            <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
          </Link>
          
        </div>
      </div>
      <div
        className="flex-1 w-full max-w-3xl xl:max-w-none relative animate-fade-in mt-12 xl:mt-0"
        style={{ animationDelay: "0.6s", animationFillMode: "both", transform: `translateY(${scrollY * -0.05}px)` }}
      >
        {/* Subtle Blue Glow Behind Image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-sky-400/20 dark:bg-sky-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

        {/* Premium SaaS Glassmorphism Container */}
        <div className="relative w-full aspect-video md:aspect-[4/3] flex items-center justify-center bg-white/40 dark:bg-slate-800/40 backdrop-blur-2xl border border-white/60 dark:border-slate-700/60 rounded-3xl shadow-2xl shadow-sky-200/30 dark:shadow-sky-900/40 p-2 sm:p-4 md:p-6 z-10 animate-[float_6s_ease-in-out_infinite] group hover-lift transition-all duration-300 ease-out">
          {/* Inner Highlight for Glass Edge */}
          <div className="absolute inset-0 rounded-3xl border border-white/80 dark:border-white/10 pointer-events-none bg-gradient-to-br from-white/50 dark:from-white/5 to-transparent opacity-60"></div>
          
          <div className="relative w-full h-full overflow-hidden rounded-2xl md:rounded-[1.25rem]">
            {/* Light mode image */}
            <img
              src="/landing.png"
              alt="Smart Path Platform"
              className="w-full h-full object-cover drop-shadow-xl relative z-20 block dark:hidden transition-all duration-300 ease-out "
            />
            {/* Dark mode image */}
            <img
              src="/landing-dark.png"
              alt="Smart Path Platform"
              className="w-full h-full object-cover drop-shadow-xl relative z-20 hidden dark:block transition-all duration-300 ease-out "
            />
          </div>
        </div>
      </div>
    </section>
  );
};