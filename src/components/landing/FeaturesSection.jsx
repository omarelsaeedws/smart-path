import React from "react";

const features = [
  {
    title: "مسارات مدعومة بالذكاء الاصطناعي",
    desc: "تقوم خوارزمياتنا بتحليل متطلباتك لبناء مسار تعليمي مخصص بالكامل يناسب مستواك وأهدافك.",
    imageLight: "/AI.png",
    imageDark: "/Ai-dark.png",
  },
  {
    title: "خريطة طريق تفصيلية",
    desc: "تنظيم هرمي واضح (أسابيع ثم دروس) يمنع التشتت ويضمن تقدمك بخطوات متسلسلة ومنطقية.",
    imageLight: "/Roadmap.png",
    imageDark: "/Roadmap-dark.png",
  },
  {
    title: "نظام تقدم قائم على الاختبارات",
    desc: "لن تنتقل إلى الدرس التالي قبل التأكد من استيعابك الكامل عبر اختبارات ذكية ومخصصة.",
    imageLight: "/Quiz.png",
    imageDark: "/Quiz-dark.png",
  },
  {
    title: "ترشيحات للأدوات والمصادر",
    desc: "نوفر لك أفضل الأدوات والمصادر المجانية والمدفوعة التي تحتاجها لإتقان مجالك.",
    imageLight: "/Tools.png",
    imageDark: "/Tools-dark.png",
  },
  {
    title: "تطبيقات عملية ومشاريع",
    desc: "معرفة نظرية لا تكفي، نقدم لك أفكار مشاريع واقعية لتطبيق ما تعلمته وبناء معرض أعمالك (Portfolio).",
    imageLight: "/Projects.png",
    imageDark: "/Projects-dark.png",
  },
  {
    title: "لوحة تحكم تفاعلية للإنجاز",
    desc: "راقب معدل تقدمك اليومي والأسبوعي عبر إحصائيات بصرية تبقيك متحمساً وعلى المسار الصحيح.",
    imageLight: "/Dashboard.png",
    imageDark: "/Dashboard-dark.png",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative z-20">
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-16 px-4 animate-slide-up">
          <span className="text-sky-500 font-bold tracking-wider text-sm mb-4 uppercase inline-block">
            نظام متكامل
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight transition-colors duration-300">
            مميزات المنصة
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
            كل ما تحتاجه لبناء مهاراتك بشكل احترافي ومنهجي في مكان واحد.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((ft, i) => (
            <div
              key={i}
              className="group flex flex-col bg-white/80 dark:bg-slate-800/70 backdrop-blur-md rounded-3xl border border-white/80 dark:border-slate-700/50 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-[0.3rem] shadow-[0_4px_24px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgb(0,0,0,0.25)] hover:shadow-[0_20px_56px_rgb(14,165,233,0.14)] dark:hover:shadow-[0_20px_56px_rgb(14,165,233,0.1)] hover:border-sky-200/70 dark:hover:border-sky-700/50"
            >
              {/* ── Image Section ── */}
              <div className="relative w-full h-52 rounded-t-3xl overflow-hidden">

                {/* Light mode image */}
                <img
                  src={ft.imageLight}
                  alt={ft.title}
                  loading="lazy"
                  className="w-full h-full object-cover block dark:hidden transition-transform duration-500 "
                />
                {/* Dark mode image */}
                <img
                  src={ft.imageDark}
                  alt={ft.title}
                  loading="lazy"
                  className="w-full h-full object-cover hidden dark:block transition-transform duration-500 "
                />

                {/* Smooth gradient overlay at bottom for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>

              {/* ── Content Section ── */}
              <div className="flex flex-col items-center text-center p-6 gap-2 flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300 leading-snug">
                  {ft.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                  {ft.desc}
                </p>
              </div>

              {/* Bottom hover glow line */}
              <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 transition-all duration-500 ease-out rounded-b-3xl" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};