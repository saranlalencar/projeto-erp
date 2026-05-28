import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

interface Metricas {
  clientes: number;
  produtos: number;
  vendas: number;
  contas: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const [metricas, setMetricas] = useState<Metricas>({ clientes: 0, produtos: 0, vendas: 0, contas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregar() {
      setLoading(true);
      try {
        const [clientes, produtos, vendas, contas] = await Promise.all([
          api.get<unknown[]>('/api/clientes'),
          api.get<unknown[]>('/api/estoque'),
          api.get<unknown[]>('/api/vendas'),
          api.get<unknown[]>('/api/financeiro'),
        ]);
        setMetricas({
          clientes: clientes.length,
          produtos: produtos.length,
          vendas: vendas.length,
          contas: contas.length,
        });
      } catch { /* silent */ }
      finally { setLoading(false); }
    }
    carregar();
  }, []);

  const cards = [
    { label: 'Clientes',  value: metricas.clientes, icon: '👥', bg: '#dbeafe', color: '#1e40af' },
    { label: 'Produtos',  value: metricas.produtos,  icon: '📦', bg: '#d1fae5', color: '#065f46' },
    { label: 'Vendas',    value: metricas.vendas,    icon: '🛒', bg: '#fef3c7', color: '#92400e' },
    { label: 'Financeiro',value: metricas.contas,    icon: '💰', bg: '#ede9fe', color: '#5b21b6' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827', margin: 0 }}>
          ⚡ Vortex ERP — Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 4 }}>
          Bem-vindo, <strong>{user?.name}</strong>!
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>Carregando métricas...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {cards.map(c => (
            <div key={c.label} style={{
              background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
              padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: c.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
              }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: c.color }}>{c.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '24px 28px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#374151', marginBottom: 12 }}>🚀 Acesso rápido</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { href: '/clientes',   label: '👥 Gerenciar Clientes' },
            { href: '/estoque',    label: '📦 Controlar Estoque' },
            { href: '/vendas',     label: '🛒 Quadro de Vendas (Kanban)' },
            { href: '/financeiro', label: '💰 Contas Financeiras' },
          ].map(link => (
            <a key={link.href} href={link.href}
              style={{
                display: 'block', padding: '14px 18px', background: '#f9fafb',
                borderRadius: 8, border: '1px solid #e5e7eb', color: '#374151',
                textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem',
                transition: 'background .15s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#ede9fe')}
              onMouseOut={e => (e.currentTarget.style.background = '#f9fafb')}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
