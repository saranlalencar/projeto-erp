import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Badge, Button, Icon, Modal, IconButton } from '../design-system/components';
import { useBeforeUnload } from '../hooks/useBeforeUnload';
import { useFormDraft, loadFormDraft, clearFormDraft } from '../hooks/useFormDraft';
import { useConfirm } from '../hooks/useConfirm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useHighlight } from '../hooks/useHighlight';

interface ItemVenda { quantidade: number; produto: { nome: string; preco: number }; }
interface Venda {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  cliente: { id: number; nome: string; } | null;
  funcionario: { id: number; nome: string; } | null;
  itens: ItemVenda[];
}
interface ClienteOpt { id: number; nome: string; }
interface ProdutoOpt { id: number; nome: string; preco: number; quantidade: number; }

const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtDate = (s: string) => new Date(s).toLocaleDateString('pt-BR');

const COLUNAS = [
  { key: 'aberto',       label: 'Aberto',       icon: 'clipboard',   tone: 'primary'  },
  { key: 'em_andamento', label: 'Em Andamento',  icon: 'refresh',     tone: 'warning'  },
  { key: 'concluido',    label: 'Concluído',     icon: 'circleCheck', tone: 'success'  },
  { key: 'cancelado',    label: 'Cancelado',     icon: 'circleX',     tone: 'danger'   },
] as const;

const TONE_COLOR: Record<string, string> = {
  primary: 'var(--info-text)', warning: 'var(--warning-text)', success: 'var(--success-text)', danger: 'var(--danger-text)',
};

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-base)', fontFamily: 'var(--font-sans)', background: '#fff',
  color: 'var(--text-body)',
};

