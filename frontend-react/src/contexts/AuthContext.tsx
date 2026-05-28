import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  can: (module: string, action: string) => boolean;
}

const PERMISSIONS: Record<Role, Record<string, string[]>> = {
  admin: {
    users:     ['view', 'create', 'edit', 'delete', 'block'],
    clientes:  ['view', 'create', 'edit', 'delete'],
    estoque:   ['view', 'create', 'edit', 'delete'],
    vendas:    ['view', 'create', 'edit', 'delete'],
    financeiro:['view', 'create', 'edit', 'delete'],
  },
  manager: {
    users:     ['view', 'create', 'edit'],
    clientes:  ['view', 'create', 'edit'],
    estoque:   ['view', 'create', 'edit'],
    vendas:    ['view', 'create', 'edit'],
    financeiro:['view', 'create', 'edit'],
  },
  user: {
    clientes:  ['view'],
    estoque:   ['view'],
    vendas:    ['view', 'create'],
    financeiro:['view'],
  },
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sessão ao carregar
  useEffect(() => {
    const stored = localStorage.getItem('vortex_user');
    const token  = localStorage.getItem('vortex_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    try {
      const data = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
      localStorage.setItem('vortex_token', data.token);
      localStorage.setItem('vortex_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err: unknown) {
      const e = err as { error?: string; status?: number };
      if (e.status === 423) return { success: false, error: 'conta_bloqueada' };
      return { success: false, error: e.error || 'credenciais_invalidas' };
    }
  }

  function logout() {
    localStorage.removeItem('vortex_token');
    localStorage.removeItem('vortex_user');
    setUser(null);
  }

  function can(module: string, action: string): boolean {
    if (!user) return false;
    const perms = PERMISSIONS[user.role]?.[module] ?? [];
    return perms.includes(action);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can }}>
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
