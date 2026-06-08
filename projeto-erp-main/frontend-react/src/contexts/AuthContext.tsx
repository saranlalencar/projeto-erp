import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../api/client';

export type Role = 'admin' | 'manager' | 'user';

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
  manager: {
    users:      ['view', 'create', 'edit'],
    clientes:   ['view', 'create', 'edit'],
    estoque:    ['view', 'create', 'edit'],
    vendas:     ['view', 'create', 'edit'],
    financeiro: ['view', 'create', 'edit'],
  },
  user: {
    clientes:   ['view'],
    estoque:    ['view'],
    vendas:     ['view', 'create'],
    financeiro: ['view'],
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function carregarPerfil() {
    try {
      const perfil = await api.get<User>('/auth/me');
      setUser(perfil);
    } catch {
      setUser(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) carregarPerfil();
      else setLoading(false);
    });

    // Ouvir mudanças de auth (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event !== 'PASSWORD_RECOVERY') carregarPerfil();
      else if (!session) { setUser(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) return { success: true };

    if (error.message.includes('Email not confirmed')) return { success: false, error: 'email_nao_verificado' };
    if (error.message.includes('Invalid login credentials')) return { success: false, error: 'credenciais_invalidas' };
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
