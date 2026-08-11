import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [student, setStudent] = useState(() => {
    const storedStudent = localStorage.getItem("student");

    try {
      return storedStudent ? JSON.parse(storedStudent) : null;
    } catch {
      return null;
    }
  });

  const login = (newToken, studentData) => {
    localStorage.setItem("token", newToken);

    localStorage.setItem(
      "student",
      JSON.stringify(studentData)
    );

    setToken(newToken);
    setStudent(studentData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student");

    setToken(null);
    setStudent(null);
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        student,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};