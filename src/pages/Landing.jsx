import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faRobot,
  faChartLine,
  faTrophy,
  faLightbulb,
  faShuffle,
  faBrain,
  faTasks,
  faChartColumn,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import {
  faXTwitter,
  faLinkedinIn,
  faFacebookF,
} from "@fortawesome/free-brands-svg-icons";

const Landing = () => {
  // ------------------------------------------------------------------------
  // Local State & Effects
  // ------------------------------------------------------------------------
  const [scrollY, setScrollY] = useState(0);
  const [typedText, setTypedText] = useState("");
  const fullText = "اصنع مستقبلك بخطوات ذكية";


  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ------------------------------------------------------------------------
  // Component Render
  // ------------------------------------------------------------------------
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-sky-500 to-blue-600 font-sans text-white overflow-x-hidden selection:bg-sky-300 selection:text-blue-900"
      dir="rtl"
    >
      {/* Dynamic Background  */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-200/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] animate-[pulse_6s_ease-in-out_infinite]"></div>

        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/30 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              transform: `translateY(${scrollY * (0.05 * Math.random())}px)`, // Parallax effect
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Navigation / Header */}
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center animate-fade-in-down">
          <img
            src="/logo-white.png"
            alt="SmartPath"
            className="h-20 object-contain drop-shadow-md"
          />
          <div className="hidden md:flex gap-6 items-center">
            <a
              href="#about"
              className="hover:text-sky-200 transition-colors font-medium"
            >
              عن المنصة
            </a>
            <a
              href="#how-it-works"
              className="hover:text-sky-200 transition-colors font-medium"
            >
              كيف تعمل
            </a>
            <a
              href="#features"
              className="hover:text-sky-200 transition-colors font-medium"
            >
              المميزات
            </a>
            <Link
              to="/login"
              className="px-6 py-2 rounded-full border border-white/30 hover:bg-white/10 transition-all font-medium backdrop-blur-sm"
            >
              تسجيل الدخول
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-20 pb-32 min-h-[90vh] flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="flex-1 text-center md:text-right relative">
            <div className="absolute top-1/2 left-1/2 md:left-auto md:right-1/4 -translate-x-1/2 md:translate-x-0 -translate-y-1/2 w-64 h-64 bg-sky-300/20 rounded-full blur-3xl animate-pulse -z-10"></div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg leading-tight min-h-[140px] md:min-h-[100px]">
              {typedText}
              <span className="animate-blink border-r-4 border-white ml-2"></span>
            </h1>

            <p
              className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed font-light animate-slide-up"
              style={{ animationDelay: "0.3s", animationFillMode: "both" }}
            >
              منصة ذكية تنشئ لك مسارًا تعليميًا مخصصًا بناءً على هدفك ومستواك.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-slide-up"
              style={{ animationDelay: "0.6s", animationFillMode: "both" }}
            >
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-2"
              >
                ابدأ الآن{" "}
                <FontAwesomeIcon
                  icon={faWandMagicSparkles}
                  className="text-amber-400"
                />
              </Link>
              <a
                href="#about"
                className="px-8 py-4 bg-white/10 border border-white/30 rounded-full font-bold text-lg backdrop-blur-md hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                استكشف المسارات
              </a>
            </div>
          </div>

          <div
            className="flex-1 w-full max-w-lg relative animate-fade-in"
            style={{
              animationDelay: "0.8s",
              animationFillMode: "both",
              transform: `translateY(${scrollY * -0.1}px)`,
            }}
          >
            {/* Abstract AI / Learning Illustration */}
            <div className="relative w-full aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-300/40 to-indigo-400/40 rounded-[3rem] rotate-6 backdrop-blur-xl border border-white/20 shadow-2xl animate-[float_6s_ease-in-out_infinite]"></div>
              <div className="absolute inset-0 bg-white/10 rounded-[3rem] -rotate-3 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center overflow-hidden animate-[float_7s_ease-in-out_infinite_reverse]">
                {/* Floating elements inside the glass */}
                <svg
                  className="w-32 h-32 text-white drop-shadow-md animate-[spin_20s_linear_infinite]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>

                <div
                  className="absolute top-1/4 right-1/4 w-12 h-12 bg-emerald-400 rounded-2xl rotate-12 shadow-lg flex items-center justify-center animate-bounce"
                  style={{ animationDuration: "3s" }}
                >
                  <span className="text-2xl">
                    <FontAwesomeIcon icon={faBullseye} />
                  </span>
                </div>

                <div
                  className="absolute bottom-1/4 left-1/4 w-14 h-14 bg-amber-400 rounded-full shadow-lg flex items-center justify-center animate-pulse"
                  style={{ animationDuration: "4s" }}
                >
                  <span className="text-2xl">
                    <FontAwesomeIcon icon={faLightbulb} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section divider waves could go here, for now simple padding */}
        <div className="w-full h-24 bg-gradient-to-b from-transparent to-black/5"></div>

        {/* About Section */}
        <section id="about" className="py-24 bg-black/5 relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-md">
                ما هي SmartPath؟
              </h2>
              <div className="w-24 h-1 bg-sky-300 mx-auto rounded-full mb-8"></div>
              <p className="text-xl text-white/90 leading-relaxed font-light">
                منصة تهدف لتسهيل رحلتك التعليمية. نقوم بتوليد مسارات تعليمية
                مخصصة، تحديد مستوى المستخدم بدقة، اقتراح كورسات مرتبة تدريجيًا
                لتناسب احتياجاتك، ومتابعة تقدمك نحو الاحتراف.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <FontAwesomeIcon icon={faBullseye} />,
                  title: "تحديد الهدف",
                  desc: "نوجهك لاختيار المسار التقني الأنسب لشغفك",
                },
                {
                  icon: <FontAwesomeIcon icon={faRobot} />,
                  title: "إنشاء المسار",
                  desc: "نبني خطتك الدراسية باستخدام الذكاء الاصطناعي",
                },
                {
                  icon: <FontAwesomeIcon icon={faChartLine} />,
                  title: "متابعة التقدم",
                  desc: "نراقب إنجازاتك خطوة بخطوة نحو هدفك",
                },
                {
                  icon: <FontAwesomeIcon icon={faTrophy} />,
                  title: "تحقيق الاحتراف",
                  desc: "نصل بك للجاهزية الكاملة لسوق العمل",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(14,165,233,0.3)] group"
                >
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300 border border-white/10">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-md">
                كيف تعمل المنصة؟
              </h2>
              <div className="w-24 h-1 bg-sky-300 mx-auto rounded-full"></div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 justify-center relative">
              {/* Connection line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-y-1/2 z-0"></div>

              {[
                {
                  step: "1",
                  title: "أنشئ حسابك",
                  desc: "سجل مجانًا وابدأ رحلتك التعليمية المنظمة في أقل من دقيقة",
                },
                {
                  step: "2",
                  title: "حدد هدفك ومستواك",
                  desc: "أخبرنا بمجالك المفضل وخبرتك الحالية لنفهم احتياجاتك",
                },
                {
                  step: "3",
                  title: "احصل على مسارك التعليمي",
                  desc: "سيبدأ الذكاء الاصطناعي بتوليد خطة دراسية متكاملة ومصممة لك",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 relative z-10 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white to-sky-100 text-sky-600 flex items-center justify-center text-3xl font-black shadow-[0_10px_30px_rgba(0,0,0,0.2)] mb-8 border-4 border-sky-400">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm border border-white/20 shadow-sm">
                    {item.title}
                  </h3>
                  <p className="text-white/80 max-w-[250px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-black/5">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-md">
                  أهم المميزات التي ستحصل عليها
                </h2>
                <div className="w-24 h-1 bg-sky-300 rounded-full mb-8"></div>
                <p className="text-xl text-white/80 mb-10 leading-relaxed font-light">
                  صممنا SmartPath لتكون الأداة والمرافق الذكي الذي تحتاجه
                  للانتقال من مرحلة التشتت إلى مرحلة التركيز والإنجاز الواضح.
                </p>
                <Link
                  to="/register"
                  className="inline-block px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl font-bold text-lg backdrop-blur-md transition-all duration-300"
                >
                  انضم إلينا الآن
                </Link>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: <FontAwesomeIcon icon={faShuffle} />,
                    title: "مسارات مخصصة",
                    delay: "0s",
                  },
                  {
                    icon: <FontAwesomeIcon icon={faBrain} />,
                    title: "ذكاء اصطناعي",
                    delay: "0.1s",
                  },
                  {
                    icon: <FontAwesomeIcon icon={faTasks} />,
                    title: "تنظيم مرحلي",
                    delay: "0.2s",
                  },
                  {
                    icon: <FontAwesomeIcon icon={faChartColumn} />,
                    title: "متابعة تقدم",
                    delay: "0.3s",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:bg-white/15 hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)] group"
                  >
                    <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">
                      {feature.icon}
                    </span>
                    <h4 className="text-lg font-bold">{feature.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 relative">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-400/20 to-transparent pointer-events-none z-0"></div>

          <div className="container mx-auto px-6 relative z-10 flex justify-center">
            <div className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-300/10 to-indigo-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 drop-shadow-lg relative z-10">
                ابدأ رحلتك اليوم
              </h2>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light relative z-10">
                لا تدع التشتت يؤخر نجاحك. انضم لآلاف المتعلمين المنظمين في منحة
                لتطورهم.
              </p>

              <Link
                to="/register"
                className="inline-block relative z-10 px-10 py-5 bg-white text-sky-600 rounded-2xl font-black text-xl shadow-[0_10px_30px_rgba(255,255,255,0.3)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                إنشاء حساب مجاني
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 pt-16 pb-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12 mb-8 text-center md:text-right">
              <div>
                <img
                  src="/logo-white.png"
                  alt="SmartPath"
                  className="h-12 object-contain hidden md:block mb-6 md:mx-0 mx-auto opacity-90"
                />
                <h3 className="text-2xl font-bold mb-4 md:hidden">SmartPath</h3>
                <p className="text-white/60 leading-relaxed font-light">
                  المنصة الذكية الأولى عربياً لتصميم وبناء المسارات التعليمية
                  المخصصة عبر أدوات الذكاء الاصطناعي.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">روابط سريعة</h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#about"
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      عن المنصة
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      كيف تعمل
                    </a>
                  </li>
                  <li>
                    <a
                      href="#features"
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      المميزات
                    </a>
                  </li>
                  <li>
                    <Link
                      to="/login"
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      تسجيل الدخول
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">تواصل معنا</h4>
                <div className="flex gap-4 justify-center md:justify-start">
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 hover:scale-110"
                  >
                    <span className="sr-only">Twitter</span>
                    <FontAwesomeIcon icon={faXTwitter} className="text-lg" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 hover:scale-110"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <FontAwesomeIcon icon={faLinkedinIn} className="text-lg" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 hover:scale-110"
                  >
                    <span className="sr-only">Facebook</span>
                    <FontAwesomeIcon icon={faFacebookF} className="text-lg" />
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center text-white/50 text-sm font-light">
              &copy; {new Date().getFullYear()} SmartPath. جميع الحقوق محفوظة.
            </div>
          </div>
        </footer>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes blink {
          0%, 100% { border-color: transparent; }
          50% { border-color: white; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blink { animation: blink 1s step-end infinite; }
        .animate-slide-up { animation: slide-up 1s ease-out; }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }
      `,
        }}
      />
    </div>
  );
};

export default Landing;
