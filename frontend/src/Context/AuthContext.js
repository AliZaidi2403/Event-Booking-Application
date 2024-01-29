import { React, createContext, useContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userId, setUserID] = useState(null);
  const login = function (token, tokenExpiration, userId) {
    setToken(token);
    setUserID(userId);
  };
  const logout = function () {
    setToken(null);
    setUserID(null);
  };
  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Context used outside its scope");
  }
  return context;
}

export { AuthProvider, useAuth };
