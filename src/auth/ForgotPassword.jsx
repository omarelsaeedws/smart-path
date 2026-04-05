import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import Popup from "../components/Popup";

function ForgotPassword() {
  // ------------------------------------------------------------------------
  // Local State Management
  // ------------------------------------------------------------------------
  const [email, setEmail] = useState("");
  const [popup, setPopup] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  // ------------------------------------------------------------------------
  // Form Submission
  // ------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setPopup({
        isOpen: true,
        type: "error",
        message: "من فضلك أدخل البريد الإلكتروني أولاً",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setPopup({
        isOpen: true,
        type: "success",
        message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك",
      });
    } catch (error) {
      setPopup({ isOpen: true, type: "error", message: error.message });
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
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          استعادة كلمة المرور
        </h2>
        <p className="text-white/80 text-sm text-center mb-4">
          أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
        </p>

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

        <button
          type="submit"
          className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all backdrop-blur cursor-pointer"
        >
          إرسال الرابط
        </button>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-white/80 hover:text-white  hover:brightness-110 text-sm font-medium transition-all"
          >
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      </form>

      <Popup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
        type={popup.type}
        message={popup.message}
      />
    </AnimatedBackground>
  );
}

export default ForgotPassword;
