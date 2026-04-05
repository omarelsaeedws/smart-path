import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db, auth } from "../lib/firebase";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import {
  sendPasswordResetEmail,
  deleteUser,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faChartLine,
  faClock,
  faSave,
  faKey,
  faTrashAlt,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 left-6 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl z-50 animate-[slide-up_0.3s_ease-out_forwards] backdrop-blur-md border ${
        type === "success"
          ? "bg-green-500/20 border-green-500/30 text-green-100"
          : "bg-red-500/20 border-red-500/30 text-red-100"
      }`}
    >
      <FontAwesomeIcon
        icon={type === "success" ? faCheckCircle : faTimesCircle}
        className="text-xl"
      />
      <span className="font-semibold">{message}</span>
    </div>
  );
};


const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const Settings = () => {
  // ------------------------------------------------------------------------
  // Local State & Dependencies
  // ------------------------------------------------------------------------
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  // Profile Data State
  const [profileData, setProfileData] = useState({
    name: "",
    level: "مبتدئ",
    dailyHours: 2,
  });

  // UI State
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // ------------------------------------------------------------------------
  // Data Fetching & Effects
  // ------------------------------------------------------------------------
  // Fetch initial data
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.displayName || currentUser?.displayName || "",
        level: userProfile.level || "مبتدئ",
        dailyHours: userProfile.dailyHours || 2,
      });
      setLoadingInitial(false);
    } else if (currentUser) {
      setProfileData((prev) => ({
        ...prev,
        name: currentUser.displayName || "",
      }));
      setLoadingInitial(false);
    }
  }, [currentUser, userProfile]);

  // ------------------------------------------------------------------------
  // Action Handlers
  // ------------------------------------------------------------------------
  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: name === "dailyHours" ? parseInt(value) || 1 : value,
    }));
  };

  // Handle Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSaving(true);

    try {
      // 1. Update Firebase Auth Profile
      if (currentUser.displayName !== profileData.name) {
        await updateProfile(currentUser, {
          displayName: profileData.name,
        });
      }

      // 2. Update Firestore Document
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        displayName: profileData.name,
        level: profileData.level,
        dailyHours: profileData.dailyHours,
        updatedAt: new Date(),
      });

      // 3. Refresh Context
      if (refreshUserProfile) {
        await refreshUserProfile();
      }

      showToast("تم تحديث البيانات بنجاح");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("حدث خطأ أثناء حفظ التعديلات", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;

    setIsResetting(true);

    try {
      await sendPasswordResetEmail(auth, currentUser.email);
      showToast("تم إرسال رابط إعادة تعيين كلمة المرور لبريدك الإلكتروني");
    } catch (error) {
      console.error("Error sending reset email:", error);
      showToast("حدث خطأ أثناء إرسال البريد الإلكتروني", "error");
    } finally {
      setIsResetting(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async () => {
    if (!currentUser) return;

    setIsDeleting(true);

    try {
      const uid = currentUser.uid;

      // 1. Delete all learning paths
      const pathsRef = collection(db, "users", uid, "learningPaths");
      const pathsSnap = await getDocs(pathsRef);

      const deletePromises = pathsSnap.docs.map((docSnap) =>
        deleteDoc(doc(db, "users", uid, "learningPaths", docSnap.id)),
      );
      await Promise.all(deletePromises);

      // 2. Delete user document from Firestore
      await deleteDoc(doc(db, "users", uid));

      // 3. Delete user from Firebase Auth
      await deleteUser(currentUser);

      // 4. Redirect to login (handled implicitly by AuthContext if user becomes null, but safe to force)
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      // Re-authentication usually required before deletion
      if (error.code === "auth/requires-recent-login") {
        showToast(
          "يرجى تسجيل الدخول مرة أخرى قبل حذف الحساب لدواعي أمنية",
          "error",
        );
        setShowDeleteModal(false);
        setTimeout(async () => {
          await signOut(auth);
          navigate("/login");
        }, 3000);
      } else {
        showToast("حدث خطأ أثناء محاولة حذف الحساب", "error");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // ------------------------------------------------------------------------
  // Component Render
  // ------------------------------------------------------------------------
  if (loadingInitial) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center w-full">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 sm:p-8 lg:p-12 relative overflow-hidden w-full flex flex-col items-center animate-fade-in"
      dir="rtl"
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
          <div className="bg-[#1e293b] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-[slide-up_0.3s_ease-out]">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-3xl"
              />
            </div>
            <h3 className="text-2xl font-bold text-center text-white mb-4">
              حذف الحساب نهائياً؟
            </h3>
            <p className="text-white/70 text-center mb-8">
              سيتم حذف جميع بياناتك ومساراتك التعليمية بشكل لا يمكن استرجاعه. هل
              أنت متأكد من هذا الإجراء؟
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
              >
                {isDeleting ? <Spinner /> : "نعم، احذف حسابي"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
            إعدادات الحساب
          </h1>
          <p className="text-white/60">
            إدارة معلوماتك الشخصية وتفضيلات التعلم الخاصة بك.
          </p>
        </div>

        {/* Profile Settings Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl transition-all duration-300 hover:border-white/20">
          <h2 className="text-xl font-bold text-white mb-8 pb-4 border-b border-white/10 flex items-center gap-3">
            <FontAwesomeIcon icon={faUser} className="text-sky-400" />
            البيانات الشخصية
          </h2>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
            {/* Email (Readonly) */}
            <div className="flex flex-col gap-2">
              <label className="text-white/80 font-medium text-sm px-1 flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-white/40" />{" "}
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={currentUser?.email || ""}
                disabled
                className="w-full bg-black/20 border border-white/5 text-white/50 rounded-xl py-3.5 px-4 cursor-not-allowed focus:outline-none"
              />
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-white/80 font-medium text-sm px-1">
                الاسم الكامل
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                placeholder="أدخل اسمك"
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all placeholder-white/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Level */}
              <div className="flex flex-col gap-2">
                <label className="text-white/80 font-medium text-sm px-1 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className="text-sky-400/70"
                  />{" "}
                  المستوى الحالي
                </label>
                <div className="relative">
                  <select
                    name="level"
                    value={profileData.level}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all appearance-none cursor-pointer"
                  >
                    <option value="مبتدئ" className="bg-[#1e293b] text-white">
                      مبتدئ
                    </option>
                    <option value="متوسط" className="bg-[#1e293b] text-white">
                      متوسط
                    </option>
                    <option value="متقدم" className="bg-[#1e293b] text-white">
                      متقدم
                    </option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-white/50">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Daily Hours */}
              <div className="flex flex-col gap-2">
                <label className="text-white/80 font-medium text-sm px-1 flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-sky-400/70" />{" "}
                  ساعات الدراسة (يومياً)
                </label>
                <input
                  type="number"
                  name="dailyHours"
                  min="1"
                  max="12"
                  value={profileData.dailyHours}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3.5 px-4 focus:outline-none focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20 transition-all"
                />
              </div>
            </div>

            <div className="mt-4 pt-6 border-t border-white/5 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <Spinner />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} />
                    حفظ التعديلات
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security / Password Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-xl transition-all duration-300 hover:border-white/20">
          <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-3">
            <FontAwesomeIcon icon={faKey} className="text-amber-400" />
            الأمان وكلمة المرور
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="text-white/70 text-sm">
              <p className="font-semibold text-white/90 mb-1">
                تغيير كلمة المرور
              </p>
              <p>
                سيتم إرسال رابط لإعادة تعيين كلمة المرور إلى بريدك الإلكتروني
                المسجل.
              </p>
            </div>
            <button
              onClick={handlePasswordReset}
              disabled={isResetting}
              className="w-full sm:w-auto shrink-0 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
            >
              {isResetting ? <Spinner /> : "إرسال رابط التغيير"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-[2rem] p-6 sm:p-10 shadow-xl transition-all duration-300 hover:bg-red-500/10">
          <h2 className="text-xl font-bold text-red-400 mb-6 pb-4 border-b border-red-500/20 flex items-center gap-3">
            <FontAwesomeIcon icon={faTrashAlt} />
            المنطقة الخطرة
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="text-white/70 text-sm">
              <p className="font-semibold text-white/90 mb-1">
                حذف الحساب نهائياً
              </p>
              <p>
                بمجرد حذف حسابك، لن تتمكن من استرجاع أي بيانات أو مسارات تم
                إنشاؤها.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full sm:w-auto shrink-0 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-200 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faTrashAlt} />
              حذف الحساب
            </button>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `,
        }}
      />
    </div>
  );
};

export default Settings;
