import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { connectAuthEmulator } from "firebase/auth";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import AnimatedBackground from "../components/AnimatedBackground";
connectAuthEmulator(auth, "http://127.0.0.1:9099");

function Register() {
  const navigate = useNavigate();
  // ------------------------------------------------------------------------
  // Local State Management
  // ------------------------------------------------------------------------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);

  // ------------------------------------------------------------------------
  // Validation Functions
  // ------------------------------------------------------------------------

  const validateEmail = (emailVal) => {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailVal) {
      setEmailError("");
      setEmailValid(false);
      return false;
    }
    if (!pattern.test(emailVal)) {
      setEmailError("يجب ادخال بريد إلكتروني صالح مثل example@gmail.com");
      setEmailValid(false);
      return false;
    }
    setEmailError("");
    setEmailValid(true);
    return true;
  };

  // ------------------------------------------------------------------------
  // Authentication Methods
  // ------------------------------------------------------------------------

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      setPopup({
        isOpen: true,
        type: "success",
        message: `مرحبا ${user.displayName}`,
      });
    } catch (error) {
      setPopup({
        isOpen: true,
        type: "error",
        message: error.message,
      });
    }
  };


  const validatePassword = (passVal) => {
    if (!passVal) {
      setPasswordError("");
      setPasswordValid(false);
      return false;
    }
    if (passVal.length < 8) {
      setPasswordError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      setPasswordValid(false);
      return false;
    }
    const letterPattern = /[a-zA-Z].*[a-zA-Z]/; 
    if (!letterPattern.test(passVal)) {
      setPasswordError(
        "يجب أن تحتوي كلمة المرور على حرفين على الأقل (a-z، A-Z)",
      );
      setPasswordValid(false);
      return false;
    }
    setPasswordError("");
    setPasswordValid(true);
    return true;
  };

  // ------------------------------------------------------------------------
  // Input Change Handlers
  // ------------------------------------------------------------------------

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    validateEmail(val);
  };


  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    validatePassword(val);
  };


  const isFormValid = emailValid && passwordValid && name.trim() !== "";


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

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      console.log("User Created:", userCredential.user);


      await updateProfile(userCredential.user, {
        displayName: name,
      });

      await sendEmailVerification(userCredential.user);

      // Redirect immediately instead of showing a popup
      navigate("/verify-email");
    } catch (error) {
      console.error(error);

      let errorMessage = error.message;
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "هذا الحساب مستخدم";
      }

      setPopup({
        isOpen: true,
        type: "error",
        message: errorMessage,
      });
    }
  };

  // ------------------------------------------------------------------------
  // Component Render
  // ------------------------------------------------------------------------
  return (
    <AnimatedBackground>
      <header className="mb-8 flex flex-col items-center mt-8">
        <img
          src="/logo-white.png"
          alt="SmartPath Logo"
          className="w-70 object-contain"
        />
      </header>

      <section className="w-full max-w-md bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-8 mb-8 animate-fade-in">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-white/90 font-medium ml-1">
              الاسم
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
              placeholder="أدخل اسمك"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white/90 font-medium ml-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${emailError ? "border-red-500" : emailValid ? "border-green-500" : "border-white/30"} focus:outline-none focus:ring-2 ${emailError ? "focus:ring-red-500" : emailValid ? "focus:ring-green-500" : "focus:ring-white/40"} text-white placeholder-white/60 transition-all`}
              placeholder="أدخل بريدك الإلكتروني"
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {emailError}
              </p>
            )}
            {emailValid && (
              <p className="text-green-500 text-sm mt-1 font-medium">
                بريد إلكتروني صالح
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-white/90 font-medium ml-1"
            >
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border ${passwordError ? "border-red-500" : passwordValid ? "border-green-500" : "border-white/30"} focus:outline-none focus:ring-2 ${passwordError ? "focus:ring-red-500" : passwordValid ? "focus:ring-green-500" : "focus:ring-white/40"} text-white placeholder-white/60 transition-all`}
              placeholder="أدخل كلمة المرور"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1 font-medium">
                {passwordError}
              </p>
            )}
            {passwordValid && (
              <p className="text-green-500 text-sm mt-1 font-medium">
                كلمة المرور صالحة
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full mt-2 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform backdrop-blur ${isFormValid ? "bg-white/20 hover:bg-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:-translate-y-1 cursor-pointer" : "bg-white/5 text-white/50 cursor-not-allowed"}`}
          >
            إنشاء حساب
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:bg-white/20 transition-all duration-300 cursor-pointer"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google"
              className="w-5 h-5"
            />
            تسجيل الدخول باستخدام جوجل
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-white/80 hover:text-white  hover:brightness-110 text-sm font-medium transition-all"
          >
            هل لديك حساب بالفعل؟ تسجيل الدخول
          </a>
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
