import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import CreateTeamTest from "./pages/manager/CreateTeamTest";
import CreateProject from "./pages/manager/CreateProject";
import AssignTask from "./pages/manager/AssignTask";
import TrackProgress from "./pages/manager/TrackProgress";
import ProjectsList from "./pages/manager/ProjectsList";
import TasksList from "./pages/manager/TasksList";
import TeamsList from "./pages/manager/TeamsList";

import MemberDashboard from "./pages/member/MemberDashboard";
import DashboardLayout from "./components/DashboardLayout";

import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= MANAGER ROUTES ================= */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute>
                <RoleRoute role="MANAGER">
                  <DashboardLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            {/* DEFAULT DASHBOARD */}
            <Route index element={<ManagerDashboard />} />

            {/* SIDEBAR PAGES */}
            <Route path="teams" element={<TeamsList />} />
            <Route path="projects" element={<ProjectsList />} />
            <Route path="tasks" element={<TasksList />} />
            <Route path="reports" element={<TrackProgress />} />

            {/* ACTION PAGES */}
            <Route path="create-team" element={<CreateTeamTest />} />
            <Route path="create-project" element={<CreateProject />} />
            <Route path="assign-task" element={<AssignTask />} />
          </Route>

          {/* ================= MEMBER ROUTES ================= */}
          <Route
            path="/member"
            element={
              <ProtectedRoute>
                <RoleRoute role="MEMBER">
                  <DashboardLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route index element={<MemberDashboard />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
