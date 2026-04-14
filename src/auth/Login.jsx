import React, { useState } from "react";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendEmailVerification,
} from "firebase/auth";

import { auth } from "../lib/firebase";

import { useNavigate, Link } from "react-router-dom";

import Popup from "../components/Popup";
import AnimatedBackground from "../components/AnimatedBackground";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  // ------------------------------------------------------------------------
  // Local State Management
  // ------------------------------------------------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { userProfile, loading } = useAuth();

  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const [popupType, setPopupType] = useState("error");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const navigate = useNavigate();

  // ------------------------------------------------------------------------
  // Effects & Redirection
  // ------------------------------------------------------------------------
  React.useEffect(() => {
    if (!loading && userProfile) {
      if (userProfile.role === "admin") {
        navigate("/admin");
      } else if (userProfile.isOnboarded === true || userProfile.onboardingCompleted) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    }
  }, [userProfile, loading, navigate]);

  // ------------------------------------------------------------------------
  // Form Submission & Authentication
  // ------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowPopup(false);
    setIsLoggingIn(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        setUnverifiedUser(user);
        setError("يرجى تفعيل بريدك الإلكتروني أولاً.");
        setPopupType("error");
        setShowPopup(true);
        return;
      }
    } catch (err) {
      console.error(err);
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ------------------------------------------------------------------------
  // Additional Handlers
  // ------------------------------------------------------------------------
  const handleResendVerification = async () => {
    if (!unverifiedUser) return;
    try {
      await sendEmailVerification(unverifiedUser);
      setError("تم إعادة إرسال رابط التحقق إلى بريدك الإلكتروني بنجاح.");
      setPopupType("success");
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء إرسال رابط التحقق. يرجى المحاولة لاحقاً.");
      setPopupType("error");
      setShowPopup(true);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setShowPopup(false);
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      setError("تعذر تسجيل الدخول باستخدام جوجل");
      setPopupType("error");
      setShowPopup(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ------------------------------------------------------------------------
  // Component Render
  // ------------------------------------------------------------------------
  return (
    <AnimatedBackground>
      {/* Logo */}
      <img src="/logo.png" alt="SmartPath Logo" width="200" className="mb-6 block dark:hidden" />
      <img src="/logo-white.png" alt="SmartPath Logo" width="200" className="mb-6 hidden dark:block" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8 flex flex-col gap-5"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-1">
            تسجيل الدخول
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
            أهلاً بعودتك! سجّل دخولك إلى حسابك.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-700 dark:text-slate-300 font-medium text-sm">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 ease-out"
            placeholder="أدخل بريدك الإلكتروني"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-slate-700 dark:text-slate-300 font-medium text-sm">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 ease-out"
            placeholder="أدخل كلمة المرور"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoggingIn || loading}
          className={`w-full mt-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${
            isLoggingIn || loading
              ? "bg-sky-400/60 text-white/70 cursor-not-allowed"
              : "bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/30 hover:-translate-y-0.5"
          }`}
        >
          {isLoggingIn ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoggingIn || loading}
          className={`w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${
            isLoggingIn || loading
              ? "bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google"
            className={`w-5 h-5 ${isLoggingIn || loading ? "opacity-50" : ""}`}
          />
          تسجيل الدخول بـ Google
        </button>

        <div className="flex items-center justify-between text-sm mt-1">
          <Link
            to="/forgot-password"
            className="text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 font-medium transition-all duration-300 ease-out"
          >
            نسيت كلمة المرور؟
          </Link>
          <Link
            to="/register"
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-300 ease-out"
          >
            إنشاء حساب جديد
          </Link>
        </div>

        {unverifiedUser && (
          <button
            type="button"
            onClick={handleResendVerification}
            className="w-full mt-1 bg-transparent border border-amber-400 dark:border-amber-500 text-amber-600 dark:text-amber-400 font-medium py-2.5 px-4 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-300 ease-out"
          >
            إعادة إرسال رابط التحقق
          </button>
        )}
      </form>

      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        type={popupType}
        message={error}
      />
    </AnimatedBackground>
  );
}

export default Login;
