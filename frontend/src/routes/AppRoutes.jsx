import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import Skills from "../pages/skills/Skills";
import Interests from "../pages/interests/Interests";

import Projects from "../pages/projects/Projects";
import Collaboration from "../pages/collaboration/Collaboration";
import Students from "../pages/students/Students";

import Notifications from "../pages/notifications/Notifications";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ==========================================
          PUBLIC ROUTES
      ========================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ==========================================
          PROTECTED ROUTES
      ========================================== */}

      <Route element={<ProtectedRoute />}>

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* Profile */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* Skills */}

        <Route
          path="/skills"
          element={<Skills />}
        />


        {/* Interests */}

        <Route
          path="/interests"
          element={<Interests />}
        />


        {/* Projects */}

        <Route
          path="/projects"
          element={<Projects />}
        />


        {/* Collaboration */}

        <Route
          path="/collaboration"
          element={<Collaboration />}
        />


        {/* Students */}

        <Route
          path="/students"
          element={<Students />}
        />


        {/* Notifications */}

        <Route
          path="/notifications"
          element={<Notifications />}
        />

      </Route>


      {/* ==========================================
          UNKNOWN ROUTE
      ========================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;