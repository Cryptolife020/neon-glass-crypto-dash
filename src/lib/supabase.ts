import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  name: string
  email: string
  roles: string // Campo roles conforme definido na tabela
}

// Auth functions
export const authService = {
  // Sign in with email and password
  async signIn(email: string, password: string) {
    console.log('Tentando fazer login com:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.error('Erro no login:', error);
    } else {
      console.log('Login bem-sucedido:', data);
    }
    
    return { data, error }
  },

  // Sign up new user
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    
    // Se o registro for bem-sucedido, cria o perfil do usuário
    if (data.user) {
      await this.createProfile({
        id: data.user.id,
        name,
        email,
        roles: 'user' // Papel padrão para novos usuários
      })
    }
    
    return { data, error }
  },

  // Create user profile
  async createProfile(profile: Profile) {
    const { error } = await supabase
      .from('profile')
      .insert([profile])
    
    if (error) {
      console.error('Error creating profile:', error)
    }
    
    return { error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get user profile with role
  async getUserProfile(userId: string): Promise<Profile | null> {
    try {
      // Vamos buscar o perfil do usuário diretamente usando match
      const { data, error } = await supabase
        .from('profile')
        .select('id, name, email, roles')
        .match({ id: userId })
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      // Se não encontrou o perfil, vamos criar um com base nos dados de autenticação
      if (!data) {
        // Buscar dados do usuário autenticado
        const { data: authUser } = await supabase.auth.getUser();
        
        if (authUser && authUser.user) {
          const newProfile: Profile = {
            id: userId,
            name: authUser.user.user_metadata?.name || authUser.user.email?.split('@')[0] || 'Usuário',
            email: authUser.user.email || '',
            roles: 'user'
          };
          
          // Tentar inserir o perfil
          try {
            const { error: insertError } = await supabase
              .from('profile')
              .insert([newProfile]);
              
            if (insertError) {
              console.error('Error creating profile:', insertError);
              return null;
            }
            
            return newProfile;
          } catch (insertError) {
            console.error('Exception creating profile:', insertError);
            return null;
          }
        }
      }

      return data;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  },

  // Check if user is admin
  async isAdmin(userId: string): Promise<boolean> {
    const profile = await this.getUserProfile(userId)
    // Verifica se o usuário tem roles de admin
    return profile?.roles === 'admin'
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
  
  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }
}