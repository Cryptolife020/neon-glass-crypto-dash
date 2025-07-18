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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const profile = await authService.getUserProfile(currentUser.id);
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
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await authService.getUserProfile(session.user.id);
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
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Iniciando processo de login para:', email);
      setLoading(true);
      const { data, error } = await authService.signIn(email, password);

      if (error) {
        console.error('Erro na autenticação:', error);
        // Garantir que o loading seja desativado antes de retornar o erro
        setLoading(false);
        return { success: false, error: error.message };
      }

      console.log('Autenticação bem-sucedida, verificando perfil do usuário');

      if (data.user) {
        console.log('ID do usuário autenticado:', data.user.id);
        const profile = await authService.getUserProfile(data.user.id);

        if (profile) {
          console.log('Perfil encontrado:', profile);
          const userData: User = {
            id: profile.id,
            email: profile.email,
            name: profile.name,
            roles: profile.roles
          };
          console.log('Dados do usuário definidos:', userData);
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(profile.roles === 'admin');
          console.log('Usuário autenticado com sucesso, isAdmin:', profile.roles === 'admin');
          return { success: true };
        } else {
          console.error('Perfil não encontrado para o usuário:', data.user.id);
          // Garantir que o loading seja desativado antes de retornar o erro
          setLoading(false);
          return { success: false, error: 'Perfil não encontrado. Entre em contato com o administrador.' };
        }
      } else {
        console.error('Dados do usuário não disponíveis após autenticação');
        // Garantir que o loading seja desativado antes de retornar o erro
        setLoading(false);
        return { success: false, error: 'Dados do usuário não disponíveis. Tente novamente.' };
      }
    } catch (error: any) {
      console.error('Exceção durante o login:', error);
      // Garantir que o loading seja desativado antes de retornar o erro
      setLoading(false);
      return { success: false, error: error?.message || 'Falha no login. Tente novamente mais tarde.' };
    } finally {
      setLoading(false);
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