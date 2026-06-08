import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card, Table, Button, Badge, StatCard, IconButton, Modal, Icon, Input } from '../design-system/components';
import { useBeforeUnload } from '../hooks/useBeforeUnload';

type TipoConta = 'receita' | 'despesa';
interface Conta { id: number; descricao: string; valor: number; tipo: TipoConta; pago: boolean; vencimento: string | null; }

const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtDate = (s: string | null) => {
  if (!s) return '—';
  const [y, m, d] = s.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
};

export function Financeiro() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [filtro, setFiltro] = useState<'' | TipoConta>('');
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Conta | null>(null);
  const [form, setForm] = useState({ descricao: '', valor: '', tipo: 'receita' as TipoConta, vencimento: '' });
  const [salvando, setSalvando] = useState(false);

  useBeforeUnload(showForm && (!!form.descricao || !!form.valor));

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try { setContas(await api.get<Conta[]>('/api/financeiro')); } catch { /* silent */ }
  }

  const receitas = contas.filter((c) => c.tipo === 'receita').reduce((s, c) => s + c.valor, 0);
  const despesas = contas.filter((c) => c.tipo === 'despesa').reduce((s, c) => s + c.valor, 0);
  const saldo = receitas - despesas;
  const filtradas = contas.filter((c) => !filtro || c.tipo === filtro);

  function abrirNovo() {
    setEditando(null);
    setForm({ descricao: '', valor: '', tipo: 'receita', vencimento: '' });
    setShowForm(true);
  }

  function abrirEdicao(c: Conta) {
    setEditando(c);
    setForm({ descricao: c.descricao, valor: String(c.valor), tipo: c.tipo, vencimento: c.vencimento ? c.vencimento.substring(0, 10) : '' });
    setShowForm(true);
  }

  async function salvar() {
    if (!form.descricao || !form.valor) return;
    setSalvando(true);
    const body = { descricao: form.descricao, valor: Number(form.valor), tipo: form.tipo, vencimento: form.vencimento || undefined };
    try {
      if (editando) await api.put(`/api/financeiro/${editando.id}`, body);
      else          await api.post('/api/financeiro', body);
      setShowForm(false);
      await carregar();
    } catch { /* silent */ }
    setSalvando(false);
  }

  async function togglePago(c: Conta) {
    setContas((prev) => prev.map((x) => (x.id === c.id ? { ...x, pago: !x.pago } : x)));
    await api.patch(`/api/financeiro/${c.id}/pago`, { pago: !c.pago });
  }

  async function excluir(id: number) {
    if (!confirm('Excluir esta conta?')) return;
    await api.del(`/api/financeiro/${id}`);
    setContas((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <h1>Financeiro</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>Contas a pagar e receber</p>
        </div>
        <Button leadingIcon={<Icon name="plus" size={17} />} onClick={abrirNovo}>Nova Conta</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={<Icon name="trendingUp" size={24} />} value={fmt(receitas)} label="Receitas" tone="success" />
        <StatCard icon={<Icon name="wallet" size={24} />} value={fmt(despesas)} label="Despesas" tone="danger" />
        <StatCard icon={<Icon name="circleCheck" size={24} />} value={fmt(saldo)} label="Saldo do período" tone={saldo >= 0 ? 'primary' : 'warning'} />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {([['', 'Todos'], ['receita', 'Receitas'], ['despesa', 'Despesas']] as const).map(([v, l]) => (
          <button key={v} onClick={() => setFiltro(v)}
            style={{
              padding: '7px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontSize: 'var(--text-sm)', fontWeight: 600, fontFamily: 'var(--font-sans)',
              border: filtro === v ? '1px solid var(--color-primary)' : '1px solid var(--border-strong)',
              background: filtro === v ? 'var(--color-primary)' : 'var(--surface-card)',
              color: filtro === v ? '#fff' : 'var(--text-body)',
            }}>{l}</button>
        ))}
      </div>

      <Card padding="0">
        <Table
          rowKey="id"
          data={filtradas}
          empty="Nenhuma conta encontrada."
          columns={[
            { key: 'descricao', header: 'Descrição', render: (r: Conta) => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.descricao}</strong> },
            { key: 'tipo',      header: 'Tipo',       render: (r: Conta) => <Badge tone={r.tipo === 'receita' ? 'success' : 'danger'}>{r.tipo === 'receita' ? 'Receita' : 'Despesa'}</Badge> },
            { key: 'valor',     header: 'Valor',      align: 'right', render: (r: Conta) => <span style={{ fontWeight: 700, color: r.tipo === 'receita' ? 'var(--success-text)' : 'var(--danger-text)', fontVariantNumeric: 'tabular-nums' }}>{fmt(r.valor)}</span> },
            { key: 'vencimento',header: 'Vencimento', render: (r: Conta) => <span style={{ color: 'var(--text-muted)' }}>{fmtDate(r.vencimento)}</span> },
            { key: 'status',    header: 'Status',     render: (r: Conta) => <Badge tone={r.pago ? 'success' : 'warning'} dot>{r.pago ? 'Pago' : 'Pendente'}</Badge> },
            { key: 'acoes',     header: '',           align: 'right', width: '150px', render: (r: Conta) => (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <Button size="sm" variant={r.pago ? 'secondary' : 'primary'} onClick={() => togglePago(r)}>{r.pago ? 'Desfazer' : 'Pagar'}</Button>
                <IconButton icon={<Icon name="edit" size={16} />} label="Editar" onClick={() => abrirEdicao(r)} />
                <IconButton icon={<Icon name="trash" size={16} />} label="Excluir" style={{ color: 'var(--danger-text)' }} onClick={() => excluir(r.id)} />
              </div>
            ) },
          ]}
        />
      </Card>

      {showForm && (
        <Modal title={editando ? 'Editar Conta' : 'Nova Conta'} onClose={() => setShowForm(false)}
          footer={<>
            <Button variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={salvar} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Descrição *" placeholder="Ex: Pagamento de fornecedor" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
            <Input label="Valor (R$) *" type="number" placeholder="0.00" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 5, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-body)' }}>Tipo</label>
                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoConta })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)', fontFamily: 'var(--font-sans)', background: '#fff' }}>
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>
              <Input label="Vencimento" type="date" value={form.vencimento} onChange={(e) => setForm({ ...form, vencimento: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
