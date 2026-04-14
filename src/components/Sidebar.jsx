import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faRoad,
  faGear,
  faRightFromBracket,
  faXmark,
  faTools,
  faShieldHalved,
  faLaptopCode,
} from "@fortawesome/free-solid-svg-icons";
import { ThemeToggle } from "./ThemeToggle";

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navItems = [
    { name: "لوحة التحكم", path: "/dashboard", icon: faHouse },
    { name: "مسارات التعلم", path: "/roadmaps", icon: faRoad },
    { name: "الأدوات", path: "/resources", icon: faTools },
    { name: "التطبيقات العملية", path: "/applications", icon: faLaptopCode },
    { name: "الإعدادات", path: "/settings", icon: faGear },
    ...(isAdmin ? [{ name: "لوحة الإدارة", path: "/admin", icon: faShieldHalved }] : []),
  ];

  const sidebarClass = `
    fixed inset-y-0 right-0 z-50 w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700/60 shadow-xl transition-all duration-300 ease-in-out flex flex-col
    ${isMobileOpen ? "translate-x-0" : "translate-x-full"} 
    lg:translate-x-0 lg:static lg:w-72
  `;

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={sidebarClass} dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-4">
            <img src="./logo.png" alt="logo" className="w-60 block dark:hidden" />
            <img src="./logo-white.png" alt="logo" className="w-60 hidden dark:block" />
          </div>
          <div className="flex items-center gap-3">
            
            <button
              className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 ease-out"
              onClick={() => setIsMobileOpen(false)}
            >
              <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2 no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ease-out group relative ${
                  isActive
                    ? "bg-sky-50 dark:bg-sky-500/10 text-slate-900 dark:text-white border border-sky-100 dark:border-sky-500/20"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 hover:-translate-y-[0.15rem] hover:shadow-md"
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-sky-500 dark:text-sky-400 scale-110" : "text-slate-400 dark:text-slate-500 group-hover:scale-110 group-hover:text-sky-500 dark:group-hover:text-sky-400"}`}
                />
                <span className="tracking-wide">{item.name}</span>
                {isActive && (
                  <span className="absolute left-2 w-1.5 h-8 bg-sky-500 dark:bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                )}
                
              </Link>
              
            );
          })}
          
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-700/60 mt-auto">
          {currentUser && (
            <div className="flex items-center gap-3 mb-6 px-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-white shrink-0 text-lg">
                {userProfile?.displayName
                  ? userProfile.displayName.charAt(0).toUpperCase()
                  : currentUser?.displayName
                  ? currentUser.displayName.charAt(0).toUpperCase()
                  : currentUser?.email
                  ? currentUser.email.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-slate-900 dark:text-white font-bold text-sm truncate">
                  {userProfile?.displayName || currentUser?.displayName || "مستخدم SmartPath"}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs truncate">{currentUser?.email}</p>
              </div>
              
            </div>
          )}
          <div className="flex items-center gap-3 mb-6 px-4">
            <ThemeToggle className="scale-90" />
            <p className="text-slate-900 dark:text-white font-bold text-sm truncate">تغيير الوضع</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-4 px-6 py-4 rounded-2xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 ] group font-bold border border-transparent hover:border-red-500/20 hover-lift transition-all duration-300 ease-out"
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="w-5 h-5 group- - hover-lift"
            />
            <span className="tracking-wide">تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
