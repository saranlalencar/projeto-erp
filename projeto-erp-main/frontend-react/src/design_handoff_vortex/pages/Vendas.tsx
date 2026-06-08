import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Badge, Button, Icon } from '../design-system/components';

interface Venda { id: number; status: string; total: number; cliente: string; funcionario: string; data: string; itens: number; }

const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtDate = (s: string) => { const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };

const COLUNAS = [
  { key: 'aberto', label: 'Aberto', icon: 'clipboard', tone: 'primary' },
  { key: 'em_andamento', label: 'Em Andamento', icon: 'refresh', tone: 'warning' },
  { key: 'concluido', label: 'Concluído', icon: 'circleCheck', tone: 'success' },
  { key: 'cancelado', label: 'Cancelado', icon: 'circleX', tone: 'danger' },
] as const;

const TONE_COLOR: Record<string, string> = {
  primary: 'var(--info-text)', warning: 'var(--warning-text)', success: 'var(--success-text)', danger: 'var(--danger-text)',
};

export default function Vendas() {
  const [vendas, setVendas] = useState<Venda[]>([]);

  useEffect(() => { api.get('/vendas').then(setVendas).catch(() => {}); }, []);

  async function mover(id: number, novo: string) {
    setVendas((prev) => prev.map((v) => (v.id === id ? { ...v, status: novo } : v)));
    await api.patch(`/vendas/${id}`, { status: novo });   // ← your endpoint
  }
  const porStatus = (s: string) => vendas.filter((v) => v.status === s);

  const miniBtn = (color: string, ghost?: boolean): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', gap: 3, padding: '5px 10px',
    borderRadius: 'var(--radius-sm)', border: ghost ? '1px solid var(--border-strong)' : 'none',
    background: ghost ? 'transparent' : color, color: ghost ? color : '#fff',
    fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <h1>Vendas</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>{vendas.length} pedidos no quadro</p>
        </div>
        <Button leadingIcon={<Icon name="plus" size={17} />}>Nova Venda</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
        {COLUNAS.map((col) => {
          const lista = porStatus(col.key);
          return (
            <div key={col.key} style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 14px', borderBottom: '1px solid var(--border-default)' }}>
                <span style={{ color: TONE_COLOR[col.tone], display: 'flex' }}><Icon name={col.icon} size={17} /></span>
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-strong)' }}>{col.label}</span>
                <span style={{ marginLeft: 'auto' }}><Badge tone={col.tone}>{lista.length}</Badge></span>
              </div>
              <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 90 }}>
                {lista.length === 0 ? (
                  <div style={{ color: 'var(--slate-400)', textAlign: 'center', padding: '20px 0', fontSize: 'var(--text-sm)' }}>Vazio</div>
                ) : lista.map((v) => (
                  <div key={v.id} style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>#{v.id}</span>
                      <span style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>{fmt(v.total)}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-body)', fontWeight: 500, marginBottom: 2 }}>{v.cliente}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 10 }}>{fmtDate(v.data)} · {v.itens} item(ns) · {v.funcionario}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {col.key !== 'concluido' && col.key !== 'cancelado' && (
                        <button onClick={() => mover(v.id, col.key === 'aberto' ? 'em_andamento' : 'concluido')} style={miniBtn('var(--color-primary)')}>
                          Avançar <Icon name="chevronRight" size={13} />
                        </button>
                      )}
                      {col.key !== 'cancelado' && col.key !== 'concluido' && (
                        <button onClick={() => mover(v.id, 'cancelado')} style={miniBtn('var(--text-muted)', true)}>Cancelar</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
