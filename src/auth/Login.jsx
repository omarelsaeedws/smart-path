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
      } else if (userProfile.onboardingCompleted) {
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
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
      <img
        src="/logo-white.png"
        alt="SmartPath Logo"
        width="270"
        className="mb-5"
      />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-8 flex flex-col gap-4 animate-fade-in"
      >
        <div className="flex flex-col gap-2">
          <label className="text-white/90 font-medium">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            placeholder="أدخل بريدك الإلكتروني"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white/90 font-medium">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            placeholder="أدخل كلمة المرور"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoggingIn || loading}
          className={`w-full mt-4 text-white font-semibold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all backdrop-blur ${isLoggingIn || loading ? "bg-white/10 cursor-not-allowed text-white/50" : "bg-white/20 hover:bg-white/30 cursor-pointer"}`}
        >
          {isLoggingIn ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoggingIn || loading}
          className={`w-full mt-2 flex items-center justify-center gap-2 border border-white/30 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 ${isLoggingIn || loading ? "bg-white/5 cursor-not-allowed text-white/50" : "bg-white/10 hover:bg-white/20 cursor-pointer"}`}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt="Google"
            className={`w-5 h-5 ${isLoggingIn || loading ? "opacity-50" : ""}`}
          />
          تسجيل الدخول باستخدام جوجل
        </button>

        <div className="mt-2 text-center">
          <Link
            to="/forgot-password"
            className="text-white/80 hover:text-white  hover:brightness-110 text-sm font-medium transition-all"
          >
            هل نسيت كلمة المرور؟
          </Link>
        </div>

        {unverifiedUser && (
          <button
            type="button"
            onClick={handleResendVerification}
            className="w-full mt-2 bg-transparent border border-white/40 text-white font-medium py-2 px-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
          >
            إعادة إرسال رابط التحقق
          </button>
        )}

        <div className="mt-4 text-center">
          <Link
            to="/register"
            className="text-white/80 hover:text-white  hover:brightness-110 text-sm font-medium transition-all"
          >
            ليس لديك حساب؟ إنشاء حساب جديد
          </Link>
        </div>
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
