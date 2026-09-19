import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ==========================================
// ADMIN ROUTE GUARD
// Redirects to /dashboard if:
//   - Not authenticated
//   - Authenticated but role !== ADMIN
// Backend still enforces the same check.
// ==========================================

const AdminRoute = () => {
    const { isAuthenticated, student } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!student || student.role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
