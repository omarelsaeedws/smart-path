import { Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ForgotPassword from "./auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import RoadmapsPage from "./pages/RoadmapsPage";
import RoadmapLearning from "./pages/RoadmapLearning";
import ResourcesPage from "./pages/ResourcesPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import AdminPage from "./pages/AdminPage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import Onboarding from "./pages/Onboarding";
import VerifyEmail from "./pages/VerifyEmail";
import MainLayout from "./components/MainLayout";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AdminRoute from "./components/AdminRoute";
import GlobalLoader from "./components/GlobalLoader";

function App() {
  return (
    <AuthProvider>
      <GlobalLoader />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Onboarding — protected but no layout (full screen) */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout backgroundType="dashboard">
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Roadmaps browser */}
        <Route
          path="/roadmaps"
          element={
            <ProtectedRoute>
              <MainLayout backgroundType="learningPath">
                <RoadmapsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Roadmap learning flow */}
        <Route
          path="/roadmap/:roadmapId"
          element={
            <ProtectedRoute>
              <MainLayout backgroundType="learningPath" hideSidebar={true}>
                <RoadmapLearning />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Resources */}
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <MainLayout backgroundType="dashboard">
                <ResourcesPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Applications */}
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <MainLayout backgroundType="learningPath">
                <ApplicationsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout backgroundType="dashboard">
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
