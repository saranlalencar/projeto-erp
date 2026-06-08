import { useNavigate } from 'react-router-dom';

export function SemPermissao() {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🚫</div>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827', marginBottom: 8 }}>
        Acesso negado
      </h1>
      <p style={{ color: '#6b7280', marginBottom: 28 }}>
        Você não tem permissão para acessar esta página.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '10px 22px', background: '#4f46e5', color: '#fff', border: 'none',
          borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
        }}
      >
        Voltar ao início
      </button>
    </div>
  );
}
