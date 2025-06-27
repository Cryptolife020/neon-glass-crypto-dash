import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Credenciais pré-definidas
  const VALID_EMAIL = "superadmin@gmail.com";
  const VALID_PASSWORD = "82014278";
  const USER_NAME = "Daniel";

  useEffect(() => {
    // Verificar se o usuário já está logado
    const savedAuth = localStorage.getItem("crypto-auth");
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUser(authData.user);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const userData = { email: VALID_EMAIL, name: USER_NAME };
      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem("crypto-auth", JSON.stringify({ user: userData }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("crypto-auth");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout }}
      data-oid="3xy:2ir"
    >
      {children}
    </AuthContext.Provider>
  );
};
