import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faRobot, 
  faLayerGroup, 
  faCheckCircle, 
  faWrench, 
  faBriefcase,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative z-20">
      <div className="container mx-auto px-6 max-w-6xl">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: faRobot, title: "مسارات مدعومة بالذكاء الاصطناعي", desc: "تقوم خوارزمياتنا بتحليل متطلباتك لبناء مسار تعليمي مخصص بالكامل يناسب مستواك وأهدافك." },
            { icon: faLayerGroup, title: "خريطة طريق تفصيلية", desc: "تنظيم هرمي واضح (أسابيع ثم دروس) يمنع التشتت ويضمن تقدمك بخطوات متسلسلة ومنطقية." },
            { icon: faCheckCircle, title: "نظام تقدم قائم على الاختبارات", desc: "لن تنتقل إلى الدرس التالي قبل التأكد من استيعابك الكامل عبر اختبارات ذكية ومخصصة." },
            { icon: faWrench, title: "ترشيحات للأدوات والمصادر", desc: "نوفر لك أفضل الأدوات والمقادر المجانية والمدفوعة التي تحتاجها لإتقان مجالك." },
            { icon: faBriefcase, title: "تطبيقات عمليه ومشاريع", desc: "معرفة نظرية لا تكفي، نقدم لك أفكار مشاريع واقعية لتطبيق ما تعلمته وبناء معرض أعمالك (Portfolio)." },
            { icon: faChartLine, title: "لوحة تحكم تفاعلية للإنجاز", desc: "راقب معدل تقدمك اليومي والأسبوعي عبر إحصائيات بصرية تبقيك متحمساً وعلى المسار الصحيح." },
          ].map((ft, i) => (
            <div
              key={i}
              className="group bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-8 border border-white dark:border-slate-700/50 hover:border-sky-100 dark:hover:border-sky-800/50 shadow-[0_4px_20px_rgb(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.2)] hover:shadow-[0_12px_40px_rgb(14,165,233,0.1)] transition-all duration-300 ease-out hover:-translate-y-[0.3rem] overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-sky-50 dark:from-sky-900/30 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-sky-500 dark:text-sky-400 text-2xl mb-6  transition-all duration-300 ease-out shadow-sm relative z-10">
                <FontAwesomeIcon icon={ft.icon} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 relative z-10 transition-colors duration-300">{ft.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm relative z-10 transition-colors duration-300">{ft.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};