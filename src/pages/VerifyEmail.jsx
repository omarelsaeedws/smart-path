import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import AnimatedBackground from "../components/AnimatedBackground";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText, faCheckCircle, faExclamationCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";

function VerifyEmail() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  // Toast State
  const [toast, setToast] = useState({ isOpen: false, type: "success", message: "" });
  
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        navigate("/login");
      } else if (currentUser.emailVerified) {
        navigate("/dashboard");
      }
    }
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const showToast = (type, message) => {
    setToast({ isOpen: true, type, message });
    setTimeout(() => {
      setToast({ isOpen: false, type: "success", message: "" });
    }, 4000);
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
      if (error.code === 'auth/too-many-requests') {
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
        // Reload user data from Firebase
        await auth.currentUser.reload();
        
        if (auth.currentUser.emailVerified) {
          showToast("success", "تم تفعيل الحساب بنجاح!");
          setTimeout(() => {
            // Force a hard reload to update context properly and navigate to dashboard
            window.location.replace("/dashboard");
          }, 1500);
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
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <AnimatedBackground>
      {/* Toast Notification */}
      {toast.isOpen && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-down w-[90%] max-w-md`}>
          <div className={`flex items-center p-4 rounded-xl shadow-2xl backdrop-blur-md border ${
            toast.type === "success" 
              ? "bg-green-500/80 border-green-400 text-white" 
              : "bg-red-500/80 border-red-400 text-white"
          }`}>
            <FontAwesomeIcon 
              icon={toast.type === "success" ? faCheckCircle : faExclamationCircle} 
              className="text-2xl ml-3"
            />
            <p className="font-semibold text-sm md:text-base">{toast.message}</p>
          </div>
        </div>
      )}

      <header className="mb-8 flex flex-col items-center mt-8">
        <img
          src="/logo-white.png"
          alt="SmartPath Logo"
          className="w-70 object-contain drop-shadow-lg"
        />
      </header>

      <section className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] p-8 md:p-10 mb-8 animate-fade-in text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner border border-blue-400/30">
          <FontAwesomeIcon icon={faEnvelopeOpenText} className="text-4xl text-blue-100 drop-shadow-md" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4 drop-shadow-sm">تحقق من بريدك الإلكتروني</h1>
        
        <p className="text-white/80 text-lg mb-2">
          لقد أرسلنا رابط التفعيل إلى:
        </p>
        <div className="bg-black/20 py-2 px-6 rounded-lg border border-white/10 mb-6 inline-block">
          <p className="text-white font-semibold tracking-wide" dir="ltr">{currentUser.email}</p>
        </div>

        <p className="text-white/70 text-sm mb-8 leading-relaxed max-w-sm">
          برجاء الضغط على الرابط المرسل إلى بريدك الإلكتروني لتفعيل الحساب والبدء في رحلتك التعليمية معنا.
        </p>

        <div className="flex flex-col w-full gap-4">
          <button
            onClick={handleCheckVerification}
            disabled={isVerifying}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            {resendCooldown > 0 ? (
              `إعادة الإرسال بعد ${resendCooldown} ثانية`
            ) : isResending ? (
              <><FontAwesomeIcon icon={faSpinner} className="animate-spin" /> جاري الإرسال...</>
            ) : (
              "إعادة إرسال رابط التفعيل"
            )}
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 w-full text-center">
          <button 
            onClick={() => auth.signOut()}
            className="text-white/60 hover:text-white text-sm transition-colors border-b border-transparent hover:border-white pb-0.5"
          >
            تسجيل الدخول بحساب مختلف
          </button>
        </div>
      </section>
    </AnimatedBackground>
  );
}

export default VerifyEmail;
