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
import Recommendations from "../pages/recommendations/Recommendations";
import CareerRoadmap from "../pages/career/CareerRoadmap";
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

        {/* ==========================================
            DASHBOARD
        ========================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* ==========================================
            PROFILE
        ========================================== */}

        <Route
          path="/profile"
          element={<Profile />}
        />


        {/* ==========================================
            SKILLS
        ========================================== */}

        <Route
          path="/skills"
          element={<Skills />}
        />


        {/* ==========================================
            INTERESTS
        ========================================== */}

        <Route
          path="/interests"
          element={<Interests />}
        />


        {/* ==========================================
            PROJECTS
        ========================================== */}

        <Route
          path="/projects"
          element={<Projects />}
        />


        {/* ==========================================
            COLLABORATION
        ========================================== */}

        <Route
          path="/collaboration"
          element={<Collaboration />}
        />


        {/* ==========================================
            STUDENTS
        ========================================== */}

        <Route
          path="/students"
          element={<Students />}
        />


        {/* ==========================================
            NOTIFICATIONS
        ========================================== */}

        <Route
          path="/notifications"
          element={<Notifications />}
        />


        {/* ==========================================
            AI RECOMMENDATIONS
        ========================================== */}

        <Route
          path="/recommendations"
          element={<Recommendations />}
        />
  
        <Route
          path="/career-roadmap"
          element={<CareerRoadmap />}
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