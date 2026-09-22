import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// F-24: Check JWT expiry using native atob() — no additional library needed.
// The backend is the ultimate authority, but this prevents displaying a broken
// authenticated UI when the token is obviously expired.
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp is in seconds; Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
  } catch {
    // If the token is malformed, treat it as expired
    return true;
  }
};

const ProtectedRoute = () => {
  const { isAuthenticated, token } = useAuth();

  // Not logged in at all
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Token exists but has expired client-side — clear and redirect
  if (token && isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;