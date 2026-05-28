import { useState, useEffect, ChangeEvent } from 'react';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  categoria: string | null;
}

export function Estoque() {
  const { can } = useAuth();
  const [produtos, setProdutos]     = useState<Produto[]>([]);
  const [busca, setBusca]           = useState('');
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editando, setEditando]     = useState<Produto | null>(null);
  const [form, setForm]             = useState({ nome: '', preco: '', quantidade: '', categoria: '' });
  const [ajuste, setAjuste]         = useState<{ produto: Produto; delta: string } | null>(null);
  const [salvando, setSalvando]     = useState(false);
  const [erro, setErro]             = useState('');

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try { setProdutos(await api.get<Produto[]>('/api/estoque')); }
    catch { setErro('Erro ao carregar estoque.'); }
    finally { setLoading(false); }
  }

  const filtrados = produtos.filter(p => {
    const q = busca.toLowerCase();
    return p.nome.toLowerCase().includes(q) || (p.categoria ?? '').toLowerCase().includes(q);
  });

  function abrirNovo() {
    setEditando(null);
    setForm({ nome: '', preco: '', quantidade: '0', categoria: '' });
    setShowForm(true);
  }

  function abrirEdicao(p: Produto) {
    setEditando(p);
    setForm({ nome: p.nome, preco: String(p.preco), quantidade: String(p.quantidade), categoria: p.categoria ?? '' });
    setShowForm(true);
  }

  async function salvar() {
    if (!form.nome || !form.preco) { setErro('Nome e preço são obrigatórios.'); return; }
    setSalvando(true); setErro('');
    const body = { nome: form.nome, preco: Number(form.preco), quantidade: Number(form.quantidade), categoria: form.categoria || undefined };
    try {
      if (editando) await api.put(`/api/estoque/${editando.id}`, body);
      else          await api.post('/api/estoque', body);
      setShowForm(false);
      await carregar();
    } catch { setErro('Erro ao salvar produto.'); }
    setSalvando(false);
  }

  async function excluir(id: number) {
    if (!confirm('Excluir este produto?')) return;
    try { await api.del(`/api/estoque/${id}`); setProdutos(prev => prev.filter(p => p.id !== id)); }
    catch { alert('Erro ao excluir produto.'); }
  }

  async function aplicarAjuste() {
    if (!ajuste) return;
    const delta = Number(ajuste.delta);
    if (isNaN(delta) || delta === 0) { setErro('Informe um valor de ajuste válido (pode ser negativo).'); return; }
    setSalvando(true); setErro('');
    try {
      await api.patch(`/api/estoque/${ajuste.produto.id}/quantidade`, { delta });
      setAjuste(null);
      await carregar();
    } catch (e: unknown) {
      setErro((e as { error?: string }).error === 'delta_invalido' ? 'Delta inválido.' : 'Erro ao ajustar estoque.');
    }
    setSalvando(false);
  }

  const statusEstoque = (qtd: number) => {
    if (qtd === 0)  return { label: 'Sem estoque', bg: '#fee2e2', color: '#991b1b' };
    if (qtd <= 5)   return { label: 'Crítico',     bg: '#fef3c7', color: '#92400e' };
    if (qtd <= 15)  return { label: 'Baixo',       bg: '#dbeafe', color: '#1e40af' };
    return { label: 'Normal', bg: '#d1fae5', color: '#065f46' };
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={h1}>📦 Estoque</h1>
        {can('estoque', 'create') && <button onClick={abrirNovo} style={btnPrimary}>+ Novo Produto</button>}
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text" placeholder="🔍  Buscar por nome ou categoria..."
          value={busca} onChange={(e: ChangeEvent<HTMLInputElement>) => setBusca(e.target.value)}
          style={{ ...inputStyle, width: '100%', maxWidth: 440 }}
        />
      </div>

      {erro && <div style={erroStyle}>{erro}</div>}

      <div style={card}>
        {loading ? <div style={loadingStyle}>Carregando estoque...</div> :
          filtrados.length === 0 ? <div style={loadingStyle}>Nenhum produto encontrado.</div> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Produto', 'Categoria', 'Preço', 'Quantidade', 'Status', 'Ações'].map(h => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map(p => {
                  const st = statusEstoque(p.quantidade);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={td}><strong>{p.nome}</strong></td>
                      <td style={{ ...td, color: '#6b7280' }}>{p.categoria ?? '—'}</td>
                      <td style={td}>R$ {p.preco.toFixed(2).replace('.', ',')}</td>
                      <td style={{ ...td, fontWeight: 700 }}>{p.quantidade}</td>
                      <td style={td}>
                        <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600 }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {can('estoque', 'edit') && (
                            <>
                              <button onClick={() => setAjuste({ produto: p, delta: '' })} style={btnSmall('#10b981')}>Ajustar</button>
                              <button onClick={() => abrirEdicao(p)} style={btnSmall('#4f46e5')}>Editar</button>
                            </>
                          )}
                          {can('estoque', 'delete') && (
                            <button onClick={() => excluir(p.id)} style={btnSmall('#ef4444')}>Excluir</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
      </div>

      {/* Modal formulário produto */}
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ marginBottom: 20, fontSize: '1.1rem' }}>
              {editando ? '✏️ Editar Produto' : '➕ Novo Produto'}
            </h2>
            {erro && <div style={erroStyle}>{erro}</div>}
            {[
              { label: 'Nome *', key: 'nome', type: 'text', placeholder: 'Nome do produto' },
              { label: 'Preço (R$) *', key: 'preco', type: 'number', placeholder: '0.00' },
              { label: 'Quantidade inicial', key: 'quantidade', type: 'number', placeholder: '0' },
              { label: 'Categoria', key: 'categoria', type: 'text', placeholder: 'Ex: Informática' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={inputStyle} min={f.type === 'number' ? '0' : undefined} step={f.key === 'preco' ? '0.01' : '1'}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => { setShowForm(false); setErro(''); }} style={btnOutline}>Cancelar</button>
              <button onClick={salvar} disabled={salvando} style={btnPrimary}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ajuste de quantidade */}
      {ajuste && (
        <div style={modalOverlay}>
          <div style={{ ...modalBox, width: 360 }}>
            <h2 style={{ marginBottom: 8, fontSize: '1.1rem' }}>📊 Ajustar Estoque</h2>
            <p style={{ color: '#6b7280', marginBottom: 20, fontSize: '0.875rem' }}>
              <strong>{ajuste.produto.nome}</strong> — atual: <strong>{ajuste.produto.quantidade}</strong> un.
            </p>
            {erro && <div style={erroStyle}>{erro}</div>}
            <label style={labelStyle}>Quantidade a adicionar (+) ou remover (−)</label>
            <input
              type="number" placeholder="Ex: 10 ou -5"
              value={ajuste.delta}
              onChange={e => setAjuste(prev => prev ? { ...prev, delta: e.target.value } : null)}
              style={{ ...inputStyle, width: '100%' }}
            />
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: 6 }}>
              Resultado: {ajuste.produto.quantidade + (Number(ajuste.delta) || 0)} un.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => { setAjuste(null); setErro(''); }} style={btnOutline}>Cancelar</button>
              <button onClick={aplicarAjuste} disabled={salvando} style={btnPrimary}>
                {salvando ? 'Aplicando...' : 'Confirmar Ajuste'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Estilos ──────────────────────────────────────────────────
const h1: React.CSSProperties         = { fontSize: '1.4rem', fontWeight: 700, color: '#111827', margin: 0 };
const card: React.CSSProperties       = { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' };
const th: React.CSSProperties         = { textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb' };
const td: React.CSSProperties         = { padding: '13px 16px', fontSize: '0.875rem', color: '#111827' };
const inputStyle: React.CSSProperties = { padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 5, fontSize: '0.85rem', fontWeight: 500, color: '#374151' };
const btnPrimary: React.CSSProperties = { padding: '9px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' };
const btnOutline: React.CSSProperties = { padding: '9px 18px', background: 'transparent', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' };
const btnSmall = (color: string): React.CSSProperties => ({ padding: '5px 11px', background: color, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 });
const erroStyle: React.CSSProperties  = { background: '#fee2e2', color: '#991b1b', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', marginBottom: 14 };
const loadingStyle: React.CSSProperties = { textAlign: 'center', padding: 32, color: '#9ca3af', fontSize: '0.875rem' };
const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalBox: React.CSSProperties   = { background: '#fff', borderRadius: 12, padding: '32px 28px', width: 440, maxHeight: '90vh', overflowY: 'auto' };
