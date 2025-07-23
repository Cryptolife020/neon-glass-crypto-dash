import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, Profile } from "../lib/supabase";

interface User {
  id: string;
  email: string;
  name: string;
  roles: string; // Campo roles conforme definido na tabela
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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
  // Verificar sessão inicial de forma síncrona
  const getInitialAuthState = () => {
    try {
      const authData = localStorage.getItem('crypto-pro-auth');
      if (authData) {
        const parsedData = JSON.parse(authData);
        // Verificar se há um access_token válido e não expirado
        if (parsedData.access_token && parsedData.expires_at) {
          const expiresAt = new Date(parsedData.expires_at * 1000);
          const now = new Date();
          return expiresAt > now;
        }
      }
    } catch (error) {
      console.error('Error reading auth from localStorage:', error);
    }
    return false;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAuthState());
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Verificar sessão atual
        const session = await authService.getCurrentSession();
        console.log('Current session:', session?.user?.id);

        if (session?.user && isMounted) {
          console.log('User session found, fetching profile...');
          const profile = await authService.getUserProfile(session.user.id);
          if (profile && isMounted) {
            const userData: User = {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              roles: profile.roles
            };
            setUser(userData);
            setIsAuthenticated(true);
            setIsAdmin(profile.roles === 'admin');
            console.log('User authenticated successfully:', userData);
          }
        } else {
          console.log('No user session found');
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      }
    };

    // Sempre inicializar para buscar dados do usuário se houver sessão
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (!isMounted) return;

      try {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, fetching profile...');
          const profile = await authService.getUserProfile(session.user.id);
          if (profile && isMounted) {
            const userData: User = {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              roles: profile.roles
            };
            setUser(userData);
            setIsAuthenticated(true);
            setIsAdmin(profile.roles === 'admin');
            console.log('User authenticated successfully:', userData);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Iniciando processo de login para:', email);
      const { data, error } = await authService.signIn(email, password);

      if (error) {
        console.error('Erro na autenticação:', error);
        return { success: false, error: error.message };
      }

      console.log('Autenticação bem-sucedida');
      // O onAuthStateChange vai lidar com a atualização do estado
      return { success: true };
    } catch (error: any) {
      console.error('Exceção durante o login:', error);
      return { success: false, error: error?.message || 'Falha no login. Tente novamente mais tarde.' };
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Iniciando processo de registro para:', email);
      setLoading(true);
      const { data, error } = await authService.signUp(email, password, name);

      if (error) {
        console.error('Erro no registro:', error);
        setLoading(false);
        return { success: false, error: error.message };
      }

      console.log('Registro bem-sucedido:', data);

      // Alguns provedores de autenticação exigem confirmação de email
      if (data?.user && data.user.identities?.length === 0) {
        setLoading(false);
        return { success: true, error: 'Por favor, verifique seu email para confirmar seu cadastro.' };
      }

      // Se o registro for bem-sucedido e não precisar de confirmação, faça login automaticamente
      if (data?.user) {
        const profile = await authService.getUserProfile(data.user.id);

        if (profile) {
          const userData: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            roles: profile.roles
          };

          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(profile.roles === 'admin');

          return { success: true };
        }
      }

      return { success: true, error: 'Registro concluído. Por favor, faça login.' };
    } catch (error: any) {
      console.error('Exceção durante o registro:', error);
      return { success: false, error: error?.message || 'Falha no registro. Tente novamente mais tarde.' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Iniciando processo de recuperação de senha para:', email);
      setLoading(true);

      const { error } = await authService.resetPassword(email);

      if (error) {
        console.error('Erro na recuperação de senha:', error);
        return { success: false, error: error.message };
      }

      return { success: true, error: 'Instruções de recuperação de senha foram enviadas para seu email.' };
    } catch (error: any) {
      console.error('Exceção durante a recuperação de senha:', error);
      return { success: false, error: error?.message || 'Falha na recuperação de senha. Tente novamente mais tarde.' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isAdmin, loading, login, logout, register, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};