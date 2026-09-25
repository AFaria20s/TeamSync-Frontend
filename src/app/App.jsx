import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import AthletesPage from "../pages/AthletesPage";
import CompetitionsPage from "../pages/CompetitionsPage";
import ResourcePage from "../pages/ResourcePage";
import TeamSettingsPage from "../pages/TeamSettingsPage";
import HomePage from "../pages/HomePage";

function ProtectedRoutes() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <AppLayout />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/athletes" element={<AthletesPage />} />
        <Route path="/competitions" element={<CompetitionsPage />} />
        <Route
          path="/staff"
          element={
            <ResourcePage
              resource="staff"
              title="Equipa técnica"
              singular="membro"
            />
          }
        />
        <Route
          path="/sponsors"
          element={
            <ResourcePage
              resource="sponsors"
              title="Sponsors"
              singular="sponsor"
            />
          }
        />
        <Route
          path="/disciplines"
          element={
            <ResourcePage
              resource="disciplines"
              title="Disciplines"
              singular="discipline"
            />
          }
        />
        <Route
          path="/roles"
          element={
            <ResourcePage
              resource="staffroles"
              title="Staff roles"
              singular="role"
            />
          }
        />
        <Route
          path="/addresses"
          element={
            <ResourcePage
              resource="addresses"
              title="Addresses"
              singular="address"
            />
          }
        />
        <Route path="/settings" element={<TeamSettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
