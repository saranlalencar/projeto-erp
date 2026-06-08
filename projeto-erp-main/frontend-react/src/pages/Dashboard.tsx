import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { StatCard, Card, CardHeader, Badge, Table, Icon } from '../design-system/components';

const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const STATUS: Record<string, ['primary' | 'warning' | 'success' | 'danger', string]> = {
  aberto:       ['primary', 'Aberto'],
  em_andamento: ['warning', 'Em andamento'],
  concluido:    ['success', 'Concluído'],
  cancelado:    ['danger', 'Cancelado'],
};

interface Venda { id: number; status: string; total: number; cliente: { nome: string } | null; }

export function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ clientes: 0, produtos: 0, vendas: 0, receita: 0 });
  const [recentes, setRecentes] = useState<Venda[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [clientes, produtos, vendas, contas] = await Promise.all([
          api.get<unknown[]>('/api/clientes'),
          api.get<unknown[]>('/api/estoque'),
          api.get<Venda[]>('/api/vendas'),
          api.get<{ valor: number; tipo: string }[]>('/api/financeiro'),
        ]);
        const receita = contas
          .filter((c) => c.tipo === 'receita')
          .reduce((s, c) => s + c.valor, 0);
        setMetrics({ clientes: clientes.length, produtos: produtos.length, vendas: vendas.length, receita });
        setRecentes(vendas.slice(0, 5));
      } catch { /* keep zeros */ }
    })();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1>Visão geral</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>Resumo da operação</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={<Icon name="users" size={24} />} value={metrics.clientes} label="Clientes" tone="primary" />
        <StatCard icon={<Icon name="package" size={24} />} value={metrics.produtos} label="Produtos" tone="neutral" />
        <StatCard icon={<Icon name="cart" size={24} />} value={metrics.vendas} label="Vendas" tone="warning" />
        <StatCard icon={<Icon name="trendingUp" size={24} />} value={fmt(metrics.receita)} label="Receita" tone="success" />
      </div>

      <Card padding="0">
        <div style={{ padding: '16px 20px 0' }}>
          <CardHeader
            title="Vendas recentes"
            subtitle="Últimos pedidos registrados"
            actions={
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/vendas'); }}
                style={{ fontSize: 'var(--text-sm)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Ver quadro <Icon name="arrowRight" size={14} />
              </a>
            }
          />
        </div>
        <Table
          rowKey="id"
          data={recentes}
          empty="Nenhuma venda registrada."
          columns={[
            { key: 'id', header: 'Pedido', render: (r: Venda) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-strong)' }}>#{r.id}</span> },
            { key: 'cliente', header: 'Cliente', render: (r: Venda) => { const nome = r.cliente?.nome ?? '—'; return <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{nome}</strong>; } },
            { key: 'status', header: 'Status', render: (r: Venda) => { const [t, l] = STATUS[r.status] ?? STATUS.aberto; return <Badge tone={t}>{l}</Badge>; } },
            { key: 'total', header: 'Total', align: 'right', render: (r: Venda) => <span style={{ fontWeight: 700, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{fmt(r.total)}</span> },
          ]}
        />
      </Card>
    </div>
  );
}
