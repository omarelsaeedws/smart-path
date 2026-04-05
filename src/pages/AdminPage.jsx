import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faTools,
  faUserShield,
  faBan,
  faCheckCircle,
  faTrashAlt,
  faPlus,
  faSearch,
  faRightFromBracket,
  faRoad,
  faChevronDown,
  faChevronUp,
  faLaptopCode,
  faPenToSquare,
  faXmark,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { subscribeToUsers, updateUserRole, updateUserStatus, deleteUserDoc } from "../services/adminService";
import { subscribeToResources, addResource, deleteResource } from "../services/resourceService";
import {
  getRoadmaps,
  addRoadmap,
  deleteRoadmap,
  getWeeks,
  addWeek,
  deleteWeek,
  getLessons,
  addLesson,
  deleteLesson,
} from "../services/roadmapService";
import {
  subscribeToApplications,
  addApplication,
  updateApplication,
  deleteApplication,
} from "../services/applicationService";
import { subscribeToCategories, addCategory, updateCategory, deleteCategory } from "../services/categoryService";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { seedDatabase } from "../utils/seedRealData";

const AdminPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);

  // Roadmap state
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(null);
  const [roadmapWeeks, setRoadmapWeeks] = useState([]);
  const [selectedWeekId, setSelectedWeekId] = useState(null);
  const [weekLessons, setWeekLessons] = useState([]);
  const [expandedWeekId, setExpandedWeekId] = useState(null);

  const [roadmapForm, setRoadmapForm] = useState({ title: "", description: "", categoryId: "", level: "مبتدئ", totalWeeks: 4, instructorName: "", contentSource: "YouTube", sourceLink: "" });
  const [weekForm, setWeekForm] = useState({ weekNumber: 1, weekGoal: "" });
  const [lessonForm, setLessonForm] = useState({ title: "", description: "", source: "YouTube", resourceLink: "", estimatedHours: 2, order: 1 });

  const [searchUser, setSearchUser] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // users | resources | roadmaps | applications

  // Resource Form State
  const [resourceForm, setResourceForm] = useState({ name: "", category: "", categoryId: "", description: "", link: "" });

  // Applications state
  const [applications, setApplications] = useState([]);
  const emptyAppForm = { title: "", description: "", categoryId: "", level: "Beginner", link: "", image: "" };
  const [appForm, setAppForm] = useState(emptyAppForm);
  const [editingApp, setEditingApp] = useState(null); // null = closed, obj = editing
  const [editForm, setEditForm] = useState(emptyAppForm);

  // Categories state
  const [categories, setCategories] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCatForm, setEditCatForm] = useState({ name: "" });

  useEffect(() => {
    const unsubUsers = subscribeToUsers(setUsers);
    const unsubResources = subscribeToResources(setResources);
    const unsubApplications = subscribeToApplications(setApplications);
    const unsubCategories = subscribeToCategories(setCategories);

    return () => {
      unsubUsers();
      unsubResources();
      unsubApplications();
      unsubCategories();
    };
  }, []);

  // Load roadmaps when tab is active
  useEffect(() => {
    if (activeTab === "roadmaps") {
      getRoadmaps().then(setRoadmaps).catch(console.error);
    }
  }, [activeTab]);

  // Load weeks when a roadmap is selected
  useEffect(() => {
    if (selectedRoadmapId) {
      getWeeks(selectedRoadmapId)
        .then((weeks) => {
          setRoadmapWeeks(weeks);
          setSelectedWeekId(null);
          setWeekLessons([]);
        })
        .catch(console.error);
    }
  }, [selectedRoadmapId]);

  // Load lessons when a week is selected
  useEffect(() => {
    if (selectedRoadmapId && selectedWeekId) {
      getLessons(selectedRoadmapId, selectedWeekId).then(setWeekLessons).catch(console.error);
    }
  }, [selectedRoadmapId, selectedWeekId]);

  const handleToggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    if (window.confirm(`هل أنت متأكد من تغيير صلاحية المستخدم إلى ${newRole}؟`)) {
      await updateUserRole(user.id, newRole);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "suspended" ? "active" : "suspended";
    await updateUserStatus(user.id, newStatus);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("تحذير: هذا سيحذف بيانات المستخدم من قاعدة البيانات فقط ولن يحذفه من المصادقة (Auth). هل تريد المتابعة؟")) {
      await deleteUserDoc(userId);
    }
  };

  // Category Handlers
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) return;
    await addCategory(categoryForm);
    setCategoryForm({ name: "" });
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setEditCatForm({ name: cat.name });
  };

  const handleSaveEditCategory = async (e) => {
    e.preventDefault();
    await updateCategory(editingCategory.id, editCatForm);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الفئة؟")) {
      await deleteCategory(id);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();

    if (!resourceForm.name || !resourceForm.link) return;
    await addResource(resourceForm);
    setResourceForm({ name: "", category: "", description: "", link: "" });
  };

  const handleDeleteResource = async (resourceId) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الأداة؟")) await deleteResource(resourceId);
  };

  const filteredUsers = users.filter((u) => u.email?.toLowerCase().includes(searchUser.toLowerCase()) || u.displayName?.toLowerCase().includes(searchUser.toLowerCase()));

  // Split users into admins and regular users
  const adminsList = filteredUsers.filter(u => u.role === 'admin');
  const regularUsersList = filteredUsers.filter(u => u.role !== 'admin');

  const handleAddRoadmap = async (e) => {
    e.preventDefault();
    if (!roadmapForm.title) return;
    await addRoadmap({ ...roadmapForm, totalWeeks: Number(roadmapForm.totalWeeks) });
    setRoadmapForm({ title: "", description: "", level: "مبتدئ", totalWeeks: 4, instructorName: "", contentSource: "YouTube", sourceLink: "" });
    const updated = await getRoadmaps();
    setRoadmaps(updated);
  };

  const handleDeleteRoadmap = async (roadmapId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المسار؟")) {
      await deleteRoadmap(roadmapId);
      const updated = await getRoadmaps();
      setRoadmaps(updated);
      if (selectedRoadmapId === roadmapId) {
        setSelectedRoadmapId(null);
        setRoadmapWeeks([]);
      }
    }
  };

  const handleAddWeek = async (e) => {
    e.preventDefault();
    if (!selectedRoadmapId) return;
    await addWeek(selectedRoadmapId, { ...weekForm, weekNumber: Number(weekForm.weekNumber) });
    setWeekForm({ weekNumber: roadmapWeeks.length + 2, weekGoal: "" });
    const updated = await getWeeks(selectedRoadmapId);
    setRoadmapWeeks(updated);
  };

  const handleDeleteWeek = async (weekId) => {
    if (window.confirm("حذف هذا الأسبوع؟")) {
      await deleteWeek(selectedRoadmapId, weekId);
      const updated = await getWeeks(selectedRoadmapId);
      setRoadmapWeeks(updated);
      if (selectedWeekId === weekId) {
        setSelectedWeekId(null);
        setWeekLessons([]);
      }
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!selectedRoadmapId || !selectedWeekId) return;
    await addLesson(selectedRoadmapId, selectedWeekId, {
      ...lessonForm,
      estimatedHours: Number(lessonForm.estimatedHours),
      order: Number(lessonForm.order),
    });
    setLessonForm({ title: "", description: "", source: "YouTube", resourceLink: "", estimatedHours: 2, order: weekLessons.length + 2 });
    const updated = await getLessons(selectedRoadmapId, selectedWeekId);
    setWeekLessons(updated);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm("حذف هذا الدرس؟")) {
      await deleteLesson(selectedRoadmapId, selectedWeekId, lessonId);
      const updated = await getLessons(selectedRoadmapId, selectedWeekId);
      setWeekLessons(updated);
    }
  };

  // Applications handlers
  const handleAddApplication = async (e) => {
    e.preventDefault();
    if (!appForm.title) return;
    await addApplication(appForm);
    setAppForm(emptyAppForm);
  };

  const handleOpenEdit = (app) => {
    setEditingApp(app);
    setEditForm({
      title: app.title || "",
      description: app.description || "",
      categoryId: app.categoryId || "",
      level: app.level || "Beginner",
      link: app.link || "",
      image: app.image || "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    await updateApplication(editingApp.id, editForm);
    setEditingApp(null);
  };

  const handleDeleteApplication = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التطبيق؟")) {
      await deleteApplication(id);
    }
  };

  // Stats
  const totalUsers = users.length;
  const totalResources = resources.length;
  const totalRoadmaps = roadmaps.length;
  const totalApplications = applications.length;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10" dir="rtl">
      
      {/* Header & Stats */}
      <div className="mb-10 text-white relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold flex items-center gap-4">
            <FontAwesomeIcon icon={faUserShield} className="text-sky-400" />
            لوحة الإدارة
          </h1>
          <div className="flex items-center gap-3">
            {/* Developer Tool: Seed Content */}
            <button
              onClick={seedDatabase}
              className="px-4 py-3 bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 font-bold rounded-2xl border border-amber-500/30 transition shadow-lg text-sm"
              title="إضافة بيانات تجريبية (للمطورين)"
            >
              🚀 زر إطلاق الداتا
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-6 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-200 font-bold rounded-2xl border border-red-500/30 transition shadow-lg group"
            >
              <span className="hidden sm:inline">تسجيل الخروج</span>
              <FontAwesomeIcon icon={faRightFromBracket} className="group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard title="إجمالي المستخدمين" count={totalUsers} icon={faUsers} color="from-sky-500 to-blue-600" />
          <StatCard title="الأدوات والمصادر" count={totalResources} icon={faTools} color="from-emerald-500 to-teal-600" />
          <StatCard title="مسارات التعلم" count={totalRoadmaps} icon={faRoad} color="from-amber-500 to-orange-600" />
          <StatCard title="التطبيقات العملية" count={totalApplications} icon={faLaptopCode} color="from-violet-500 to-purple-600" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-white/20 pb-4 overflow-x-auto">
        <TabButton active={activeTab === "categories"} onClick={() => setActiveTab("categories")} icon={faLayerGroup} label="إدارة الفئات" />
        <TabButton active={activeTab === "users"} onClick={() => setActiveTab("users")} icon={faUsers} label="إدارة المستخدمين" />
        <TabButton active={activeTab === "resources"} onClick={() => setActiveTab("resources")} icon={faTools} label="إدارة الأدوات" />
        <TabButton active={activeTab === "roadmaps"} onClick={() => setActiveTab("roadmaps")} icon={faRoad} label="إدارة المسارات" />
        <TabButton active={activeTab === "applications"} onClick={() => setActiveTab("applications")} icon={faLaptopCode} label="التطبيقات العملية" />
      </div>

      {/* Tab Content */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl min-h-[500px]">
        
        {/* CATEGORIES TAB */}
        {activeTab === "categories" && (
          <div className="animate-fade-in flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
              <h3 className="text-xl font-bold text-white mb-4">إضافة فئة جديدة</h3>
              <form onSubmit={handleAddCategory} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                <input required type="text" placeholder="اسم الفئة (مثال: برمجة، تصميم...)" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-sky-400 outline-none" />
                <button type="submit" className="w-full py-2.5 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-lg transition shadow-lg flex justify-center items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} /> إضافة فئة
                </button>
              </form>
            </div>
            <div className="w-full lg:w-2/3">
              <h3 className="text-xl font-bold text-white mb-4">الفئات الحالية ({categories.length})</h3>
              {categories.length === 0 ? (
                <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-white/50">لا يوجد فئات حالياً.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center group hover:bg-white/10 transition">
                      {editingCategory?.id === cat.id ? (
                        <form onSubmit={handleSaveEditCategory} className="flex flex-1 gap-2">
                          <input autoFocus required type="text" value={editCatForm.name} onChange={(e) => setEditCatForm({ name: e.target.value })} className="flex-1 bg-black/20 text-white rounded-lg px-3 py-1 border border-white/20 focus:border-violet-400 outline-none" />
                          <button type="submit" className="text-green-400 hover:text-green-300 px-2"><FontAwesomeIcon icon={faCheckCircle} /></button>
                          <button type="button" onClick={() => setEditingCategory(null)} className="text-gray-400 hover:text-gray-300 px-2"><FontAwesomeIcon icon={faXmark} /></button>
                        </form>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-300 flex justify-center items-center font-black">{cat.name.charAt(0).toUpperCase()}</div>
                            <span className="text-white font-bold">{cat.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleOpenEditCategory(cat)} className="text-sky-400 hover:text-sky-300 p-2"><FontAwesomeIcon icon={faPenToSquare} /></button>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:text-red-300 p-2"><FontAwesomeIcon icon={faTrashAlt} /></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="animate-fade-in space-y-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-white">إدارة الحسابات</h2>
              <div className="relative w-full max-w-sm">
                <input 
                  type="text" 
                  placeholder="ابحث بالبريد أو الاسم..." 
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full bg-white/10 text-white border border-white/20 rounded-xl py-2 px-4 pr-10 focus:outline-none focus:border-sky-400 focus:bg-white/20 transition-all"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50" />
              </div>
            </div>

            {/* Admins Table */}
            <div>
              <h3 className="text-xl font-bold text-purple-300 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUserShield} /> المدراء (Admins)
              </h3>
              <div className="overflow-x-auto bg-black/10 rounded-2xl border border-white/10">
                <table className="w-full text-white text-right border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-4 font-semibold text-sky-200">المدير</th>
                      <th className="p-4 font-semibold text-sky-200">البريد الإلكتروني</th>
                      <th className="p-4 font-semibold text-sky-200">الحالة</th>
                      <th className="p-4 font-semibold text-sky-200 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminsList.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition duration-200">
                        <td className="p-4 font-medium">{user.displayName || "بدون اسم"}</td>
                        <td className="p-4 opacity-80">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center justify-center gap-1 w-max ${user.status === 'suspended' ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}`}>
                            {user.status === 'suspended' ? <><FontAwesomeIcon icon={faBan}/> محظور</> : <><FontAwesomeIcon icon={faCheckCircle}/> نشط</>}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2 justify-center">
                          <button onClick={() => handleToggleRole(user)} className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-400/30 rounded-lg text-indigo-200 text-sm font-semibold transition" title="إزالة الإدارة">
                            إزالة الإدارة
                          </button>
                          <button onClick={() => handleToggleStatus(user)} className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/40 border border-orange-400/30 rounded-lg text-orange-200 text-sm font-semibold transition" title="حظر / تفعيل">
                            {user.status === 'suspended' ? "تفعيل" : "حظر"}
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-400/30 rounded-lg text-red-200 transition" title="حذف المستخدم">
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {adminsList.length === 0 && (
                      <tr><td colSpan="4" className="p-8 text-center text-white/50">لا يوجد مدراء.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Regular Users Table */}
            <div>
              <h3 className="text-xl font-bold text-sky-300 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} /> المستخدمين العاديين
              </h3>
              <div className="overflow-x-auto bg-black/10 rounded-2xl border border-white/10">
                <table className="w-full text-white text-right border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-4 font-semibold text-sky-200">المستخدم</th>
                      <th className="p-4 font-semibold text-sky-200">البريد الإلكتروني</th>
                      <th className="p-4 font-semibold text-sky-200">الحالة</th>
                      <th className="p-4 font-semibold text-sky-200 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regularUsersList.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition duration-200">
                        <td className="p-4 font-medium">{user.displayName || "بدون اسم"}</td>
                        <td className="p-4 opacity-80">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center justify-center gap-1 w-max ${user.status === 'suspended' ? 'bg-red-500/30 text-red-300' : 'bg-green-500/30 text-green-300'}`}>
                            {user.status === 'suspended' ? <><FontAwesomeIcon icon={faBan}/> محظور</> : <><FontAwesomeIcon icon={faCheckCircle}/> نشط</>}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2 justify-center">
                          <button onClick={() => handleToggleRole(user)} className="px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-400/30 rounded-lg text-indigo-200 text-sm font-semibold transition" title="الترقية لإدارة">
                            الترقية لإدارة
                          </button>
                        </td>
                      </tr>
                    ))}
                    {regularUsersList.length === 0 && (
                      <tr><td colSpan="4" className="p-8 text-center text-white/50">لا يوجد مستخدمين عاديين.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === "resources" && (
          <div className="animate-fade-in flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3">
              <h3 className="text-xl font-bold text-white mb-4">إضافة أداة/مصدر</h3>
              <form onSubmit={handleAddResource} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
                <input required type="text" placeholder="اسم الأداة" value={resourceForm.name} onChange={e => setResourceForm({...resourceForm, name: e.target.value})} className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-sky-400 outline-none" />
                <select
                  required
                  value={resourceForm.categoryId}
                  onChange={e => setResourceForm({...resourceForm, categoryId: e.target.value})}
                  className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-sky-400 outline-none"
                >
                  <option value="" disabled className="bg-gray-800">اختر الفئة</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id} className="bg-gray-800">{c.name}</option>
                  ))}
                </select>
                <textarea required placeholder="وصف الأداة" value={resourceForm.description} onChange={e => setResourceForm({...resourceForm, description: e.target.value})} rows="3" className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-sky-400 outline-none" />
                <input required type="url" placeholder="رابط الأداة" value={resourceForm.link} onChange={e => setResourceForm({...resourceForm, link: e.target.value})} className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-sky-400 outline-none text-left" dir="ltr" />
                <button type="submit" className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg transition shadow-lg flex justify-center items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} /> إضافة الأداة
                </button>
              </form>
            </div>
            <div className="w-full lg:w-2/3">
              <h3 className="text-xl font-bold text-white mb-4">الأدوات الحالية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map(res => (
                  <div key={res.id} className="bg-white/10 p-4 rounded-xl border border-white/10 relative group">
                    <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-xs mb-2">{res.category}</span>
                    <h4 className="text-lg font-bold text-white pr-8">{res.name}</h4>
                    <p className="text-sm text-white/70 line-clamp-2">{res.description}</p>
                    <button onClick={() => handleDeleteResource(res.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition opacity-50 group-hover:opacity-100">
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ROADMAPS TAB */}
        {activeTab === "roadmaps" && (
          <div className="animate-fade-in space-y-8" dir="rtl">
            <h2 className="text-2xl font-bold text-white">إدارة مسارات التعلم</h2>

            {/* Create Roadmap */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-300 mb-4">➕ إنشاء مسار جديد</h3>
              <form onSubmit={handleAddRoadmap} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="عنوان المسار" value={roadmapForm.title}
                  onChange={e => setRoadmapForm({...roadmapForm, title: e.target.value})}
                  className="bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-amber-400 outline-none" />
                <input type="text" placeholder="وصف المسار" value={roadmapForm.description}
                  onChange={e => setRoadmapForm({...roadmapForm, description: e.target.value})}
                  className="bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-amber-400 outline-none" />
                <select required value={roadmapForm.categoryId} onChange={e => setRoadmapForm({...roadmapForm, categoryId: e.target.value})}
                  className="bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-amber-400 outline-none">
                  <option value="" disabled className="bg-gray-800">اختر الفئة</option>
                  {categories.map(c => <option key={c.id} value={c.id} className="bg-gray-800">{c.name}</option>)}
                </select>
                <select value={roadmapForm.level} onChange={e => setRoadmapForm({...roadmapForm, level: e.target.value})}
                  className="bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-amber-400 outline-none">
                  <option value="مبتدئ" className="bg-gray-800">مبتدئ</option>
                  <option value="متوسط" className="bg-gray-800">متوسط</option>
                  <option value="متقدم" className="bg-gray-800">متقدم</option>
                </select>
                <input type="number" min="1" max="52" placeholder="عدد الأسابيع" value={roadmapForm.totalWeeks}
                  onChange={e => setRoadmapForm({...roadmapForm, totalWeeks: e.target.value})}
                  className="bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-amber-400 outline-none" />
                
                <input type="text" placeholder="اسم مقدم المحتوى (المدرب)" value={roadmapForm.instructorName}
                  onChange={e => setRoadmapForm({...roadmapForm, instructorName: e.target.value})}
                  className="bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-amber-400 outline-none" />
                
                <select value={roadmapForm.contentSource} onChange={e => setRoadmapForm({...roadmapForm, contentSource: e.target.value})}
                  className="bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-amber-400 outline-none">
                  <option value="YouTube" className="bg-gray-800">YouTube</option>
                  <option value="Udemy" className="bg-gray-800">Udemy</option>
                  <option value="Coursera" className="bg-gray-800">Coursera</option>
                  <option value="منصة أخرى" className="bg-gray-800">منصة أخرى</option>
                </select>

                <input type="url" placeholder="الرابط المباشر للكورس أو القناة" value={roadmapForm.sourceLink}
                  onChange={e => setRoadmapForm({...roadmapForm, sourceLink: e.target.value})}
                  className="md:col-span-2 bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-amber-400 outline-none text-left" dir="ltr" />

                <button type="submit" className="md:col-span-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-lg transition flex justify-center items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} /> إنشاء المسار
                </button>
              </form>
            </div>

            {/* Roadmaps list */}
            {roadmaps.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">المسارات الحالية</h3>
                {roadmaps.map(rm => (
                  <div key={rm.id} className={`bg-white/5 border rounded-2xl overflow-hidden transition-all ${
                    selectedRoadmapId === rm.id ? "border-amber-400/50 ring-1 ring-amber-400/20" : "border-white/10"
                  }`}>
                    {/* Roadmap row */}
                    <div className="p-4 flex items-center gap-4">
                      <button onClick={() => setSelectedRoadmapId(selectedRoadmapId === rm.id ? null : rm.id)}
                        className="flex-1 text-right flex items-center gap-3">
                        <FontAwesomeIcon icon={selectedRoadmapId === rm.id ? faChevronUp : faChevronDown}
                          className="text-amber-400 w-4" />
                        <div>
                          <p className="text-white font-bold">{rm.title}</p>
                          <p className="text-white/50 text-xs">{rm.level} • {rm.totalWeeks} أسابيع</p>
                        </div>
                      </button>
                      <button onClick={() => handleDeleteRoadmap(rm.id)}
                        className="text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition">
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>

                    {/* Weeks section (expanded) */}
                    {selectedRoadmapId === rm.id && (
                      <div className="border-t border-white/10 p-4 bg-black/10 space-y-4">
                        {/* Add week form */}
                        <div className="bg-white/5 rounded-xl p-4">
                          <p className="text-sky-300 font-bold mb-3">➕ إضافة أسبوع</p>
                          <form onSubmit={handleAddWeek} className="flex gap-3 flex-wrap">
                            <input type="number" min="1" placeholder="رقم الأسبوع" value={weekForm.weekNumber}
                              onChange={e => setWeekForm({...weekForm, weekNumber: e.target.value})}
                              className="bg-black/20 text-white rounded-lg px-3 py-1.5 border border-white/20 focus:border-sky-400 outline-none w-28" />
                            <input type="text" placeholder="هدف الأسبوع" value={weekForm.weekGoal}
                              onChange={e => setWeekForm({...weekForm, weekGoal: e.target.value})}
                              className="flex-1 min-w-[150px] bg-black/20 text-white rounded-lg px-3 py-1.5 border border-white/20 focus:border-sky-400 outline-none" />
                            <button type="submit" className="px-4 py-1.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg transition">
                              إضافة
                            </button>
                          </form>
                        </div>

                        {/* Weeks list */}
                        {roadmapWeeks.map(week => (
                          <div key={week.id} className={`bg-white/5 border rounded-xl overflow-hidden ${
                            selectedWeekId === week.id ? "border-sky-400/50" : "border-white/5"
                          }`}>
                            <div className="p-3 flex items-center gap-3">
                              <button onClick={() => { setSelectedWeekId(selectedWeekId === week.id ? null : week.id); setExpandedWeekId(expandedWeekId === week.id ? null : week.id); }}
                                className="flex-1 text-right flex items-center gap-2">
                                <FontAwesomeIcon icon={expandedWeekId === week.id ? faChevronUp : faChevronDown}
                                  className="text-sky-300 w-3" />
                                <span className="text-white font-semibold text-sm">الأسبوع {week.weekNumber}</span>
                                <span className="text-white/50 text-xs">{week.weekGoal}</span>
                              </button>
                              <button onClick={() => handleDeleteWeek(week.id)}
                                className="text-red-400/70 hover:text-red-400 transition">
                                <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
                              </button>
                            </div>

                            {/* Lessons section */}
                            {expandedWeekId === week.id && (
                              <div className="border-t border-white/5 p-3 bg-black/10 space-y-3">
                                {/* Add lesson form */}
                                <div className="bg-white/5 rounded-lg p-3">
                                  <p className="text-emerald-300 font-bold text-sm mb-2">➕ إضافة درس</p>
                                  <form onSubmit={handleAddLesson} className="space-y-2">
                                    <input required type="text" placeholder="عنوان الدرس" value={lessonForm.title}
                                      onChange={e => setLessonForm({...lessonForm, title: e.target.value})}
                                      className="w-full bg-black/20 text-white rounded-lg px-3 py-1.5 border border-white/20 focus:border-emerald-400 outline-none text-sm" />
                                    <textarea placeholder="وصف الدرس (اختياري)" value={lessonForm.description}
                                      onChange={e => setLessonForm({...lessonForm, description: e.target.value})}
                                      rows="2" className="w-full bg-black/20 text-white rounded-lg px-3 py-1.5 border border-white/20 focus:border-emerald-400 outline-none text-sm" />
                                    <div className="flex gap-2 mb-2">
                                      <select value={lessonForm.source}
                                        onChange={e => setLessonForm({...lessonForm, source: e.target.value})}
                                        className="w-1/3 bg-black/20 text-white rounded-lg px-3 py-1.5 border border-white/20 focus:border-emerald-400 outline-none text-sm">
                                        <option value="YouTube" className="bg-gray-800">YouTube</option>
                                        <option value="Udemy" className="bg-gray-800">Udemy</option>
                                        <option value="Coursera" className="bg-gray-800">Coursera</option>
                                        <option value="مقال" className="bg-gray-800">مقال</option>
                                        <option value="أخرى" className="bg-gray-800">أخرى</option>
                                      </select>
                                      <input type="url" placeholder="رابط المصدر" value={lessonForm.resourceLink}
                                        onChange={e => setLessonForm({...lessonForm, resourceLink: e.target.value})}
                                        className="flex-1 bg-black/20 text-white rounded-lg px-3 py-1.5 border border-white/20 focus:border-emerald-400 outline-none text-sm text-left" dir="ltr" />
                                    </div>
                                    <div className="flex gap-2">
                                      <input type="number" min="1" placeholder="ساعات" value={lessonForm.estimatedHours}
                                        onChange={e => setLessonForm({...lessonForm, estimatedHours: e.target.value})}
                                        className="w-24 bg-black/20 text-white rounded-lg px-3 py-1.5 border border-white/20 focus:border-emerald-400 outline-none text-sm" />
                                      <input type="number" min="1" placeholder="الترتيب" value={lessonForm.order}
                                        onChange={e => setLessonForm({...lessonForm, order: e.target.value})}
                                        className="w-24 bg-black/20 text-white rounded-lg px-3 py-1.5 border border-white/20 focus:border-emerald-400 outline-none text-sm" />
                                      <button type="submit" className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-lg transition text-sm">
                                        إضافة الدرس
                                      </button>
                                    </div>
                                  </form>
                                </div>

                                {/* Lessons list */}
                                {weekLessons.map((lesson) => (
                                  <div key={lesson.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-2.5">
                                    <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                                      {lesson.order}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-white text-sm font-medium truncate">{lesson.title}</p>
                                      <p className="text-white/40 text-xs">{lesson.source || "غير محدد"} • {lesson.estimatedHours} ساعات</p>
                                    </div>
                                    <button onClick={() => handleDeleteLesson(lesson.id)}
                                      className="text-red-400/60 hover:text-red-400 transition shrink-0">
                                      <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
                                    </button>
                                  </div>
                                ))}
                                {weekLessons.length === 0 && (
                                  <p className="text-white/30 text-xs text-center py-2">لا توجد دروس بعد.</p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        {roadmapWeeks.length === 0 && (
                          <p className="text-white/40 text-sm text-center py-3">لا توجد أسابيع. أضف أسبوعاً أولاً.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === "applications" && (
          <div className="animate-fade-in flex flex-col lg:flex-row gap-8" dir="rtl">

            {/* Add Form */}
            <div className="w-full lg:w-1/3 shrink-0">
              <h3 className="text-xl font-bold text-white mb-4">إضافة تطبيق عملي</h3>
              <form onSubmit={handleAddApplication} className="space-y-3 bg-white/5 p-6 rounded-2xl border border-white/10">
                <input
                  required type="text" placeholder="عنوان التطبيق"
                  value={appForm.title}
                  onChange={e => setAppForm({ ...appForm, title: e.target.value })}
                  className="w-full bg-black/20 text-white rounded-lg px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none"
                />
                <textarea
                  placeholder="وصف التطبيق"
                  value={appForm.description}
                  onChange={e => setAppForm({ ...appForm, description: e.target.value })}
                  rows="3"
                  className="w-full bg-black/20 text-white rounded-lg px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none resize-none"
                />
                <select
                  required
                  value={appForm.categoryId}
                  onChange={e => setAppForm({ ...appForm, categoryId: e.target.value })}
                  className="w-full bg-black/20 text-white rounded-lg px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none"
                >
                  <option value="" disabled className="bg-gray-800">اختر الفئة</option>
                  {categories.map(c => <option key={c.id} value={c.id} className="bg-gray-800">{c.name}</option>)}
                </select>
                <select
                  value={appForm.level}
                  onChange={e => setAppForm({ ...appForm, level: e.target.value })}
                  className="w-full bg-black/20 text-white rounded-lg px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none"
                >
                  <option value="Beginner" className="bg-gray-800">مبتدئ</option>
                  <option value="Intermediate" className="bg-gray-800">متوسط</option>
                  <option value="Advanced" className="bg-gray-800">متقدم</option>
                </select>
                <input
                  type="url" placeholder="رابط المشروع (اختياري)"
                  value={appForm.link}
                  onChange={e => setAppForm({ ...appForm, link: e.target.value })}
                  className="w-full bg-black/20 text-white rounded-lg px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none text-left" dir="ltr"
                />
                <input
                  type="url" placeholder="رابط الصورة (اختياري)"
                  value={appForm.image}
                  onChange={e => setAppForm({ ...appForm, image: e.target.value })}
                  className="w-full bg-black/20 text-white rounded-lg px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none text-left" dir="ltr"
                />
                <button type="submit" className="w-full py-2.5 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-lg transition shadow-lg flex justify-center items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} /> إضافة التطبيق
                </button>
              </form>
            </div>

            {/* Applications List */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-4">التطبيقات الحالية ({applications.length})</h3>
              {applications.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                  <FontAwesomeIcon icon={faLaptopCode} className="text-white/20 text-5xl mb-4" />
                  <p className="text-white/50">لا توجد تطبيقات حالياً. أضف أول تطبيق.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {applications.map(app => {
                    const levelLabels = { Beginner: "مبتدئ", Intermediate: "متوسط", Advanced: "متقدم" };
                    const levelColors = {
                      Beginner: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                      Intermediate: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                      Advanced: "bg-rose-500/20 text-rose-300 border-rose-500/30",
                    };
                    return (
                      <div key={app.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 group relative flex flex-col gap-2 hover:border-violet-400/30 transition">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border mb-1 ${levelColors[app.level] || levelColors.Beginner}`}>
                              {levelLabels[app.level] || app.level}
                            </span>
                            <h4 className="text-white font-bold line-clamp-1">{app.title}</h4>
                            <p className="text-white/50 text-xs line-clamp-2 mt-1">{app.description}</p>
                          </div>
                          {app.image && (
                            <img src={app.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10" />
                          )}
                        </div>
                        {app.link && (
                          <a href={app.link} target="_blank" rel="noopener noreferrer" className="text-sky-400 text-xs hover:underline truncate" dir="ltr">
                            {app.link}
                          </a>
                        )}
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleOpenEdit(app)}
                            className="flex-1 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/40 border border-violet-400/30 text-violet-200 text-sm font-semibold transition flex items-center justify-center gap-1"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} className="text-xs" /> تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteApplication(app.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-400/30 text-red-300 transition"
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Edit Modal */}
            {editingApp && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" dir="rtl">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingApp(null)} />
                <div className="relative z-10 bg-[#1e293b] border border-white/20 rounded-3xl p-8 w-full max-w-md shadow-2xl">
                  <button onClick={() => setEditingApp(null)} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/5 text-white/50 hover:text-white flex items-center justify-center transition">
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                  <h3 className="text-xl font-bold text-white mb-6">تعديل التطبيق</h3>
                  <form onSubmit={handleSaveEdit} className="space-y-3">
                    <input
                      required type="text" placeholder="عنوان التطبيق"
                      value={editForm.title}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full bg-black/30 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none"
                    />
                    <textarea
                      placeholder="وصف التطبيق"
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      rows="3"
                      className="w-full bg-black/30 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none resize-none"
                    />
                    <select
                      required
                      value={editForm.categoryId}
                      onChange={e => setEditForm({ ...editForm, categoryId: e.target.value })}
                      className="w-full bg-black/30 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none"
                    >
                      <option value="" disabled className="bg-gray-800">اختر الفئة</option>
                      {categories.map(c => <option key={c.id} value={c.id} className="bg-gray-800">{c.name}</option>)}
                    </select>
                    <select
                      value={editForm.level}
                      onChange={e => setEditForm({ ...editForm, level: e.target.value })}
                      className="w-full bg-black/30 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none"
                    >
                      <option value="Beginner" className="bg-gray-800">مبتدئ</option>
                      <option value="Intermediate" className="bg-gray-800">متوسط</option>
                      <option value="Advanced" className="bg-gray-800">متقدم</option>
                    </select>
                    <input
                      type="url" placeholder="رابط المشروع (اختياري)"
                      value={editForm.link}
                      onChange={e => setEditForm({ ...editForm, link: e.target.value })}
                      className="w-full bg-black/30 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none text-left" dir="ltr"
                    />
                    <input
                      type="url" placeholder="رابط الصورة (اختياري)"
                      value={editForm.image}
                      onChange={e => setEditForm({ ...editForm, image: e.target.value })}
                      className="w-full bg-black/30 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:border-violet-400 outline-none text-left" dir="ltr"
                    />
                    <div className="flex gap-3 pt-2">
                      <button type="submit" className="flex-1 py-3 bg-violet-500 hover:bg-violet-400 text-white font-bold rounded-xl transition">
                        حفظ التعديلات
                      </button>
                      <button type="button" onClick={() => setEditingApp(null)} className="w-1/3 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition">
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

// UI Helpers
const StatCard = ({ title, count, icon, color }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex items-center justify-between relative overflow-hidden group">
    <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
    <div>
      <p className="text-sky-200 font-semibold mb-1">{title}</p>
      <h3 className="text-4xl font-black text-white">{count}</h3>
    </div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg`}>
      <FontAwesomeIcon icon={icon} className="text-white text-2xl" />
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
      active 
      ? 'bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]' 
      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
    }`}
  >
    <FontAwesomeIcon icon={icon} /> {label}
  </button>
);

export default AdminPage;
