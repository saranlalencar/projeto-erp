import { useState, useEffect } from 'react';
import { api } from '../api/client';

type StatusVenda = 'aberto' | 'em_andamento' | 'concluido' | 'cancelado';

interface Venda {
  id: number;
  status: StatusVenda;
  total: number;
  createdAt: string;
  cliente: { id: number; nome: string; email: string };
  funcionario: { id: number; nome: string } | null;
  itens: { id: number; quantidade: number; precoUnit: number; produto: { nome: string } }[];
}

const COLUNAS: { key: StatusVenda; label: string; cor: string; bg: string }[] = [
  { key: 'aberto',       label: '📋 Aberto',        cor: '#1e40af', bg: '#dbeafe' },
  { key: 'em_andamento', label: '⚙️ Em Andamento',  cor: '#92400e', bg: '#fef3c7' },
  { key: 'concluido',    label: '✅ Concluído',      cor: '#065f46', bg: '#d1fae5' },
  { key: 'cancelado',    label: '❌ Cancelado',      cor: '#991b1b', bg: '#fee2e2' },
];

export function Vendas() {
  const [vendas, setVendas]       = useState<Venda[]>([]);
  const [loading, setLoading]     = useState(true);
  const [detalhe, setDetalhe]     = useState<Venda | null>(null);
  const [movendo, setMovendo]     = useState<number | null>(null);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try {
      const data = await api.get<Venda[]>('/api/vendas');
      setVendas(data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function moverStatus(venda: Venda, novoStatus: StatusVenda) {
    setMovendo(venda.id);
    try {
      await api.patch(`/api/vendas/${venda.id}/status`, { status: novoStatus });
      setVendas(prev => prev.map(v => v.id === venda.id ? { ...v, status: novoStatus } : v));
    } catch { alert('Erro ao mover venda.'); }
    setMovendo(null);
  }

  const vendasPorStatus = (status: StatusVenda) => vendas.filter(v => v.status === status);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111827', margin: 0 }}>🛒 Vendas — Kanban</h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 4 }}>
          {vendas.length} venda(s) no total
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>Carregando vendas...</div>
      ) : (
        /* ── Quadro Kanban ── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
          {COLUNAS.map(col => (
            <div key={col.key} style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              {/* Cabeçalho da coluna */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e7eb', background: col.bg }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: col.cor }}>{col.label}</span>
                <span style={{ marginLeft: 8, background: col.cor, color: '#fff', borderRadius: 99, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
                  {vendasPorStatus(col.key).length}
                </span>
              </div>

              {/* Cards de vendas */}
              <div style={{ padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 80 }}>
                {vendasPorStatus(col.key).length === 0 ? (
                  <div style={{ color: '#d1d5db', textAlign: 'center', padding: '16px 0', fontSize: '0.8rem' }}>
                    Nenhuma venda
                  </div>
                ) : (
                  vendasPorStatus(col.key).map(v => (
                    <div key={v.id} style={{
                      background: '#f9fafb', borderRadius: 8, padding: '12px',
                      border: '1px solid #e5e7eb', cursor: 'pointer',
                      opacity: movendo === v.id ? 0.5 : 1, transition: 'all .15s',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827' }}>#{v.id}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#4f46e5' }}>
                          R$ {v.total.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#374151', marginBottom: 2 }}>👥 {v.cliente.nome}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: 10 }}>
                        {new Date(v.createdAt).toLocaleDateString('pt-BR')}
                        {v.funcionario && ` · ${v.funcionario.nome}`}
                      </div>

                      {/* Ações de mover */}
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <button onClick={() => setDetalhe(v)} style={btnMicro('#6b7280')}>Ver</button>
                        {COLUNAS.filter(c => c.key !== col.key).map(c => (
                          <button key={c.key} onClick={() => moverStatus(v, c.key)} style={btnMicro(c.cor)}
                            disabled={movendo === v.id}>
                            → {c.label.split(' ')[1] ?? c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal detalhe da venda */}
      {detalhe && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '28px', width: 480, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🛒 Venda #{detalhe.id}</h2>
              <button onClick={() => setDetalhe(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 20, fontSize: '0.875rem' }}>
              <div><span style={{ color: '#6b7280' }}>Cliente:</span> <strong>{detalhe.cliente.nome}</strong></div>
              <div><span style={{ color: '#6b7280' }}>Status:</span> <strong>{detalhe.status.replace('_', ' ')}</strong></div>
              <div><span style={{ color: '#6b7280' }}>Funcionário:</span> {detalhe.funcionario?.nome ?? '—'}</div>
              <div><span style={{ color: '#6b7280' }}>Data:</span> {new Date(detalhe.createdAt).toLocaleDateString('pt-BR')}</div>
            </div>

            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 10, color: '#374151' }}>Itens</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Produto', 'Qtd', 'Preço unit.', 'Subtotal'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: '0.75rem', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detalhe.itens.map(it => (
                  <tr key={it.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '8px 10px' }}>{it.produto.nome}</td>
                    <td style={{ padding: '8px 10px' }}>{it.quantidade}</td>
                    <td style={{ padding: '8px 10px' }}>R$ {it.precoUnit.toFixed(2).replace('.', ',')}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 600 }}>R$ {(it.quantidade * it.precoUnit).toFixed(2).replace('.', ',')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: 'right', marginTop: 14, fontSize: '1rem', fontWeight: 700, color: '#4f46e5' }}>
              Total: R$ {detalhe.total.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnMicro = (color: string): React.CSSProperties => ({
  padding: '3px 8px', background: color, color: '#fff', border: 'none',
  borderRadius: 5, cursor: 'pointer', fontSize: '0.72rem', fontWeight: 500,
});
