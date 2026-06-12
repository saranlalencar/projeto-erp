import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from './auth/AuthKit';

interface Props {
  children: React.ReactNode;
  module?: string;
  action?: string;
}

export function ProtectedRoute({ children, module, action }: Props) {
  const { user, loading, can } = useAuth();

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-page)',
    }}>
      <Spinner size={36} color="var(--color-primary)" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  if (module && action && !can(module, action)) return <Navigate to="/sem-permissao" replace />;

  return <>{children}</>;
}
