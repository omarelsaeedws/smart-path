import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCrosshairs,
  faRobot,
  faChartLine,
  faGraduationCap,
  faWandMagicSparkles,
  faLayerGroup,
  faArrowLeft,
  faCheckCircle,
  faPlay,
  faClock,
  faBookOpen,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import {
  faXTwitter,
  faLinkedinIn,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";

// --- Reusable UI Systems --- //

const GlassCard = ({ children, className = "", hover = true }) => (
  <div
    className={`bg-white/50 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] ${
      hover ? "hover:shadow-[0_20px_40px_rgb(14,165,233,0.1)] hover:-translate-y-1 hover:border-sky-100 transition-all duration-500" : ""
    } ${className}`}
  >
    {children}
  </div>
);

const SectionHeading = ({ prefix, title, desc }) => (
  <div className="text-center mb-16 px-4 animate-slide-up">
    {prefix && (
      <span className="text-sky-500 font-bold tracking-wider text-sm mb-4 uppercase inline-block">
        {prefix}
      </span>
    )}
    <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
      {title}
    </h2>
    {desc && (
      <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
        {desc}
      </p>
    )}
  </div>
);

const PrimaryButton = ({ children, to, className = "" }) => (
  <Link
    to={to}
    className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-sky-500 to-sky-400 text-white rounded-full font-bold shadow-[0_8px_20px_rgb(14,165,233,0.25)] hover:shadow-[0_15px_30px_rgb(14,165,233,0.4)] transition-all duration-500 transform hover:-translate-y-0.5 ${className}`}
  >
    {children}
  </Link>
);

const SecondaryButton = ({ children, href, className = "" }) => (
  <a
    href={href}
    className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-full font-bold shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:shadow-md transition-all duration-500 transform hover:-translate-y-0.5 ${className}`}
  >
    {children}
  </a>
);

