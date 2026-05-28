import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  children: React.ReactNode;
  module?: string;
  action?: string;
}

/** Bloqueia rotas por autenticação e por role/permissão */
export function ProtectedRoute({ children, module, action }: Props) {
  const { user, loading, can } = useAuth();

  if (loading) return <div style={{ padding: 32 }}>Carregando...</div>;
  if (!user)   return <Navigate to="/login" replace />;
  if (module && action && !can(module, action)) return <Navigate to="/sem-permissao" replace />;

  return <>{children}</>;
}
