import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card, Table, Button, Badge, StatCard, IconButton, Icon } from '../design-system/components';

interface Conta { id: number; descricao: string; valor: number; tipo: 'receita' | 'despesa'; pago: boolean; vencimento: string; }

const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtDate = (s: string) => { const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };

export default function Financeiro() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [filtro, setFiltro] = useState<'' | 'receita' | 'despesa'>('');

  useEffect(() => { api.get('/contas').then(setContas).catch(() => {}); }, []);

  const receitas = contas.filter((c) => c.tipo === 'receita').reduce((s, c) => s + c.valor, 0);
  const despesas = contas.filter((c) => c.tipo === 'despesa').reduce((s, c) => s + c.valor, 0);
  const saldo = receitas - despesas;
  const filtradas = contas.filter((c) => !filtro || c.tipo === filtro);

  async function togglePago(id: number) {
    setContas((prev) => prev.map((c) => (c.id === id ? { ...c, pago: !c.pago } : c)));
    await api.patch(`/contas/${id}/pagar`);   // ← your endpoint
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <h1>Financeiro</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>Contas a pagar e receber</p>
        </div>
        <Button leadingIcon={<Icon name="plus" size={17} />}>Nova Conta</Button>
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
          columns={[
            { key: 'descricao', header: 'Descrição', render: (r) => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.descricao}</strong> },
            { key: 'tipo', header: 'Tipo', render: (r) => <Badge tone={r.tipo === 'receita' ? 'success' : 'danger'}>{r.tipo === 'receita' ? 'Receita' : 'Despesa'}</Badge> },
            { key: 'valor', header: 'Valor', align: 'right', render: (r) => <span style={{ fontWeight: 700, color: r.tipo === 'receita' ? 'var(--success-text)' : 'var(--danger-text)', fontVariantNumeric: 'tabular-nums' }}>{fmt(r.valor)}</span> },
            { key: 'vencimento', header: 'Vencimento', render: (r) => <span style={{ color: 'var(--text-muted)' }}>{fmtDate(r.vencimento)}</span> },
            { key: 'status', header: 'Status', render: (r) => <Badge tone={r.pago ? 'success' : 'warning'} dot>{r.pago ? 'Pago' : 'Pendente'}</Badge> },
            { key: 'acoes', header: '', align: 'right', width: '150px', render: (r) => (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <Button size="sm" variant={r.pago ? 'secondary' : 'primary'} onClick={() => togglePago(r.id)}>{r.pago ? 'Desfazer' : 'Pagar'}</Button>
                <IconButton icon={<Icon name="edit" size={16} />} label="Editar" />
              </div>
            ) },
          ]}
        />
      </Card>
    </div>
  );
}
