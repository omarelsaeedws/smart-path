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
    fixed inset-y-0 right-0 z-50 w-72 bg-white/10 backdrop-blur-2xl border-l border-white/10 shadow-2xl transition-transform duration-500 ease-in-out flex flex-col
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
        <div className="flex items-center justify-between p-8 border-b border-white/10">
          <div className="flex items-center gap-4">
            <img src="../public/logo.png" alt="logo" />
          </div>
          <button
            className="lg:hidden text-white/50 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
            onClick={() => setIsMobileOpen(false)}
          >
            <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2 no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] border border-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`w-5 h-5 transition-transform duration-300 ${isActive ? "text-sky-400 scale-110" : "text-white/40 group-hover:scale-110 group-hover:text-sky-300"}`}
                />
                <span className="tracking-wide">{item.name}</span>
                {isActive && (
                  <span className="absolute left-2 w-1.5 h-8 bg-sky-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-6 border-t border-white/10 mt-auto">
          {currentUser && (
            <div className="flex items-center gap-3 mb-6 px-4">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-white shadow-inner shrink-0 text-lg">
                {userProfile?.displayName
                  ? userProfile.displayName.charAt(0).toUpperCase()
                  : currentUser?.displayName
                  ? currentUser.displayName.charAt(0).toUpperCase()
                  : currentUser?.email
                  ? currentUser.email.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-bold text-sm truncate">
                  {userProfile?.displayName || currentUser?.displayName || "مستخدم SmartPath"}
                </p>
                <p className="text-white/50 text-xs truncate">{currentUser?.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-4 px-6 py-4 rounded-2xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group font-bold border border-transparent hover:border-red-500/20"
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            />
            <span className="tracking-wide">تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
