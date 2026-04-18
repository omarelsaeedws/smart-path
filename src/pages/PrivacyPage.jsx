import React from "react";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "١. المعلومات التي نجمعها",
    body: "نجمع المعلومات التي تزودنا بها مباشرةً عند التسجيل (مثل: الاسم، البريد الإلكتروني)، وبيانات الاستخدام تلقائيًا (مثل: الصفحات التي تزورها، مدة الجلسة، بيانات الجهاز والمتصفح).",
  },
  {
    title: "٢. كيف نستخدم معلوماتك",
    body: "نستخدم بياناتك لتقديم الخدمة وتحسينها، وتخصيص مسارك التعليمي عبر الذكاء الاصطناعي، وإرسال إشعارات وتحديثات تتعلق بحسابك، والرد على استفساراتك ودعمك تقنيًا.",
  },
  {
    title: "٣. مشاركة المعلومات",
    body: "لا نبيع بياناتك الشخصية لأي طرف ثالث. قد نشارك معلوماتك مع مزودي خدمات موثوقين (مثل Firebase) لتشغيل المنصة، وذلك وفق اتفاقيات خصوصية صارمة.",
  },
  {
    title: "٤. ملفات تعريف الارتباط (Cookies)",
    body: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتذكر تفضيلاتك (مثل الوضع الليلي). يمكنك تعطيلها من إعدادات متصفحك، لكن قد يؤثر ذلك على بعض وظائف المنصة.",
  },
  {
    title: "٥. أمان البيانات",
    body: "نطبق معايير أمان عالية لحماية بياناتك، بما يشمل التشفير وبروتوكولات HTTPS. رغم ذلك، لا يمكن ضمان أمان كامل لأي نظام عبر الإنترنت.",
  },
  {
    title: "٦. احتفاظ البيانات",
    body: "نحتفظ ببياناتك طالما حسابك نشط. يمكنك طلب حذف حسابك وبياناتك في أي وقت من خلال صفحة الإعدادات أو التواصل معنا مباشرةً.",
  },
  {
    title: "٧. حقوقك",
    body: "لديك الحق في الوصول إلى بياناتك، وطلب تصحيحها أو حذفها، والاعتراض على معالجتها. للممارسة هذه الحقوق، تواصل معنا عبر قنوات الدعم الرسمية.",
  },
  {
    title: "٨. خصوصية الأطفال",
    body: "خدماتنا غير موجهة للأطفال دون سن ١٣ عامًا. لا نجمع عمدًا بيانات من الأطفال. إذا اكتشفنا ذلك سنحذف هذه البيانات فورًا.",
  },
  {
    title: "٩. التغييرات على سياسة الخصوصية",
    body: "قد نُحدّث هذه السياسة من وقت لآخر. سنُخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار داخل المنصة. استمرارك في استخدام المنصة بعد التحديث يُعدّ قبولًا للسياسة الجديدة.",
  },
];

const PrivacyPage = () => {
  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans"
      dir="rtl"
    >
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-100/40 dark:bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35vw] h-[35vw] bg-sky-100/30 dark:bg-sky-900/15 rounded-full blur-[120px]" />
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
            سياسة الخصوصية
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            آخر تحديث: أبريل ٢٠٢٦
          </p>
          <div className="mt-4 h-1 w-16 bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full" />
        </div>

        {/* Intro */}
        <div className="bg-indigo-50/80 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/40 rounded-2xl p-6 mb-10 text-indigo-800 dark:text-indigo-200 text-sm leading-relaxed">
          خصوصيتك تهمنا. توضح هذه السياسة كيفية جمع SmartPath لمعلوماتك واستخدامها وحمايتها. نلتزم بالشفافية التامة في التعامل مع بياناتك.
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

export default PrivacyPage;