export function Vendas() {
  const { confirm, dialogProps } = useConfirm();
  const hl = useHighlight();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [clientes, setClientes] = useState<ClienteOpt[]>([]);
  const [produtos, setProdutos] = useState<ProdutoOpt[]>([]);
  const [clienteId, setClienteId] = useState('');
  const [linhas, setLinhas] = useState<{ produtoId: string; quantidade: string }[]>([{ produtoId: '', quantidade: '1' }]);
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState('');

  useBeforeUnload(showModal && (!!clienteId || linhas.some((l) => !!l.produtoId)));
  useFormDraft('venda-draft', { clienteId, linhas }, showModal);

  useEffect(() => { api.get<Venda[]>('/api/vendas').then(setVendas).catch(() => {}); }, []);

  useEffect(() => {
    if (showModal) {
      api.get<ClienteOpt[]>('/api/clientes').then(setClientes).catch(() => {});
      api.get<ProdutoOpt[]>('/api/estoque').then(setProdutos).catch(() => {});
    }
  }, [showModal]);

  function abrirModal() {
    const draft = loadFormDraft<{ clienteId: string; linhas: { produtoId: string; quantidade: string }[] }>('venda-draft');
    setClienteId(draft?.clienteId ?? '');
    setLinhas(draft?.linhas ?? [{ produtoId: '', quantidade: '1' }]);
    setErroModal('');
    setShowModal(true);
  }

  async function fecharModal() {
    const temDados = !!clienteId || linhas.some((l) => !!l.produtoId);
    if (temDados) {
      const ok = await confirm('Deseja cancelar? Os dados da venda serão descartados.');
      if (!ok) return;
    }
    clearFormDraft('venda-draft');
    setShowModal(false);
  }

  function addLinha() {
    setLinhas((l) => [...l, { produtoId: '', quantidade: '1' }]);
  }

  function removeLinha(idx: number) {
    setLinhas((l) => l.filter((_, i) => i !== idx));
  }

  function setLinha(idx: number, field: 'produtoId' | 'quantidade', value: string) {
    setLinhas((l) => l.map((linha, i) => (i === idx ? { ...linha, [field]: value } : linha)));
  }

  const totalPreview = linhas.reduce((sum, l) => {
    const p = produtos.find((x) => x.id === Number(l.produtoId));
    return sum + (p ? p.preco * (Number(l.quantidade) || 0) : 0);
  }, 0);

  async function salvar() {
    setErroModal('');
    if (!clienteId) { setErroModal('Selecione um cliente.'); return; }
    const itens = linhas
      .filter((l) => l.produtoId && Number(l.quantidade) > 0)
      .map((l) => ({ produtoId: Number(l.produtoId), quantidade: Number(l.quantidade) }));
    if (itens.length === 0) { setErroModal('Adicione ao menos um produto com quantidade válida.'); return; }

    setSalvando(true);
    try {
      const resp = await api.post<{ success: boolean; venda: Venda }>('/api/vendas', {
        clienteId: Number(clienteId), itens,
      });
      setVendas((v) => [resp.venda, ...v]);
      clearFormDraft('venda-draft');
      setShowModal(false);
    } catch (err: unknown) {
      const e = err as { message?: string };
      if (e?.message === 'estoque_insuficiente') setErroModal('Estoque insuficiente para um ou mais produtos.');
      else if (e?.message === 'campos_obrigatorios') setErroModal('Preencha todos os campos obrigatórios.');
      else setErroModal('Erro ao criar venda. Verifique os dados e tente novamente.');
    }
    setSalvando(false);
  }

  async function mover(id: number, novo: string) {
    setVendas((prev) => prev.map((v) => (v.id === id ? { ...v, status: novo } : v)));
    await api.patch(`/api/vendas/${id}/status`, { status: novo });
  }

  async function cancelarVenda(id: number) {
    const ok = await confirm('Deseja cancelar esta venda? O status será alterado para "Cancelado".', { confirmLabel: 'Cancelar venda' });
    if (!ok) return;
    await mover(id, 'cancelado');
  }

  const porStatus = (s: string) => vendas.filter((v) => v.status === s);

  const miniBtn = (color: string, ghost?: boolean) => ({
    display: 'inline-flex', alignItems: 'center', gap: 3, padding: '5px 12px',
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
        <Button leadingIcon={<Icon name="plus" size={17} />} onClick={abrirModal}>Nova Venda</Button>
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
                ) : lista.map((v) => {
                  const isHl = (hl === 'vendas-abertas' && v.status === 'aberto')
                    || (hl === 'vendas-andamento' && v.status === 'em_andamento');
                  return (
                  <div key={v.id} className={isHl ? 'vtx-card-highlight' : undefined} style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>#{v.id}</span>
                      <span style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums' }}>{fmt(v.total)}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-body)', fontWeight: 500, marginBottom: 2 }}>{v.cliente?.nome ?? '—'}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 10 }}>
                      {fmtDate(v.createdAt)} · {v.itens.length} item(ns){v.funcionario ? ` · ${v.funcionario.nome}` : ''}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {col.key !== 'concluido' && col.key !== 'cancelado' && (
                        <button onClick={() => mover(v.id, col.key === 'aberto' ? 'em_andamento' : 'concluido')} style={miniBtn('var(--color-primary)')}>
                          Avançar <Icon name="chevronRight" size={13} />
                        </button>
                      )}
                      {col.key !== 'cancelado' && col.key !== 'concluido' && (
                        <button onClick={() => cancelarVenda(v.id)} style={miniBtn('var(--text-muted)', true)}>Cancelar</button>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal
          title="Nova Venda"
          onClose={fecharModal}
          footer={
            <>
              <Button variant="secondary" onClick={fecharModal}>Cancelar</Button>
              <Button onClick={salvar} disabled={salvando}>
                {salvando ? 'Salvando...' : `Criar Venda${totalPreview > 0 ? ` · ${fmt(totalPreview)}` : ''}`}
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {erroModal && (
              <div style={{ padding: '10px 14px', background: 'var(--danger-bg)', color: 'var(--danger-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                {erroModal}
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: 5, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-body)' }}>
                Cliente *
              </label>
              <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} style={selectStyle}>
                <option value="">Selecione um cliente...</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <label style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-body)' }}>Produtos *</label>
                <Button size="sm" variant="secondary" leadingIcon={<Icon name="plus" size={14} />} onClick={addLinha}>
                  Adicionar
                </Button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {linhas.map((linha, idx) => {
                  const p = produtos.find((x) => x.id === Number(linha.produtoId));
                  return (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 90px auto', gap: 8, alignItems: 'center' }}>
                      <select value={linha.produtoId} onChange={(e) => setLinha(idx, 'produtoId', e.target.value)} style={selectStyle}>
                        <option value="">Produto...</option>
                        {produtos.map((pr) => (
                          <option key={pr.id} value={pr.id}>
                            {pr.nome} — {fmt(pr.preco)} (estoque: {pr.quantidade})
                          </option>
                        ))}
                      </select>
                      <input
                        type="number" min="1" max={p?.quantidade ?? 9999}
                        value={linha.quantidade}
                        onChange={(e) => setLinha(idx, 'quantidade', e.target.value)}
                        style={{ ...selectStyle, textAlign: 'right' }}
                        placeholder="Qtd"
                      />
                      {linhas.length > 1 && (
                        <IconButton
                          icon={<Icon name="trash" size={15} />}
                          label="Remover linha"
                          style={{ color: 'var(--danger-text)' }}
                          onClick={() => removeLinha(idx)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {totalPreview > 0 && (
              <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-primary)', fontVariantNumeric: 'tabular-nums', paddingTop: 4, borderTop: '1px solid var(--border-default)' }}>
                Total: {fmt(totalPreview)}
              </div>
            )}
          </div>
        </Modal>
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