// --- Main Page Component --- //

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [typedText, setTypedText] = useState("");
  const fullText = "اصنع مستقبلك بخطوات ذكية";

  // Typing Effect
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);
    return () => clearInterval(typingInterval);
  }, []);

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
      className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden selection:bg-sky-200 selection:text-sky-900 relative"
      dir="rtl"
    >
      {/* 
        GLOBAL BACKGROUND SYSTEM
        A unified mesh gradient background that flows across the entire page,
        removing the need for individual section backgrounds and unifying the brand.
      */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft atmospheric glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sky-100/40 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] bg-[#e0f2fe]/40 rounded-full blur-[120px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[50vw] bg-sky-50/50 rounded-full blur-[150px] mix-blend-multiply"></div>
        {/* Abstract elegant lines */}
        <div className="absolute top-[10%] right-[5%] w-[70vw] h-[70vw] border-[1px] border-sky-100/40 rounded-full opacity-60 blur-[1px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[60vw] h-[60vw] border-[1px] border-sky-200/20 rounded-full opacity-50 blur-[2px]"></div>
      </div>

      <div className="relative z-10">
        {/* 
          HEADER
          Glassmorphism, proper alignment, right-to-left layout matching identity 
        */}
        <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/80 shadow-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center animate-fade-in-down">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="SmartPath Logo"
                className="h-20 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Navigation & CTA */}
            <div className="hidden md:flex gap-8 items-center">
              <nav className="flex gap-8">
                <a href="#how-it-works" className="text-slate-500 hover:text-sky-500 font-medium transition-colors">
                  كيف تعمل المنصة
                </a>
                <a href="#features" className="text-slate-500 hover:text-sky-500 font-medium transition-colors">
                  المميزات
                </a>
                <a href="#preview" className="text-slate-500 hover:text-sky-500 font-medium transition-colors">
                  نظرة عامة
                </a>
              </nav>
              
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              
              <Link to="/login" className="text-slate-600 hover:text-sky-600 font-bold transition-all px-2">
                دخول
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-sky-400 text-white rounded-full font-semibold shadow-[0_4px_14px_rgb(14,165,233,0.3)] hover:shadow-[0_6px_20px_rgb(14,165,233,0.4)] hover:-translate-y-0.5 transition-all duration-300"
              >
                ابدأ مجاناً
              </Link>
            </div>
          </div>
        </header>

        {/* --- HERO SECTION --- */}
        <section className="container mx-auto px-6 pt-24 pb-32 min-h-[85vh] flex flex-col xl:flex-row items-center justify-center gap-16 relative">
          <div className="flex-1 text-center xl:text-right relative z-10 w-full max-w-3xl mx-auto xl:mx-0">
            {/* AI Highlight Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-100 shadow-sm text-sky-600 font-bold text-sm mb-8 animate-fade-in group hover:border-sky-200 transition-colors">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500 group-hover:bg-sky-400 transition-colors"></span>
              </span>
              مدعوم بالذكاء الاصطناعي 
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 text-slate-900 leading-[1.2] tracking-tighter min-h-[140px] md:min-h-[100px]">
              {typedText}
              <span className="animate-blink border-r-4 border-sky-400 ml-2"></span>
            </h1>

            <p className="text-xl text-slate-500 mb-10 leading-relaxed max-w-xl mx-auto xl:mx-0 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
              حدد هدفك، ودع الذكاء الاصطناعي يرسم لك خريطة طريق تفاعلية تأخذك من البداية وحتى الإتقان بخطوات واضحة.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center xl:justify-start animate-slide-up" style={{ animationDelay: "0.4s", animationFillMode: "both" }}>
              <PrimaryButton to="/register" className="group overflow-hidden relative">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                أطلق مسارك الآن
                <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
              </PrimaryButton>
              <SecondaryButton href="#preview">
                <FontAwesomeIcon icon={faPlay} className="text-sky-500 text-sm" />
                شاهد كيف يعمل
              </SecondaryButton>
            </div>
          </div>

          <div
            className="flex-1 w-full max-w-2xl xl:max-w-none relative animate-fade-in"
            style={{ animationDelay: "0.6s", animationFillMode: "both", transform: `translateY(${scrollY * -0.05}px)` }}
          >
            {/* Visual Hero Mockup - Elegant Node Illustration */}
            <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center">
              <div className="absolute inset-4 bg-white/30 backdrop-blur-3xl border border-white/60 rounded-[3rem] shadow-xl skew-y-2 skew-x-2 opacity-70"></div>
              <div className="absolute inset-0 bg-white/70 backdrop-blur-2xl border border-white/80 shadow-2xl rounded-[2.5rem] flex items-center justify-center p-8 z-10 transition-transform duration-700 hover:scale-[1.01]">
                
                {/* Embedded Nodes System */}
                <div className="relative w-full h-full flex flex-col justify-between py-6 max-w-sm mx-auto">
                  <div className="absolute right-[45px] top-14 bottom-14 w-[3px] bg-gradient-to-b from-sky-400 via-sky-200 to-slate-200 rounded-full"></div>
                  
                  {/* Node 1 */}
                  <div className="relative z-10 flex gap-6 items-center">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-md border border-slate-100 flex-shrink-0 flex items-center justify-center hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faCrosshairs} className="text-sky-500 text-xl" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-sky-100 rounded-full mb-2"></div>
                      <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>

                  {/* Node 2 - Focus */}
                  <div className="relative z-10 flex gap-6 items-center -translate-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl shadow-[0_8px_25px_rgb(14,165,233,0.3)] flex-shrink-0 flex items-center justify-center relative">
                       <div className="absolute -inset-1 bg-sky-400/30 rounded-2xl blur-md animate-pulse"></div>
                       <FontAwesomeIcon icon={faWandMagicSparkles} className="text-white text-2xl relative z-10 animate-[float_3s_ease-in-out_infinite]" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-slate-200 rounded-full mb-2"></div>
                      <div className="h-3 w-40 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>

                  {/* Node 3 */}
                  <div className="relative z-10 flex gap-6 items-center">
                    <div className="w-20 h-20 bg-white/80 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                         <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 text-xl" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-28 bg-emerald-50 rounded-full mb-2"></div>
                      <div className="h-3 w-24 bg-slate-100 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Micro-interaction Add-ons */}
                <div className="absolute top-12 -left-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 animate-[float_4s_ease-in-out_infinite]">
                  <span className="text-xl">🚀</span>
                </div>
                <div className="absolute bottom-16 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-[float_5s_ease-in-out_infinite_reverse]">
                   <div className="flex gap-2 items-center">
                     <FontAwesomeIcon icon={faChartLine} className="text-sky-500" />
                     <span className="font-bold text-slate-700 text-sm">معدل التقدم 85%</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- PREVIEW SECTION --- */}
        <section id="preview" className="py-24 relative z-20">
          <div className="container mx-auto px-6 max-w-5xl">
            <SectionHeading 
              prefix="نظرة من الداخل" 
              title="خريطة تعليمية تفاعلية" 
              desc="لوحة تحكم (Dashboard) متكاملة تتابع تقدمك خطوة بخطوة من التأسيس وحتى الاحتراف."
            />

            <GlassCard className="p-8 md:p-12 border-white/80 mx-auto relative overflow-hidden" hover={false}>
              {/* Inner ambient glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-100/40 rounded-full blur-[80px] pointer-events-none"></div>

              <div className="flex flex-col gap-8 relative max-w-3xl mx-auto z-10">
                 {/* Connection Line - Glowing */}
                 <div className="hidden md:flex absolute right-[38px] top-10 bottom-10 w-1 bg-slate-100 rounded-full z-0 overflow-hidden shadow-inner">
                    <div className="absolute top-0 right-0 left-0 h-[55%] bg-gradient-to-b from-emerald-400 to-sky-400"></div>
                 </div>

                 {/* MODULE 1: COMPLETED */}
                 <div className="relative z-10 flex flex-col md:flex-row gap-6 group cursor-default">
                    {/* Node */}
                    <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-emerald-200 text-2xl text-emerald-500 shadow-sm relative transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_15px_rgb(16,185,129,0.15)] group-hover:border-emerald-300">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                    {/* Content Card */}
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl flex-1 shadow-sm border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                        <div>
                          <h4 className="font-bold text-xl text-slate-900 tracking-tight mb-1">أساسيات بناء الويب (Frontend)</h4>
                          <p className="text-sm text-slate-500">مفاهيم HTML5, CSS3 المتقدمة، وتصميم الواجهات المتجاوبة.</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 flex items-center gap-1.5 rounded-lg border border-emerald-200 shadow-[inset_0_1px_2px_rgb(255,255,255,0.5)]">
                          <FontAwesomeIcon icon={faCheckCircle} /> مكتمل
                        </span>
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                         <div className="flex items-center gap-1.5"><FontAwesomeIcon icon={faClock} className="text-slate-400" /> 12 ساعة</div>
                         <div className="flex items-center gap-1.5"><FontAwesomeIcon icon={faBookOpen} className="text-slate-400" /> 24 درس</div>
                         <div className="mr-auto w-full max-w-[120px] flex items-center gap-2">
                           <span className="font-bold text-emerald-600">100%</span>
                           <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                             <div className="bg-emerald-500 h-1.5 rounded-full w-full"></div>
                           </div>
                         </div>
                      </div>
                    </div>
                 </div>

                 {/* MODULE 2: IN PROGRESS (CURRENT) */}
                 <div className="relative z-10 flex flex-col md:flex-row gap-6 group cursor-default">
                    {/* Node with Glow */}
                    <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white shadow-[0_8px_20px_rgb(14,165,233,0.3)] relative transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_12px_25px_rgb(14,165,233,0.4)]">
                      <div className="absolute -inset-1 bg-sky-400/30 rounded-2xl blur-md animate-pulse"></div>
                      <span className="relative z-10">2</span>
                      <div className="hidden md:block absolute -right-[19px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full ring-[3px] ring-sky-500 shadow-sm animate-pulse z-20"></div>
                    </div>
                    {/* Content Card */}
                    <div className="bg-white p-6 rounded-2xl flex-1 shadow-lg shadow-sky-100/50 border-2 border-sky-100 md:scale-[1.02] transform transition-all duration-300 relative overflow-hidden">
                      {/* Card Deco */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-50 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>
                      
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-3 relative z-10">
                        <div>
                          <h4 className="font-bold text-xl text-sky-600 tracking-tight mb-1">الاحتراف بـ React.js</h4>
                          <p className="text-sm text-slate-500">بناء مكونات تفاعلية، إدارة الحالة بـ Redux، والتعامل مع APIs.</p>
                        </div>
                        <span className="text-xs font-bold text-sky-700 bg-white px-3 py-1.5 flex items-center gap-1.5 rounded-lg border border-sky-200 shadow-sm">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                          </span>
                          قيد التعلم
                        </span>
                      </div>
                      
                      {/* Meta Info & Progress */}
                      <div className="mt-5 pt-4 border-t border-sky-50 relative z-10">
                        <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                             <div className="flex items-center gap-1.5"><FontAwesomeIcon icon={faClock} className="text-sky-400" /> 18 ساعة</div>
                             <div className="flex items-center gap-1.5"><FontAwesomeIcon icon={faBookOpen} className="text-sky-400" /> 35 مقال</div>
                           </div>
                           <span className="font-bold text-sm text-sky-600">60%</span>
                        </div>
                        <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                            <div className="bg-gradient-to-l from-sky-400 to-sky-500 h-full rounded-full relative transition-all duration-1000 ease-out" style={{ width: '60%' }}>
                               <div className="absolute inset-0 bg-white/30 w-full animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* MODULE 3: LOCKED */}
                 <div className="relative z-10 flex flex-col md:flex-row gap-6 group cursor-default">
                    {/* Node Locked */}
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-slate-200 text-slate-400 text-xl shadow-[inset_0_2px_4px_rgb(0,0,0,0.02)] transition-all duration-300 group-hover:scale-[1.03] group-hover:border-slate-300">
                      <FontAwesomeIcon icon={faLock} />
                    </div>
                    {/* Content Card Locked */}
                    <div className="bg-white/40 p-6 rounded-2xl flex-1 border border-slate-200 border-dashed opacity-80 hover:opacity-100 hover:bg-white/70 transition-all duration-300">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                        <div>
                          <h4 className="font-bold text-xl text-slate-400 tracking-tight mb-1">أطر العمل المتقدمة Next.js</h4>
                          <p className="text-sm text-slate-400">التصيير على الخادم (SSR)، تحسين الأداء، والـ SEO المتقدم.</p>
                        </div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 flex items-center gap-1.5 rounded-lg border border-slate-200">
                          <FontAwesomeIcon icon={faLock} className="text-slate-400" /> مقفل
                        </span>
                      </div>
                      
                      {/* Meta Info Locked */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100/50 text-xs text-slate-400 font-medium">
                         <div className="flex items-center gap-1.5"><FontAwesomeIcon icon={faClock} /> 10 ساعات</div>
                         <div className="flex items-center gap-1.5"><FontAwesomeIcon icon={faBookOpen} /> 18 درس</div>
                         <div className="mr-auto flex items-center gap-2 text-slate-300">
                           <span className="font-medium text-xs">0%</span>
                           <div className="w-16 bg-slate-100 rounded-full h-1.5"></div>
                         </div>
                      </div>
                    </div>
                 </div>
              </div>
            </GlassCard>
            
            {/* Design Variation Note (Invisible to UI, requested in prompt)
              v1 (Implemented here): Visual Dashboard Approach - uses distinct visual states (cards, gradients, robust UI).
              v2 (Alternative Idea): Minimal Clean Approach - remove cards entirely, just text and floating badges beside a strict 1px timeline line.
            */}
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-6">
             <SectionHeading title="آلية عمل المنصة" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
              <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent z-0"></div>
              
              {[
                { step: "01", title: "حدد اهتماماتك", desc: "اختر المجال الذي تود تعلمه وأخبرنا عن مستوى خبرتك الحالية لنهيئ النظام خصيصاً لك.", icon: faCrosshairs },
                { step: "02", title: "توليد المسار بالـ AI", desc: "يقوم الذكاء الاصطناعي ببناء خطة دراسية متسلسلة تضم أفضل المصادر والمقالات المرتبة تصاعدياً.", icon: faRobot },
                { step: "03", title: "تعلم وتتبع تقدمك", desc: "ابدأ التعلم خطوة بخطوة، تتبع إنجازاتك في كل مرحلة، وراقب مؤشرات أدائك من لوحة التحكم.", icon: faChartLine },
              ].map((item, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-3xl text-sky-500 mb-6 group-hover:scale-110 group-hover:shadow-[0_10px_30px_rgb(14,165,233,0.15)] group-hover:border-sky-200 transition-all duration-500 relative overflow-hidden">
                    <span className="absolute inset-0 flex items-center justify-center z-10"><FontAwesomeIcon icon={item.icon} /></span>
                    <div className="absolute text-5xl font-extrabold text-slate-50 opacity-50 -bottom-2 -right-2 select-none group-hover:text-sky-50 transition-colors">{item.step}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm max-w-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-6 max-w-6xl">
            <SectionHeading 
               prefix="قدرات ذكية" 
               title="كل ما تحتاجه للنجاح" 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: faLayerGroup, title: "خريطة تعليمية متكاملة", desc: "مسارات منظمة على شكل عقد (Nodes) مترابطة تضمن الفهم التدريجي للمفاهيم دون تشتت." },
                { icon: faRobot, title: "مساعد ذكي", desc: "تقنيات ذكاء اصطناعي تحلل متطلباتك وتولد خطة مخصصة تلائم سرعة استيعابك ووقتك المتاح." },
                { icon: faChartLine, title: "تحليلات الأداء", desc: "لوحة تحكم شاملة توضح نسبة إنجازك في كل مسار والمقالات المتبقية لتصل لهدفك." },
                { icon: faGraduationCap, title: "مصادر تعليمية موثوقة", desc: "نربط مسارك بأفضل المصادر والمقالات والكورسات المتاحة على الإنترنت لضمان الجودة." },
                { icon: faCheckCircle, title: "تقييم ذاتي", desc: "أنظمة تتبع عند الانتهاء من كل خطوة لتأكيد استيعابك قبل الانتقال للمستوى التالي." },
                { icon: faWandMagicSparkles, title: "واجهة عصرية وبديهية", desc: "تصميم خالي من التعقيد يتيح لك التركيز فقط على المحتوى العلمي والتطور المعرفي." },
              ].map((ft, i) => (
                <div
                  key={i}
                  className="group bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white hover:border-sky-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgb(14,165,233,0.08)] transition-all duration-500 hover:-translate-y-1 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-sky-500 text-2xl mb-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-sky-400 group-hover:to-sky-500 group-hover:text-white group-hover:border-transparent transition-all duration-500 shadow-sm relative z-10">
                    <FontAwesomeIcon icon={ft.icon} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{ft.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm relative z-10">{ft.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- PREMIUM CTA SECTION --- */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-5xl relative z-10">
             {/* Unified Glass CTA - Eliminates the harsh solid blue block */}
             <div className="relative bg-white/40 backdrop-blur-xl border border-white rounded-[3rem] p-12 md:p-20 text-center shadow-[0_10px_50px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgb(14,165,233,0.1)] transition-shadow duration-700 overflow-hidden isolate">
                {/* Subtle embedded glow inside the CTA card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-r from-sky-200/50 to-blue-200/50 rounded-full blur-[80px] -z-10"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDlhNWU5IiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-50 -z-10"></div>

               <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
                 جاهز لبناء مستقبلك؟
               </h2>
               <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                 انضم الآن لآلاف المتعلمين الذين يستخدمون الذكاء الاصطناعي لاختصار وقت التعلم ومضاعفة الإنتاجية.
               </p>

               <PrimaryButton to="/register" className="px-10 py-4 text-lg">
                 أنشئ حساب مجاني
               </PrimaryButton>
             </div>
          </div>
        </section>

        {/* --- MINIMAL FOOTER --- */}
        <footer className="border-t border-slate-200/60 bg-white/30 backdrop-blur-md pt-16 pb-8 relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-2">
                 <Link to="/" className="flex items-center gap-2 mb-6 group">
                  <img src="/logo.png" alt="SmartPath Logo" className="h-12 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                  
                </Link>
                <p className="text-slate-500 leading-relaxed max-w-sm mb-6 text-sm">
                  المنصة الذكية الأولى لتصميم وبناء المسارات التعليمية عبر الذكاء الاصطناعي بهوية عصرية وفعالية عالية.
                </p>
                <div className="flex gap-3">
                  {["Twitter", "LinkedIn", "Facebook"].map((platform, i) => {
                    const icons = [faXTwitter, faLinkedinIn, faFacebookF];
                    return (
                      <a
                        key={i}
                        href="#"
                        className="w-10 h-10 bg-white text-slate-400 rounded-full flex items-center justify-center hover:bg-sky-50 hover:text-sky-500 transition-all border border-slate-100 shadow-sm"
                      >
                        <span className="sr-only">{platform}</span>
                        <FontAwesomeIcon icon={icons[i]} />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-6">نظرة سريعة</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><a href="#how-it-works" className="text-slate-500 hover:text-sky-500 transition-colors">آلية العمل</a></li>
                  <li><a href="#features" className="text-slate-500 hover:text-sky-500 transition-colors">المميزات والقدرات</a></li>
                  <li><a href="#preview" className="text-slate-500 hover:text-sky-500 transition-colors">نظرة من الداخل</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-6">المستخدمين</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><Link to="/login" className="text-slate-500 hover:text-sky-500 transition-colors">تسجيل الدخول</Link></li>
                  <li><Link to="/register" className="text-slate-500 hover:text-sky-500 transition-colors">انضم إلينا</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-200/60 pt-8 text-center text-slate-400 text-sm flex flex-col md:flex-row justify-between items-center font-medium">
              <p>&copy; {new Date().getFullYear()} SmartPath. جميع الحقوق محفوظة.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                 <a href="#" className="hover:text-slate-600 transition-colors">الشروط والأحكام</a>
                 <a href="#" className="hover:text-slate-600 transition-colors">سياسة الخصوصية</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes blink {
          0%, 100% { border-color: transparent; }
          50% { border-color: #38bdf8; } /* sky-400 */
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
      `}} />
    </div>
  );
};

export default Landing;
