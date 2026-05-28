import { useState, FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Já logado → redirecionar
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      const msgs: Record<string, string> = {
        credenciais_invalidas: 'E-mail ou senha incorretos.',
        conta_bloqueada: 'Conta bloqueada. Aguarde 15 minutos.',
        erro_servidor: 'Erro ao conectar com o servidor.',
        email_nao_verificado: '📧 E-mail não verificado. Verifique sua caixa de entrada e clique no código recebido antes de fazer login.',
      };
      setError(msgs[result.error ?? ''] ?? 'Erro ao fazer login.');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '40px 36px', width: 380, boxShadow: '0 4px 20px rgba(0,0,0,.08)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: 8, fontSize: '1.5rem', color: '#1e1b4b' }}>⚡ Vortex ERP</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 28, fontSize: '0.9rem' }}>Faça login para continuar</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>E-mail</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@vortex.com" required style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Senha</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required autoComplete="off" style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px',
            background: loading ? '#a5b4fc' : '#4f46e5',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: '0.95rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: '16px', background: '#f8f9fa', borderRadius: 8, fontSize: '0.8rem', color: '#6b7280' }}>
          <strong>Credenciais de teste:</strong><br />
          👤 admin@vortex.com / Admin@123<br />
          👔 gerente@vortex.com / Gerente@123
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 500, color: '#374151' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
