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
  const [popup, setPopup] = useState({ isOpen: false, type: "success", message: "" });

  // ------------------------------------------------------------------------
  // Form Submission
  // ------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setPopup({ isOpen: true, type: "error", message: "من فضلك أدخل البريد الإلكتروني أولاً" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setPopup({ isOpen: true, type: "success", message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك" });
    } catch (error) {
      setPopup({ isOpen: true, type: "error", message: error.message });
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
            استعادة كلمة المرور
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
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

        <button
          type="submit"
          className="w-full mt-1 bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-sky-500/30 hover-lift transition-all duration-300 ease-out"
        >
          إرسال الرابط
        </button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 text-sm font-medium transition-all duration-300 ease-out"
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
