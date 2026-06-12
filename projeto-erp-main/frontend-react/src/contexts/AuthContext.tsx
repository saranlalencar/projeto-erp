import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../api/client';

export type Role = 'admin' | 'vendedor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: string;
  avatar: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  can: (module: string, action: string) => boolean;
}

const PERMISSIONS: Record<Role, Record<string, string[]>> = {
  admin: {
    users:      ['view', 'create', 'edit', 'delete', 'block'],
    clientes:   ['view', 'create', 'edit', 'delete'],
    estoque:    ['view', 'create', 'edit', 'delete'],
    vendas:     ['view', 'create', 'edit', 'delete'],
    financeiro: ['view', 'create', 'edit', 'delete'],
  },
  vendedor: {
    clientes:   ['view', 'create'],
    estoque:    ['view'],
    vendas:     ['view', 'create'],
    financeiro: ['view'],
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Ignora eventos de recuperação de senha — não loga automaticamente
      if (event === 'PASSWORD_RECOVERY') return;

      if (session?.user) {
        const su = session.user;

        // Define usuário imediatamente a partir da sessão Supabase (sem depender do backend)
        const metaRole = su.user_metadata?.role as Role | undefined;
        setUser({
          id: su.id,
          name: (su.user_metadata?.name as string) || su.email?.split('@')[0] || 'Usuário',
          email: su.email!,
          role: metaRole ?? 'user',
          status: 'ativo',
          avatar: null,
        });
        setLoading(false);

        // Enriquece com o perfil real do backend (role, avatar etc.) em segundo plano
        api.get<User>('/auth/me')
          .then(setUser)
          .catch(() => { /* mantém dados da sessão se backend indisponível */ });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) return { success: true };
    if (error.message.includes('Email not confirmed')) return { success: false, error: 'email_nao_verificado' };
    return { success: false, error: 'credenciais_invalidas' };
  }

  function logout() {
    supabase.auth.signOut();
    setUser(null);
  }

  function can(module: string, action: string): boolean {
    if (!user) return false;
    return PERMISSIONS[user.role]?.[module]?.includes(action) ?? false;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
