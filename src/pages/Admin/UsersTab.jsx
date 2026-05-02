import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faUserShield,
  faBan,
  faCheckCircle,
  faTrashAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

// ── Sub-components defined OUTSIDE the parent to prevent remount on re-render ──

const StatusBadge = ({ status }) => (
  <span
    className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 w-max ${
      status === "suspended"
        ? "bg-red-100 dark:bg-red-500/30 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/30"
        : "bg-green-100 dark:bg-green-500/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/30"
    }`}
  >
    {status === "suspended" ? (
      <><FontAwesomeIcon icon={faBan} /> محظور</>
    ) : (
      <><FontAwesomeIcon icon={faCheckCircle} /> نشط</>
    )}
  </span>
);

const UserRow = ({ user, isAdmin, onToggleRole, onToggleStatus, onDeleteUser }) => (
  <tr className="border-b border-slate-100 dark:border-slate-700 hover:bg-sky-50/50 dark:hover:bg-slate-700 transition-all duration-300 ease-out">
    <td className="p-4 font-medium">{user.displayName || "بدون اسم"}</td>
    <td className="p-4 opacity-80">{user.email}</td>
    <td className="p-4">
      <StatusBadge status={user.status} />
    </td>
    <td className="p-4">
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => onToggleRole(user)}
          className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/40 border border-indigo-200 dark:border-indigo-400/30 rounded-lg text-indigo-700 dark:text-indigo-300 text-sm font-semibold hover-lift transition-all duration-300 ease-out"
        >
          {isAdmin ? "إزالة الإدارة" : "الترقية لإدارة"}
        </button>
        {isAdmin && (
          <button
            onClick={() => onToggleStatus(user)}
            className="px-3 py-1.5 bg-orange-50 dark:bg-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-500/40 border border-orange-200 dark:border-orange-400/30 rounded-lg text-orange-700 dark:text-orange-300 text-sm font-semibold hover-lift transition-all duration-300 ease-out"
          >
            {user.status === "suspended" ? "تفعيل" : "حظر"}
          </button>
        )}
        {isAdmin && (
          <button
            onClick={() => onDeleteUser(user.id)}
            className="px-3 py-1.5 bg-red-50 dark:bg-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/40 border border-red-200 dark:border-red-400/30 rounded-lg text-red-600 dark:text-red-300 hover-lift transition-all duration-300 ease-out"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        )}
      </div>
    </td>
  </tr>
);

const HEADERS = ["المستخدم", "البريد الإلكتروني", "الحالة", "الإجراءات"];

const UserTable = ({ title, icon, iconClass, list, isAdmin, onToggleRole, onToggleStatus, onDeleteUser }) => (
  <div>
    <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${iconClass}`}>
      <FontAwesomeIcon icon={icon} /> {title}
    </h3>
    <div className="overflow-x-auto bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-slate-800 dark:text-white text-right border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            {HEADERS.map((h) => (
              <th
                key={h}
                className={`p-4 font-semibold text-sky-700 dark:text-sky-200 ${h === "الإجراءات" ? "text-center" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isAdmin={isAdmin}
              onToggleRole={onToggleRole}
              onToggleStatus={onToggleStatus}
              onDeleteUser={onDeleteUser}
            />
          ))}
          {list.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400">
                لا يوجد مستخدمين.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

// ── Main export ───────────────────────────────────────────────────────────────

const UsersTab = ({ users, searchUser, setSearchUser, onToggleRole, onToggleStatus, onDeleteUser }) => {
  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.displayName?.toLowerCase().includes(searchUser.toLowerCase()),
  );

  const adminsList       = filteredUsers.filter((u) => u.role === "admin");
  const regularUsersList = filteredUsers.filter((u) => u.role !== "admin");

  const sharedHandlers = { onToggleRole, onToggleStatus, onDeleteUser };

  return (
    <div className="animate-fade-in space-y-10">
      {/* Search bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">إدارة الحسابات</h2>
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="ابحث بالبريد أو الاسم..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl py-2 px-4 pr-10 focus:outline-none focus:border-sky-400 transition-all duration-300 ease-out"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Admins */}
      <UserTable
        title="المدراء (Admins)"
        icon={faUserShield}
        iconClass="text-purple-700 dark:text-purple-300"
        list={adminsList}
        isAdmin={true}
        {...sharedHandlers}
      />

      {/* Regular users */}
      <UserTable
        title="المستخدمين العاديين"
        icon={faUsers}
        iconClass="text-sky-700 dark:text-sky-300"
        list={regularUsersList}
        isAdmin={false}
        {...sharedHandlers}
      />
    </div>
  );
};

export default UsersTab;
