// VORTEX ERP — Dashboard. Exposes window.DashboardScreen
(function () {
const { StatCard, Card, CardHeader, Badge, Table, Icon } = window.VORTEXERPDesignSystem_6c8a4b;

function DashboardScreen({ onNavigate }) {
  const D = window.VORTEX_DATA, fmt = window.VORTEX_FMT, date = window.VORTEX_DATE;
  const receita = D.contas.filter(c => c.tipo === 'receita').reduce((s, c) => s + c.valor, 0);
  const recentes = D.vendas.slice(0, 5);

  const statusBadge = (s) => {
    const map = {
      aberto: ['primary', 'Aberto'], em_andamento: ['warning', 'Em andamento'],
      concluido: ['success', 'Concluído'], cancelado: ['danger', 'Cancelado'],
    };
    const [tone, label] = map[s];
    return <Badge tone={tone}>{label}</Badge>;
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1>Bom dia, Ana 👋</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>Resumo da operação — 07 de junho de 2026</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard icon={<Icon name="users" size={24} />} value={D.clientes.length} label="Clientes ativos" tone="primary" delta="+2 esta semana" />
        <StatCard icon={<Icon name="package" size={24} />} value={D.produtos.length} label="Produtos" tone="neutral" />
        <StatCard icon={<Icon name="cart" size={24} />} value={D.vendas.length} label="Vendas no mês" tone="warning" />
        <StatCard icon={<Icon name="trendingUp" size={24} />} value={fmt(receita)} label="Receita" tone="success" delta="+18%" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        <Card padding="0">
          <div style={{ padding: '16px 20px 0' }}>
            <CardHeader title="Vendas recentes" subtitle="Últimos pedidos registrados"
              actions={<a href="#" onClick={(e) => { e.preventDefault(); onNavigate('vendas'); }} style={{ fontSize: 'var(--text-sm)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>Ver quadro <Icon name="arrowRight" size={14} /></a>} />
          </div>
          <Table
            columns={[
              { key: 'id', header: 'Pedido', render: r => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-strong)' }}>#{r.id}</span> },
              { key: 'cliente', header: 'Cliente', render: r => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.cliente}</strong> },
              { key: 'status', header: 'Status', render: r => statusBadge(r.status) },
              { key: 'total', header: 'Total', align: 'right', render: r => <span style={{ fontWeight: 700, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{fmt(r.total)}</span> },
            ]}
            data={recentes}
          />
        </Card>

        <Card>
          <CardHeader title="Acesso rápido" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              ['clientes', 'users', 'Gerenciar clientes'],
              ['estoque', 'package', 'Controlar estoque'],
              ['vendas', 'cart', 'Quadro de vendas'],
              ['financeiro', 'wallet', 'Contas financeiras'],
            ].map(([key, icon, label]) => (
              <button key={key} onClick={() => onNavigate(key)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--surface-card)', cursor: 'pointer', textAlign: 'left', transition: 'all .15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary-tint)'; e.currentTarget.style.borderColor = 'var(--color-primary-tint)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-card)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}>
                <span style={{ color: 'var(--color-primary)', display: 'flex' }}><Icon name={icon} size={18} /></span>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--text-body)' }}>{label}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--slate-400)', display: 'flex' }}><Icon name="chevronRight" size={16} /></span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
})();
