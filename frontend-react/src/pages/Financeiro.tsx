import { useState, useEffect, ChangeEvent } from 'react';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

type TipoConta = 'receita' | 'despesa';

interface Conta {
  id: number;
  descricao: string;
  valor: number;
  tipo: TipoConta;
  pago: boolean;
  vencimento: string | null;
  createdAt: string;
}

export function Financeiro() {
  const { can } = useAuth();
  const [contas, setContas]       = useState<Conta[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<'' | TipoConta>('');
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editando, setEditando]   = useState<Conta | null>(null);
  const [form, setForm]           = useState({ descricao: '', valor: '', tipo: 'receita' as TipoConta, vencimento: '' });
  const [salvando, setSalvando]   = useState(false);
  const [erro, setErro]           = useState('');

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try { setContas(await api.get<Conta[]>('/api/financeiro')); }
    catch { setErro('Erro ao carregar contas.'); }
    finally { setLoading(false); }
  }

  const filtradas = contas.filter(c => !filtroTipo || c.tipo === filtroTipo);

  function abrirNovo() {
    setEditando(null);
    setForm({ descricao: '', valor: '', tipo: 'receita', vencimento: '' });
    setShowForm(true);
  }

  function abrirEdicao(c: Conta) {
    setEditando(c);
    setForm({
      descricao: c.descricao,
      valor: String(c.valor),
      tipo: c.tipo,
      vencimento: c.vencimento ? c.vencimento.substring(0, 10) : '',
    });
    setShowForm(true);
  }

  async function salvar() {
    if (!form.descricao || !form.valor) { setErro('Descrição e valor são obrigatórios.'); return; }
    setSalvando(true); setErro('');
    const body = {
      descricao: form.descricao,
      valor: Number(form.valor),
      tipo: form.tipo,
      vencimento: form.vencimento || undefined,
    };
    try {
      if (editando) await api.put(`/api/financeiro/${editando.id}`, body);
      else          await api.post('/api/financeiro', body);
      setShowForm(false);
      await carregar();
    } catch { setErro('Erro ao salvar conta.'); }
    setSalvando(false);
  }

  async function excluir(id: number) {
    if (!confirm('Excluir esta conta?')) return;
    try { await api.del(`/api/financeiro/${id}`); setContas(prev => prev.filter(c => c.id !== id)); }
    catch { alert('Erro ao excluir conta.'); }
  }

  async function togglePago(c: Conta) {
    try {
      await api.patch(`/api/financeiro/${c.id}/pago`, { pago: !c.pago });
      setContas(prev => prev.map(x => x.id === c.id ? { ...x, pago: !x.pago } : x));
    } catch { alert('Erro ao atualizar status.'); }
  }

  const totalReceitas  = contas.filter(c => c.tipo === 'receita').reduce((s, c) => s + c.valor, 0);
  const totalDespesas  = contas.filter(c => c.tipo === 'despesa').reduce((s, c) => s + c.valor, 0);
  const saldo          = totalReceitas - totalDespesas;

  const fmt = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={h1}>💰 Financeiro</h1>
        {can('financeiro', 'create') && <button onClick={abrirNovo} style={btnPrimary}>+ Nova Conta</button>}
      </div>

      {/* Resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Receitas', value: totalReceitas, bg: '#d1fae5', color: '#065f46' },
          { label: 'Despesas', value: totalDespesas, bg: '#fee2e2', color: '#991b1b' },
          { label: 'Saldo',    value: saldo,         bg: saldo >= 0 ? '#dbeafe' : '#fef3c7', color: saldo >= 0 ? '#1e40af' : '#92400e' },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: 10, padding: '16px 20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: c.color, textTransform: 'uppercase', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: c.color }}>{fmt(c.value)}</div>
          </div>
        ))}
      </div>

      {/* Filtro */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        {(['', 'receita', 'despesa'] as const).map(t => (
          <button key={t} onClick={() => setFiltroTipo(t)}
            style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
              background: filtroTipo === t ? '#4f46e5' : '#fff', color: filtroTipo === t ? '#fff' : '#374151' }}>
            {t === '' ? 'Todos' : t === 'receita' ? 'Receitas' : 'Despesas'}
          </button>
        ))}
      </div>

      {erro && <div style={erroStyle}>{erro}</div>}

      <div style={card}>
        {loading ? <div style={loadingStyle}>Carregando...</div> :
         filtradas.length === 0 ? <div style={loadingStyle}>Nenhuma conta encontrada.</div> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Descrição', 'Tipo', 'Valor', 'Vencimento', 'Status', 'Ações'].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={td}><strong>{c.descricao}</strong></td>
                  <td style={td}>
                    <span style={{ background: c.tipo === 'receita' ? '#d1fae5' : '#fee2e2',
                      color: c.tipo === 'receita' ? '#065f46' : '#991b1b',
                      padding: '2px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600 }}>
                      {c.tipo}
                    </span>
                  </td>
                  <td style={{ ...td, fontWeight: 700, color: c.tipo === 'receita' ? '#065f46' : '#991b1b' }}>{fmt(c.valor)}</td>
                  <td style={{ ...td, color: '#6b7280' }}>
                    {c.vencimento ? new Date(c.vencimento).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td style={td}>
                    <span style={{ background: c.pago ? '#d1fae5' : '#fef3c7',
                      color: c.pago ? '#065f46' : '#92400e',
                      padding: '2px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600 }}>
                      {c.pago ? 'Pago' : 'Pendente'}
                    </span>
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {can('financeiro', 'edit') && (
                        <>
                          <button onClick={() => togglePago(c)} style={btnSmall(c.pago ? '#6b7280' : '#10b981')}>
                            {c.pago ? 'Desfazer' : '✓ Pagar'}
                          </button>
                          <button onClick={() => abrirEdicao(c)} style={btnSmall('#4f46e5')}>Editar</button>
                        </>
                      )}
                      {can('financeiro', 'delete') && (
                        <button onClick={() => excluir(c.id)} style={btnSmall('#ef4444')}>Excluir</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ marginBottom: 20, fontSize: '1.1rem' }}>
              {editando ? '✏️ Editar Conta' : '➕ Nova Conta'}
            </h2>
            {erro && <div style={erroStyle}>{erro}</div>}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Descrição *</label>
              <input type="text" placeholder="Ex: Pagamento de fornecedor" style={inputStyle}
                value={form.descricao} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, descricao: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Valor (R$) *</label>
              <input type="number" placeholder="0.00" min="0" step="0.01" style={inputStyle}
                value={form.valor} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, valor: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Tipo</label>
              <select style={{ ...inputStyle, width: '100%' }}
                value={form.tipo} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(p => ({ ...p, tipo: e.target.value as TipoConta }))}>
                <option value="receita">Receita</option>
                <option value="despesa">Despesa</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Vencimento</label>
              <input type="date" style={inputStyle}
                value={form.vencimento} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, vencimento: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => { setShowForm(false); setErro(''); }} style={btnOutline}>Cancelar</button>
              <button onClick={salvar} disabled={salvando} style={btnPrimary}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const h1: React.CSSProperties         = { fontSize: '1.4rem', fontWeight: 700, color: '#111827', margin: 0 };
const card: React.CSSProperties       = { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' };
const th: React.CSSProperties         = { textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb' };
const td: React.CSSProperties         = { padding: '13px 16px', fontSize: '0.875rem', color: '#111827' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 5, fontSize: '0.85rem', fontWeight: 500, color: '#374151' };
const btnPrimary: React.CSSProperties = { padding: '9px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' };
const btnOutline: React.CSSProperties = { padding: '9px 18px', background: 'transparent', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' };
const btnSmall = (color: string): React.CSSProperties => ({ padding: '5px 11px', background: color, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 });
const erroStyle: React.CSSProperties  = { background: '#fee2e2', color: '#991b1b', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', marginBottom: 14 };
const loadingStyle: React.CSSProperties = { textAlign: 'center', padding: 32, color: '#9ca3af', fontSize: '0.875rem' };
const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalBox: React.CSSProperties   = { background: '#fff', borderRadius: 12, padding: '32px 28px', width: 440, maxHeight: '90vh', overflowY: 'auto' };
