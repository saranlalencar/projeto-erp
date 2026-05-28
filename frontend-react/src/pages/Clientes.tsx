import { useState, useEffect, ChangeEvent } from 'react';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  cpfCnpj: string | null;
  createdAt: string;
}

export function Clientes() {
  const { can } = useAuth();
  const [clientes, setClientes]   = useState<Cliente[]>([]);
  const [busca, setBusca]         = useState('');           // busca em tempo real
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editando, setEditando]   = useState<Cliente | null>(null);
  const [form, setForm]           = useState({ nome: '', email: '', telefone: '', cpfCnpj: '' });
  const [salvando, setSalvando]   = useState(false);
  const [erro, setErro]           = useState('');

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);
    try {
      const data = await api.get<Cliente[]>('/api/clientes');
      setClientes(data);
    } catch { setErro('Erro ao carregar clientes.'); }
    finally { setLoading(false); }
  }

  // ── Busca em tempo real com useState ─────────────────────
  const clientesFiltrados = clientes.filter(c => {
    const q = busca.toLowerCase();
    return (
      c.nome.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.telefone ?? '').includes(q) ||
      (c.cpfCnpj ?? '').includes(q)
    );
  });

  function abrirNovo() {
    setEditando(null);
    setForm({ nome: '', email: '', telefone: '', cpfCnpj: '' });
    setShowForm(true);
  }

  function abrirEdicao(c: Cliente) {
    setEditando(c);
    setForm({ nome: c.nome, email: c.email, telefone: c.telefone ?? '', cpfCnpj: c.cpfCnpj ?? '' });
    setShowForm(true);
  }

  async function salvar() {
    if (!form.nome || !form.email) { setErro('Nome e e-mail são obrigatórios.'); return; }
    setSalvando(true); setErro('');
    try {
      if (editando) {
        await api.put(`/api/clientes/${editando.id}`, form);
      } else {
        await api.post('/api/clientes', form);
      }
      setShowForm(false);
      await carregar();
    } catch (e: unknown) {
      const err = e as { error?: string };
      setErro(err.error === 'email_em_uso' ? 'Este e-mail já está cadastrado.' : 'Erro ao salvar.');
    }
    setSalvando(false);
  }

  async function excluir(id: number) {
    if (!confirm('Excluir este cliente?')) return;
    try {
      await api.del(`/api/clientes/${id}`);
      setClientes(prev => prev.filter(c => c.id !== id));
    } catch { alert('Erro ao excluir cliente.'); }
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={h1}>👥 Clientes</h1>
        {can('clientes', 'create') && (
          <button onClick={abrirNovo} style={btnPrimary}>+ Novo Cliente</button>
        )}
      </div>

      {/* Busca em tempo real */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="🔍  Buscar por nome, e-mail, telefone ou CPF/CNPJ..."
          value={busca}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setBusca(e.target.value)}
          style={{ ...inputStyle, width: '100%', maxWidth: 480 }}
        />
        {busca && (
          <span style={{ marginLeft: 12, fontSize: '0.85rem', color: '#6b7280' }}>
            {clientesFiltrados.length} resultado(s)
          </span>
        )}
      </div>

      {erro && <div style={erroStyle}>{erro}</div>}

      {/* Tabela */}
      <div style={card}>
        {loading ? (
          <div style={loadingStyle}>Carregando clientes...</div>
        ) : clientesFiltrados.length === 0 ? (
          <div style={loadingStyle}>{busca ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Nome', 'E-mail', 'Telefone', 'CPF/CNPJ', 'Ações'].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={td}><strong>{c.nome}</strong></td>
                  <td style={{ ...td, color: '#6b7280' }}>{c.email}</td>
                  <td style={td}>{c.telefone ?? '—'}</td>
                  <td style={td}>{c.cpfCnpj ?? '—'}</td>
                  <td style={td}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {can('clientes', 'edit') && (
                        <button onClick={() => abrirEdicao(c)} style={btnSmall('#4f46e5')}>Editar</button>
                      )}
                      {can('clientes', 'delete') && (
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

      {/* Modal de formulário */}
      {showForm && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h2 style={{ marginBottom: 20, fontSize: '1.1rem' }}>
              {editando ? '✏️ Editar Cliente' : '➕ Novo Cliente'}
            </h2>
            {erro && <div style={erroStyle}>{erro}</div>}
            {[
              { label: 'Nome *', key: 'nome', type: 'text', placeholder: 'Nome completo ou razão social' },
              { label: 'E-mail *', key: 'email', type: 'email', placeholder: 'contato@empresa.com' },
              { label: 'Telefone', key: 'telefone', type: 'text', placeholder: '(11) 99999-9999' },
              { label: 'CPF / CNPJ', key: 'cpfCnpj', type: 'text', placeholder: '000.000.000-00' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={labelStyle}>{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  style={inputStyle}
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
    </div>
  );
}

// ── Estilos ──────────────────────────────────────────────────
const h1: React.CSSProperties = { fontSize: '1.4rem', fontWeight: 700, color: '#111827', margin: 0 };
const card: React.CSSProperties = { background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' };
const th: React.CSSProperties = { textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #e5e7eb' };
const td: React.CSSProperties = { padding: '13px 16px', fontSize: '0.875rem', color: '#111827' };
const inputStyle: React.CSSProperties = { padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 5, fontSize: '0.85rem', fontWeight: 500, color: '#374151' };
const btnPrimary: React.CSSProperties = { padding: '9px 18px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' };
const btnOutline: React.CSSProperties = { padding: '9px 18px', background: 'transparent', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' };
const btnSmall = (color: string): React.CSSProperties => ({ padding: '5px 12px', background: color, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 });
const erroStyle: React.CSSProperties = { background: '#fee2e2', color: '#991b1b', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', marginBottom: 14 };
const loadingStyle: React.CSSProperties = { textAlign: 'center', padding: 32, color: '#9ca3af', fontSize: '0.875rem' };
const modalOverlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalBox: React.CSSProperties = { background: '#fff', borderRadius: 12, padding: '32px 28px', width: 440, maxHeight: '90vh', overflowY: 'auto' };
