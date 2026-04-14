import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import AnimatedBackground from "../components/AnimatedBackground";
import { ThemeToggle } from "../components/ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelopeOpenText,
  faCheckCircle,
  faExclamationCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

function VerifyEmail() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  const [toast, setToast] = useState({ isOpen: false, type: "success", message: "" });
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) navigate("/login");
      else if (currentUser.emailVerified) navigate("/dashboard");
    }
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const showToast = (type, message) => {
    setToast({ isOpen: true, type, message });
    setTimeout(() => setToast({ isOpen: false, type: "success", message: "" }), 4000);
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        showToast("success", "تم إعادة إرسال رابط التفعيل بنجاح!");
        setResendCooldown(60);
      }
    } catch (error) {
      console.error(error);
      if (error.code === "auth/too-many-requests") {
        showToast("error", "لقد قمت بطلب الكثير من الرسائل. يرجى المحاولة لاحقاً.");
      } else {
        showToast("error", "حدث خطأ أثناء إرسال الرابط. حاول مرة أخرى.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          showToast("success", "تم تفعيل الحساب بنجاح!");
          setTimeout(() => window.location.replace("/dashboard"), 1500);
        } else {
          showToast("error", "لم يتم تفعيل الحساب بعد. يرجى التحقق من بريدك الإلكتروني.");
        }
      }
    } catch (error) {
      console.error(error);
      showToast("error", "حدث خطأ أثناء التحقق من الحساب.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full" />
          <div className="absolute inset-0 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <AnimatedBackground>
      {/* Theme Toggle */}
      <div className="absolute top-4 left-4">
        <ThemeToggle />
      </div>

      {/* Toast */}
      {toast.isOpen && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-fade-in w-[90%] max-w-md">
          <div
            className={`flex items-center p-4 rounded-xl shadow-2xl border ${
              toast.type === "success"
                ? "bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200"
            }`}
          >
            <FontAwesomeIcon
              icon={toast.type === "success" ? faCheckCircle : faExclamationCircle}
              className="text-xl ml-3 shrink-0"
            />
            <p className="font-semibold text-sm">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Logo */}
      <img src="/logo.png" alt="SmartPath Logo" width="200" className="mb-6 block dark:hidden" />
      <img src="/logo-white.png" alt="SmartPath Logo" width="200" className="mb-6 hidden dark:block" />

      <section className="w-full max-w-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8 md:p-10 mb-8 text-center flex flex-col items-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-full flex items-center justify-center mb-6">
          <FontAwesomeIcon icon={faEnvelopeOpenText} className="text-4xl text-sky-500 dark:text-sky-400" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          تحقق من بريدك الإلكتروني
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mb-2">
          لقد أرسلنا رابط التفعيل إلى:
        </p>
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 py-2 px-6 rounded-lg mb-6 inline-block">
          <p className="text-slate-800 dark:text-white font-semibold tracking-wide" dir="ltr">
            {currentUser.email}
          </p>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed max-w-sm">
          برجاء الضغط على الرابط المرسل إلى بريدك الإلكتروني لتفعيل الحساب والبدء في رحلتك التعليمية معنا.
        </p>

        <div className="flex flex-col w-full gap-3">
          <button
            onClick={handleCheckVerification}
            disabled={isVerifying}
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-sky-500/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:-none hover-lift transition-all duration-300 ease-out"
          >
            {isVerifying ? (
              <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xl" />
            ) : (
              <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
            )}
            لقد قمت بالتفعيل
          </button>

          <button
            onClick={handleResendEmail}
            disabled={resendCooldown > 0 || isResending}
            className="w-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out"
          >
            {resendCooldown > 0
              ? `إعادة الإرسال بعد ${resendCooldown} ثانية`
              : isResending
              ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> جاري الإرسال...</>
              : "إعادة إرسال رابط التفعيل"}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 w-full text-center">
          <button
            onClick={() => auth.signOut()}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-sm transition-all duration-300 ease-out"
          >
            تسجيل الدخول بحساب مختلف
          </button>
        </div>
      </section>
    </AnimatedBackground>
  );
}

export default VerifyEmail;
