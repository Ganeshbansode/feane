import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Restore user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // LOGIN (KEEP ROLE)
  const login = (userData) => {
    const name =
      userData.first_name && userData.last_name
        ? `${userData.first_name} ${userData.last_name}`
        : "";

    const userObj = {
      id: userData.id,
      email: userData.email,
      name,
      role: userData.role, // 🔥 IMPORTANT LINE
    };

    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
