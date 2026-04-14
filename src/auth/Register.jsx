import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import Popup from "../components/Popup";
import AnimatedBackground from "../components/AnimatedBackground";



function Register() {
  const navigate = useNavigate();
  // ------------------------------------------------------------------------
  // Local State Management
  // ------------------------------------------------------------------------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  const [popup, setPopup] = useState({ isOpen: false, type: "success", message: "" });

  // ------------------------------------------------------------------------
  // Validation Functions
  // ------------------------------------------------------------------------
  const validateEmail = (emailVal) => {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailVal) { setEmailError(""); setEmailValid(false); return false; }
    if (!pattern.test(emailVal)) {
      setEmailError("يجب ادخال بريد إلكتروني صالح مثل example@gmail.com");
      setEmailValid(false); return false;
    }
    setEmailError(""); setEmailValid(true); return true;
  };

  const validatePassword = (passVal) => {
    if (!passVal) { setPasswordError(""); setPasswordValid(false); return false; }
    if (passVal.length < 8) {
      setPasswordError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      setPasswordValid(false); return false;
    }
    const letterPattern = /[a-zA-Z].*[a-zA-Z]/;
    if (!letterPattern.test(passVal)) {
      setPasswordError("يجب أن تحتوي كلمة المرور على حرفين على الأقل (a-z، A-Z)");
      setPasswordValid(false); return false;
    }
    setPasswordError(""); setPasswordValid(true); return true;
  };

  const handleEmailChange = (e) => { const v = e.target.value; setEmail(v); validateEmail(v); };
  const handlePasswordChange = (e) => { const v = e.target.value; setPassword(v); validatePassword(v); };
  const isFormValid = emailValid && passwordValid && name.trim() !== "";

  // ------------------------------------------------------------------------
  // Authentication Methods
  // ------------------------------------------------------------------------
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setPopup({ isOpen: true, type: "success", message: `مرحبا ${result.user.displayName}` });
    } catch (error) {
      setPopup({ isOpen: true, type: "error", message: error.message });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await sendEmailVerification(userCredential.user);
      navigate("/verify-email");
    } catch (error) {
      console.error(error);
      let errorMessage = error.message;
      if (error.code === "auth/email-already-in-use") errorMessage = "هذا الحساب مستخدم";
      setPopup({ isOpen: true, type: "error", message: errorMessage });
    }
  };

  // ------------------------------------------------------------------------
  // Input border utility
  // ------------------------------------------------------------------------
  const inputBorder = (hasError, isValid) => {
    if (hasError) return "border-red-400 dark:border-red-500 focus:ring-red-500";
    if (isValid) return "border-green-400 dark:border-green-500 focus:ring-green-500";
    return "border-slate-200 dark:border-slate-700 focus:ring-sky-500";
  };

  // ------------------------------------------------------------------------
  // Component Render
  // ------------------------------------------------------------------------
  return (
    <AnimatedBackground>

      {/* Logo */}
      <img src="/logo.png" alt="SmartPath Logo" width="200" className="mb-6 block dark:hidden" />
      <img src="/logo-white.png" alt="SmartPath Logo" width="200" className="mb-6 hidden dark:block" />

      <section className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8 mb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-1">إنشاء حساب جديد</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center">انضم إلى Smart Path وابدأ رحلتك التعليمية.</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium text-sm">الاسم</label>
            <input
              type="text" id="name" name="name" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-300 ease-out"
              placeholder="أدخل اسمك" required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium text-sm">البريد الإلكتروني</label>
            <input
              type="email" id="email" name="email" value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${inputBorder(emailError, emailValid)}`}
              placeholder="أدخل بريدك الإلكتروني" required
            />
            {emailError && <p className="text-red-500 dark:text-red-400 text-xs mt-0.5">{emailError}</p>}
            {emailValid && <p className="text-green-600 dark:text-green-400 text-xs mt-0.5">بريد إلكتروني صالح ✓</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium text-sm">كلمة المرور</label>
            <input
              type="password" id="password" name="password" value={password}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${inputBorder(passwordError, passwordValid)}`}
              placeholder="أدخل كلمة المرور" required
            />
            {passwordError && <p className="text-red-500 dark:text-red-400 text-xs mt-0.5">{passwordError}</p>}
            {passwordValid && <p className="text-green-600 dark:text-green-400 text-xs mt-0.5">كلمة المرور صالحة ✓</p>}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full mt-1 font-semibold py-3 px-4 rounded-xl transition-all duration-300 ${
              isFormValid
                ? "bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/30 hover:-translate-y-0.5"
                : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
            }`}
          >
            إنشاء حساب
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 ease-out"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
            إنشاء حساب بـ Google
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 text-sm font-medium transition-all duration-300 ease-out"
          >
            هل لديك حساب بالفعل؟ تسجيل الدخول
          </Link>
        </div>
      </section>

      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        message={popup.message}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />
    </AnimatedBackground>
  );
}

export default Register;
