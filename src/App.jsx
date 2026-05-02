import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminRoute from "./components/AdminRoute";
import GlobalLoader from "./components/GlobalLoader";
import MainLayout from "./components/MainLayout";

// ── Eager (tiny, needed immediately) ─────────────────────────────────────────
import Landing from "./pages/Landing";

// ── Lazy pages ────────────────────────────────────────────────────────────────
const Login           = lazy(() => import("./auth/Login"));
const Register        = lazy(() => import("./auth/Register"));
const ForgotPassword  = lazy(() => import("./auth/ForgotPassword"));
const VerifyEmail     = lazy(() => import("./pages/VerifyEmail"));
const TermsPage       = lazy(() => import("./pages/TermsPage"));
const PrivacyPage     = lazy(() => import("./pages/PrivacyPage"));
const Onboarding      = lazy(() => import("./pages/Onboarding"));
const Dashboard       = lazy(() => import("./pages/Dashboard"));
const RoadmapsPage    = lazy(() => import("./pages/RoadmapsPage"));
const RoadmapLearning = lazy(() => import("./pages/RoadmapLearning"));
const ResourcesPage   = lazy(() => import("./pages/ResourcesPage"));
const ApplicationsPage = lazy(() => import("./pages/ApplicationsPage"));
const Settings        = lazy(() => import("./pages/Settings"));
const AdminPage       = lazy(() => import("./pages/Admin/AdminPage"));
const NotFound        = lazy(() => import("./pages/NotFound"));

// ── Fallback loader (lightweight) ────────────────────────────────────────────
const PageSpinner = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full" />
      <div className="absolute inset-0 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <GlobalLoader />
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          {/* Public */}
          <Route path="/"               element={<Landing />} />
          <Route path="/login"          element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register"       element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
          <Route path="/verify-email"   element={<VerifyEmail />} />
          <Route path="/terms"          element={<TermsPage />} />
          <Route path="/privacy"        element={<PrivacyPage />} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

          {/* Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout backgroundType="dashboard"><Dashboard /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Roadmaps */}
          <Route path="/roadmaps" element={
            <ProtectedRoute>
              <MainLayout backgroundType="learningPath"><RoadmapsPage /></MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/roadmap/:roadmapId" element={
            <ProtectedRoute>
              <MainLayout backgroundType="learningPath" hideSidebar={true}><RoadmapLearning /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Resources */}
          <Route path="/resources" element={
            <ProtectedRoute>
              <MainLayout backgroundType="dashboard"><ResourcesPage /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Applications */}
          <Route path="/applications" element={
            <ProtectedRoute>
              <MainLayout backgroundType="learningPath"><ApplicationsPage /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Settings */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <MainLayout backgroundType="dashboard"><Settings /></MainLayout>
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
