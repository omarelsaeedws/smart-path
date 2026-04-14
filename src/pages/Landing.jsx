import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  faXTwitter,
  faLinkedinIn,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";

// Sub-components
import { HeroSection } from "../components/landing/HeroSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { ThemeToggle } from "../components/ThemeToggle";

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Parallax Scroll Tracking
  useEffect(() => {
    let rafId;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 overflow-x-hidden selection:bg-sky-200 selection:text-sky-900 relative"
      dir="rtl"
    >
      {/* GLOBAL BACKGROUND SYSTEM */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sky-100/40 dark:bg-sky-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] bg-sky-100/40 dark:bg-indigo-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[50vw] bg-sky-50/50 dark:bg-sky-950/30 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-[10%] right-[5%] w-[70vw] h-[70vw] border-[1px] border-sky-100/40 dark:border-sky-800/20 rounded-full opacity-60 blur-[1px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[60vw] h-[60vw] border-[1px] border-sky-200/20 dark:border-sky-700/10 rounded-full opacity-50 blur-[2px]"></div>
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/80 dark:border-slate-800/80 shadow-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center animate-fade-in-down">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="SmartPath Logo"
                className="h-20 object-contain drop-shadow-sm group- - hover-lift"
              />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              className="md:hidden text-slate-800 dark:text-white p-2 text-2xl focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
            </button>

            <div className="hidden md:flex gap-8 items-center">
              <nav className="flex gap-8">
                <a
                  href="#features"
                  className="text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400 font-medium transition-all duration-300 ease-out"
                >
                  المميزات
                </a>
              </nav>

              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

              <ThemeToggle className="scale-90" />

              <Link
                to="/login"
                className="text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 font-bold px-2 transition-all duration-300 ease-out"
              >
                دخول
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-sky-400 text-white rounded-full font-semibold shadow-[0_4px_14px_rgb(14,165,233,0.3)] hover:shadow-[0_6px_20px_rgb(14,165,233,0.4)hover-lift transition-all duration-300 ease-out"
              >
                ابدأ مجاناً
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-6 py-6 flex flex-col gap-4 animate-fade-in-down shadow-xl absolute w-full left-0 z-50">
              <nav className="flex flex-col gap-6 text-center items-center w-full">
                <a
                  href="#features"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-600 hover:text-sky-500 dark:text-slate-300 dark:hover:text-sky-400 font-bold transition-all duration-300 ease-out"
                >
                  المميزات
                </a>

                <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-1"></div>

                <div className="flex justify-center w-full">
                  <ThemeToggle className="scale-90" />
                </div>

                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-800 hover:text-sky-600 dark:text-white dark:hover:text-sky-400 font-bold transition-all duration-300 ease-out w-full"
                >
                  دخول
                </Link>

                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-400 text-white rounded-full font-semibold shadow-[0_4px_14px_rgb(14,165,233,0.3)] hover:shadow-[0_6px_20px_rgb(14,165,233,0.4)] transition-all duration-300 ease-out"
                >
                  ابدأ مجاناً
                </Link>
              </nav>
            </div>
          )}
        </header>

        {/* PAGE CONTENT */}
        <HeroSection scrollY={scrollY} />
        <FeaturesSection />

        {/* MINIMAL FOOTER */}
        <footer className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md pt-16 pb-8 relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-2">
                <Link to="/" className="flex items-center gap-2 mb-6 group">
                  <img
                    src="/logo.png"
                    alt="SmartPath Logo"
                    className="h-12 object-contain opacity-80 group-hover:opacity-100 block dark:hidden transition-all duration-300 ease-out"
                  />
                  <img
                    src="/logo-white.png"
                    alt="SmartPath Logo"
                    className="h-12 object-contain opacity-80 group-hover:opacity-100 hidden dark:block transition-all duration-300 ease-out"
                  />
                </Link>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-6 text-sm">
                  المنصة الذكية الأولى لتصميم وبناء المسارات التعليمية عبر
                  الذكاء الاصطناعي بهوية عصرية وفعالية عالية.
                </p>
                <div className="flex gap-3">
                  {["Twitter", "LinkedIn", "Facebook"].map((platform, i) => {
                    const icons = [faXTwitter, faLinkedinIn, faFacebookF];
                    return (
                      <a
                        key={i}
                        href="#"
                        className="w-10 h-10 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-full flex items-center justify-center hover:bg-sky-50 dark:hover:bg-slate-700 hover:text-sky-500 dark:hover:text-sky-400 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 ease-out"
                      >
                        <span className="sr-only">{platform}</span>
                        <FontAwesomeIcon icon={icons[i]} />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
                  نظرة سريعة
                </h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li>
                    <a
                      href="#features"
                      className="text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-300 ease-out"
                    >
                      المميزات والقدرات
                    </a>
                  </li>
                  <li>
                    <a
                      href="#preview"
                      className="text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-300 ease-out"
                    >
                      نظرة من الداخل
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-6">
                  المستخدمين
                </h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li>
                    <Link
                      to="/login"
                      className="text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-300 ease-out"
                    >
                      تسجيل الدخول
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-300 ease-out"
                    >
                      انضم إلينا
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-200/60 dark:border-slate-800/60 pt-8 text-center text-slate-400 dark:text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center font-medium">
              <p>
                &copy; {new Date().getFullYear()} SmartPath. جميع الحقوق محفوظة.
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a
                  href="#"
                  className="hover:text-slate-600 dark:hover:text-slate-400 transition-all duration-300 ease-out"
                >
                  الشروط والأحكام
                </a>
                <a
                  href="#"
                  className="hover:text-slate-600 dark:hover:text-slate-400 transition-all duration-300 ease-out"
                >
                  سياسة الخصوصية
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes blink {
          0%, 100% { border-color: transparent; }
          50% { border-color: #38bdf8; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-blink { animation: blink 1s step-end infinite; }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
      `,
        }}
      />
    </div>
  );
};

export default Landing;
