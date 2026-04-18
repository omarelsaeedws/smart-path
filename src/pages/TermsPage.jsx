import React from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "١. قبول الشروط",
    body: "باستخدامك منصة SmartPath، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يُرجى عدم استخدام المنصة.",
  },
  {
    title: "٢. وصف الخدمة",
    body: "SmartPath منصة تعليمية ذكية تتيح لك بناء مسارات تعليمية مخصصة بمساعدة الذكاء الاصطناعي. نحتفظ بالحق في تعديل أو إيقاف أي جزء من الخدمة في أي وقت دون إشعار مسبق.",
  },
  {
    title: "٣. حساب المستخدم",
    body: "أنت مسؤول عن الحفاظ على سرية بيانات حسابك وكلمة مرورك. يجب إخطارنا فورًا عند الاشتباه في أي استخدام غير مصرح به لحسابك. SmartPath غير مسؤولة عن أي خسارة ناتجة عن إهمالك في حماية بيانات الدخول.",
  },
  {
    title: "٤. الملكية الفكرية",
    body: "جميع المحتويات على المنصة — من نصوص وصور وشعارات وخوارزميات — هي ملك حصري لـ SmartPath ومحمية بموجب قوانين الملكية الفكرية. لا يُسمح بنسخ أو توزيع أي محتوى دون إذن كتابي مسبق.",
  },
  {
    title: "٥. السلوك المقبول",
    body: "يُحظر استخدام المنصة لأي أغراض غير قانونية أو مضرة، بما يشمل: نشر محتوى مسيء، انتهاك خصوصية الآخرين، أو محاولة اختراق أنظمتنا. نحتفظ بالحق في تعليق أو إنهاء أي حساب يخالف هذه السياسة.",
  },
  {
    title: "٦. إخلاء المسؤولية",
    body: 'تُقدَّم الخدمة "كما هي" دون ضمانات صريحة أو ضمنية. SmartPath لا تضمن استمرارية الخدمة أو خلوها من الأخطاء، ولا تتحمل المسؤولية عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدامك للمنصة.',
  },
  {
    title: "٧. التعديلات على الشروط",
    body: "قد نقوم بتحديث هذه الشروط من وقت لآخر. سيُعلَن عن أي تغييرات جوهرية عبر المنصة أو البريد الإلكتروني. استمرارك في استخدام المنصة بعد التعديلات يُعدّ قبولًا منك لها.",
  },
  {
    title: "٨. التواصل",
    body: "لأي استفسارات تتعلق بهذه الشروط، يمكنك التواصل معنا عبر صفحة الدعم الرسمية على المنصة.",
  },
];

const TermsPage = () => {
  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans"
      dir="rtl"
    >
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-sky-100/40 dark:bg-sky-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] bg-indigo-100/30 dark:bg-indigo-900/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-3xl">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 font-semibold mb-10 transition-colors duration-200 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">→</span>
          العودة للرئيسية
        </Link>

        {/* Header */}
        <div className="mb-12">
          <span className="text-sky-500 font-bold tracking-wider text-sm uppercase inline-block mb-3">
            قانوني
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            الشروط والأحكام
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            آخر تحديث: أبريل ٢٠٢٦
          </p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-sky-500 to-indigo-400 rounded-full" />
        </div>

        {/* Intro */}
        <div className="bg-sky-50/80 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/40 rounded-2xl p-6 mb-10 text-sky-800 dark:text-sky-200 text-sm leading-relaxed">
          يُرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام منصة SmartPath. تحكم هذه الشروط علاقتك بنا وباستخدامك للمنصة.
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-7 border border-white dark:border-slate-700/50 shadow-sm"
            >
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                {section.title}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-400 dark:text-slate-500 text-xs mt-14">
          © {new Date().getFullYear()} SmartPath — جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
