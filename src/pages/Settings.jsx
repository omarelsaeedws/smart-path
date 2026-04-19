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
  faSave,
  faKey,
  faTrashAlt,
  faExclamationTriangle,
  faLayerGroup,
  faCheckCircle as faCheckCircleSolid,
} from "@fortawesome/free-solid-svg-icons";
import { subscribeToCategories } from "../services/categoryService";

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
    interests: [],
  });

  // UI State
  const [, setLoadingInitial] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [toast, setToast] = useState(null);
  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [showInterestsDropdown, setShowInterestsDropdown] = useState(false);

  // Cycling gradient palette for category tiles
  const TILE_GRADIENTS = [
    "from-sky-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-fuchsia-500 to-pink-600",
    "from-lime-500 to-green-600",
  ];

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
        interests: userProfile.interests || [],
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

  useEffect(() => {
    const unsub = subscribeToCategories((data) => {
      setCategories(data);
      setCatsLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleInterest = (id) => {
    setProfileData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  // ------------------------------------------------------------------------
  // Action Handlers
  // ------------------------------------------------------------------------
  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
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
        interests: profileData.interests,
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
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-[slide-up_0.3s_ease-out]">
            <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-3xl"
              />
            </div>
            <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-4">
              حذف الحساب نهائياً؟
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-center mb-8">
              سيتم حذف جميع بياناتك ومساراتك التعليمية بشكل لا يمكن استرجاعه. هل
              أنت متأكد من هذا الإجراء؟
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 transition-all duration-300 ease-out"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:-none flex items-center justify-center hover-lift transition-all duration-300 ease-out"
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
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-2 tracking-tight">
            إعدادات الحساب
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            إدارة معلوماتك الشخصية وتفضيلات التعلم الخاصة بك.
          </p>
        </div>

        {/* Profile Settings Card */}
        <div className="bg-white dark:bg-slate-800 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-[2rem] p-6 sm:p-10 shadow-2xl hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 ease-out">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8 pb-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <FontAwesomeIcon
              icon={faUser}
              className="text-sky-500 dark:text-sky-400"
            />
            البيانات الشخصية
          </h2>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-200 font-medium text-sm px-1 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-slate-400 dark:text-slate-500"
                />{" "}
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={currentUser?.email || ""}
                disabled
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl py-3.5 px-4 cursor-not-allowed focus:outline-none transition-all duration-300 ease-out"
              />
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-200 font-medium text-sm px-1">
                الاسم الكامل
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                placeholder="أدخل اسمك"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3.5 px-4 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 ease-out"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Level */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-200 font-medium text-sm px-1 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className="text-sky-600 dark:text-sky-400/70"
                  />{" "}
                  المستوى الحالي
                </label>
                <div className="relative group">
                  <select
                    name="level"
                    value={profileData.level}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl py-3.5 px-4 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 appearance-none cursor-pointer transition-all duration-300 ease-out"
                  >
                    <option value="مبتدئ">مبتدئ</option>
                    <option value="متوسط">متوسط</option>
                    <option value="متقدم">متقدم</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 dark:text-slate-400">
                    <svg
                      className="w-4 h-4 transition-transform group-focus-within:rotate-180"
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
            </div>

            {/* Interests (Integrated Select) */}
            <div className="flex flex-col gap-2">
              <label className="text-slate-700 dark:text-slate-200 font-medium text-sm px-1 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faLayerGroup}
                  className="text-sky-600 dark:text-sky-400/70"
                />{" "}
                الاهتمامات المهنية
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowInterestsDropdown(!showInterestsDropdown)}
                  className="w-full min-h-[3.5rem] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 flex items-center justify-between hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300 group"
                >
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.length > 0 ? (
                      categories
                        .filter((c) => profileData.interests.includes(c.id))
                        .map((c) => (
                          <span
                            key={c.id}
                            className="bg-sky-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm"
                          >
                            {c.name}
                          </span>
                        ))
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-sm">
                        اختر اهتماماتك...
                      </span>
                    )}
                  </div>
                  <FontAwesomeIcon
                    icon={faLayerGroup}
                    className={`text-slate-400 transition-transform duration-300 ${showInterestsDropdown ? "rotate-180 text-sky-500" : ""}`}
                  />
                </button>

                {showInterestsDropdown && (
                  <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-wrap gap-2">
                      {catsLoading ? (
                        <div className="w-full text-center py-4 text-slate-400 text-sm animate-pulse">
                          جاري تحميل الفئات...
                        </div>
                      ) : (
                        categories.map((cat) => {
                          const isSelected =
                            profileData.interests.includes(cat.id);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => toggleInterest(cat.id)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                isSelected
                                  ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                                  : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-transparent hover:border-sky-400"
                              }`}
                            >
                              <span>{cat.name}</span>
                              {isSelected && (
                                <FontAwesomeIcon
                                  icon={faCheckCircleSolid}
                                  className="text-[10px]"
                                />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
                <div className="mt-2 flex items-center gap-2 px-1">
                  <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    انقر لفتح القائمة وتعديل اهتماماتك.
                  </p>
                </div>
              </div>


            </div>

            <div className="mt-4 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-sky-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:-none flex items-center justify-center gap-2 hover-lift transition-all duration-300 ease-out"
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
        <div className="bg-white dark:bg-slate-800 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-[2rem] p-6 sm:p-10 shadow-xl hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300 ease-out">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 pb-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <FontAwesomeIcon
              icon={faKey}
              className="text-amber-500 dark:text-amber-400"
            />
            الأمان وكلمة المرور
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="text-slate-600 dark:text-slate-300 text-sm">
              <p className="font-semibold text-slate-800 dark:text-white mb-1">
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
              className="w-full sm:w-auto shrink-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white font-semibold py-3 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px] transition-all duration-300 ease-out"
            >
              {isResetting ? <Spinner /> : "إرسال رابط التغيير"}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-500/5 backdrop-blur-xl border border-red-200 dark:border-red-500/20 rounded-[2rem] p-6 sm:p-10 shadow-xl hover:bg-red-100 dark:hover:bg-red-500/10 transition-all duration-300 ease-out">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-6 pb-4 border-b border-red-200 dark:border-red-500/20 flex items-center gap-3">
            <FontAwesomeIcon icon={faTrashAlt} />
            المنطقة الخطرة
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="text-slate-600 dark:text-slate-300 text-sm">
              <p className="font-semibold text-slate-800 dark:text-white mb-1">
                حذف الحساب نهائياً
              </p>
              <p>
                بمجرد حذف حسابك، لن تتمكن من استرجاع أي بيانات أو مسارات تم
                إنشاؤها.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full sm:w-auto shrink-0 bg-red-100 dark:bg-red-500/20 hover:bg-red-200 dark:hover:bg-red-500/30 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-200 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ease-out"
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
