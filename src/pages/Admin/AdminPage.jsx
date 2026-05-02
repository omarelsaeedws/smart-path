import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faTools, faUserShield, faRoad,
  faLaptopCode, faRightFromBracket, faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";

import { subscribeToUsers, updateUserRole, updateUserStatus, deleteUserDoc } from "../../services/adminService";
import { subscribeToResources, addResource, updateResource, deleteResource } from "../../services/resourceService";
import { subscribeToApplications, addApplication, updateApplication, deleteApplication } from "../../services/applicationService";
import { subscribeToCategories, addCategory, updateCategory, deleteCategory } from "../../services/categoryService";
import { getRoadmaps } from "../../services/roadmapService";
import { exportDatabase, downloadJSON, importDatabase } from "../../utils/backupService";

import { ThemeToggle } from "../../components/ThemeToggle";
import PageBackground from "../../components/PageBackground";

import UsersTab from "./UsersTab";
import ResourcesTab from "./ResourcesTab";
import RoadmapsTab from "./RoadmapsTab";
import ApplicationsTab from "./ApplicationsTab";
import CategoriesTab from "./CategoriesTab";

// ── Helpers ──────────────────────────────────────────────────────────────────
const StatCard = ({ title, count, icon, color }) => (
  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-3xl flex items-center justify-between relative overflow-hidden group shadow-sm hover-lift">
    <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-15 dark:opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-500`} />
    <div>
      <p className="text-slate-500 dark:text-sky-200 font-semibold mb-1 text-sm">{title}</p>
      <h3 className="text-4xl font-black text-slate-900 dark:text-white">{count}</h3>
    </div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg`}>
      <FontAwesomeIcon icon={icon} className="text-white text-2xl" />
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-200 whitespace-nowrap hover:-translate-y-0.5 active:scale-[.97] ${
      active
        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30"
        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
    }`}
  >
    <FontAwesomeIcon icon={icon} /> {label}
  </button>
);

const TABS = [
  { key: "categories", icon: faLayerGroup, label: "إدارة الفئات" },
  { key: "users",      icon: faUsers,      label: "إدارة المستخدمين" },
  { key: "resources",  icon: faTools,      label: "إدارة الأدوات" },
  { key: "roadmaps",   icon: faRoad,       label: "إدارة المسارات" },
  { key: "applications", icon: faLaptopCode, label: "التطبيقات العملية" },
];

// ── Main Component ────────────────────────────────────────────────────────────
const AdminPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [applications, setApplications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [roadmapCount, setRoadmapCount] = useState(0);
  const [searchUser, setSearchUser] = useState("");

  const [backupLoading, setBackupLoading] = useState(false);
  const [backupStatus, setBackupStatus] = useState("");
  const [backupError, setBackupError] = useState("");

  useEffect(() => {
    const unsubs = [
      subscribeToUsers(setUsers),
      subscribeToResources(setResources),
      subscribeToApplications(setApplications),
      subscribeToCategories(setCategories),
    ];
    // Fetch initial roadmap count
    getRoadmaps().then((list) => setRoadmapCount(list.length)).catch(console.error);
    return () => unsubs.forEach((fn) => fn());
  }, []);

  const handleLogout = async () => {
    try { await signOut(auth); navigate("/"); }
    catch (err) { console.error("Logout error:", err); }
  };

  const handleExport = async () => {
    setBackupLoading(true); setBackupError(""); setBackupStatus("");
    try {
      const data = await exportDatabase((msg) => setBackupStatus(msg));
      downloadJSON(data, `smart-path-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
      setBackupStatus("✅ تم تصدير قاعدة البيانات بنجاح!");
    } catch (err) {
      console.error(err); setBackupError("❌ فشل التصدير: " + err.message);
    } finally { setBackupLoading(false); }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    if (!window.confirm("⚠️ هل تريد استبدال كل البيانات الحالية بالملف المرفوع؟\nسيتم حذف كل شيء ثم استعادة النسخة الاحتياطية.")) return;
    setBackupLoading(true); setBackupError(""); setBackupStatus("جارٍ قراءة الملف...");
    try {
      const data = JSON.parse(await file.text());
      await importDatabase(data, (msg) => setBackupStatus(msg));
      setBackupStatus("✅ تم استيراد قاعدة البيانات بنجاح!");
    } catch (err) {
      console.error(err); setBackupError("❌ فشل الاستيراد: " + err.message);
    } finally { setBackupLoading(false); }
  };

  return (
    <div className="relative min-h-screen p-4 sm:p-6 lg:p-10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-x-hidden" dir="rtl">
      <PageBackground variant="admin" />
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-10 relative">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold flex items-center gap-4 text-slate-800 dark:text-white">
              <FontAwesomeIcon icon={faUserShield} className="text-sky-400" />
              لوحة الإدارة
            </h1>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button onClick={handleExport} disabled={backupLoading}
                  className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold rounded-2xl border border-emerald-200 dark:border-emerald-500/30 shadow-lg text-sm transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                  title="تصدير كل البيانات كملف JSON">
                  {backupLoading ? "⏳ جارٍ العمل..." : "📤 تصدير البيانات"}
                </button>
                <label className={`px-4 py-2.5 bg-sky-50 dark:bg-sky-500/20 hover:bg-sky-100 dark:hover:bg-sky-500/40 text-sky-700 dark:text-sky-300 font-bold rounded-2xl border border-sky-200 dark:border-sky-500/30 shadow-lg text-sm transition-all duration-300 ease-out cursor-pointer select-none ${backupLoading ? "opacity-50 pointer-events-none" : ""}`}
                  title="استيراد نسخة احتياطية من ملف JSON">
                  📥 استيراد البيانات
                  <input type="file" accept="application/json" className="hidden" onChange={handleImport} disabled={backupLoading} />
                </label>
                <button onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-3 bg-red-50 dark:bg-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/40 text-red-700 dark:text-red-200 font-bold rounded-2xl border border-red-200 dark:border-red-500/30 shadow-lg group transition-all duration-300 ease-out">
                  <span className="hidden sm:inline">تسجيل الخروج</span>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              </div>
              {(backupStatus || backupError) && (
                <p className={`text-xs font-semibold px-3 py-1 rounded-xl border ${backupError ? "text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30" : "text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30"}`}>
                  {backupError || backupStatus}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard title="إجمالي المستخدمين" count={users.length}       icon={faUsers}      color="from-sky-500 to-blue-600" />
            <StatCard title="الأدوات والمصادر"   count={resources.length}   icon={faTools}      color="from-emerald-500 to-teal-600" />
            <StatCard title="مسارات التعلم"       count={roadmapCount}        icon={faRoad}       color="from-amber-500 to-orange-600" />
            <StatCard title="التطبيقات العملية"   count={applications.length} icon={faLaptopCode} color="from-violet-500 to-purple-600" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-300 dark:border-slate-700 pb-4 overflow-x-auto">
          {TABS.map((t) => (
            <TabButton key={t.key} active={activeTab === t.key} onClick={() => setActiveTab(t.key)} icon={t.icon} label={t.label} />
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-xl min-h-[500px]">
          {activeTab === "categories" && (
            <CategoriesTab categories={categories} onAdd={addCategory} onUpdate={updateCategory} onDelete={deleteCategory} />
          )}
          {activeTab === "users" && (
            <UsersTab
              users={users}
              searchUser={searchUser}
              setSearchUser={setSearchUser}
              onToggleRole={async (user) => {
                const newRole = user.role === "admin" ? "user" : "admin";
                if (window.confirm(`هل أنت متأكد من تغيير صلاحية المستخدم إلى ${newRole}؟`))
                  await updateUserRole(user.id, newRole);
              }}
              onToggleStatus={async (user) => {
                await updateUserStatus(user.id, user.status === "suspended" ? "active" : "suspended");
              }}
              onDeleteUser={async (id) => {
                if (window.confirm("تحذير: هذا سيحذف بيانات المستخدم من قاعدة البيانات فقط. هل تريد المتابعة؟"))
                  await deleteUserDoc(id);
              }}
            />
          )}
          {activeTab === "resources" && (
            <ResourcesTab resources={resources} categories={categories} onAdd={addResource} onUpdate={updateResource} onDelete={deleteResource} />
          )}
          {activeTab === "roadmaps" && (
            <RoadmapsTab
              categories={categories}
              onCountChange={setRoadmapCount}
            />
          )}
          {activeTab === "applications" && (
            <ApplicationsTab applications={applications} categories={categories} onAdd={addApplication} onUpdate={updateApplication} onDelete={deleteApplication} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
