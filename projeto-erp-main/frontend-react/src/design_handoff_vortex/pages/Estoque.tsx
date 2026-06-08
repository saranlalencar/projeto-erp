import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card, Table, Button, Input, Badge, IconButton, Icon } from '../design-system/components';

interface Produto { id: number; nome: string; categoria: string; preco: number; quantidade: number; }

const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// Stock level → semantic badge.
function statusEstoque(q: number): ['danger' | 'warning' | 'primary' | 'success', string] {
  if (q === 0) return ['danger', 'Sem estoque'];
  if (q <= 5) return ['warning', 'Crítico'];
  if (q <= 15) return ['primary', 'Baixo'];
  return ['success', 'Normal'];
}

export default function Estoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState('');

  useEffect(() => { api.get('/produtos').then(setProdutos).catch(() => {}); }, []);

  const filtrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) || p.categoria.toLowerCase().includes(busca.toLowerCase()));
  const criticos = produtos.filter((p) => p.quantidade <= 5).length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <h1>Estoque</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>{produtos.length} produtos · {criticos} com estoque crítico</p>
        </div>
        <Button leadingIcon={<Icon name="plus" size={17} />}>Novo Produto</Button>
      </div>

      <div style={{ marginBottom: 16, maxWidth: 440 }}>
        <Input leadingIcon={<Icon name="search" size={16} />} placeholder="Buscar por nome ou categoria..."
          value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <Card padding="0">
        <Table
          rowKey="id"
          data={filtrados}
          columns={[
            { key: 'nome', header: 'Produto', render: (r) => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.nome}</strong> },
            { key: 'categoria', header: 'Categoria', render: (r) => <span style={{ color: 'var(--text-muted)' }}>{r.categoria}</span> },
            { key: 'preco', header: 'Preço', align: 'right', render: (r) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(r.preco)}</span> },
            { key: 'quantidade', header: 'Qtd', align: 'right', render: (r) => <span style={{ fontWeight: 700, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{r.quantidade}</span> },
            { key: 'status', header: 'Status', render: (r) => { const [t, l] = statusEstoque(r.quantidade); return <Badge tone={t}>{l}</Badge>; } },
            { key: 'acoes', header: '', align: 'right', width: '130px', render: () => (
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <IconButton icon={<Icon name="refresh" size={16} />} label="Ajustar" variant="outline" />
                <IconButton icon={<Icon name="edit" size={16} />} label="Editar" />
                <IconButton icon={<Icon name="trash" size={16} />} label="Excluir" style={{ color: 'var(--danger-text)' }} />
              </div>
            ) },
          ]}
        />
      </Card>
    </div>
  );
}
