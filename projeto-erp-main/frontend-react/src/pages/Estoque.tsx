import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card, Table, Button, Input, Badge, IconButton, Modal, Icon } from '../design-system/components';
import { Alert } from '../components/auth/AuthKit';
import { useBeforeUnload } from '../hooks/useBeforeUnload';
import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from '../hooks/useConfirm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useHighlight } from '../hooks/useHighlight';

interface Produto { id: number; nome: string; categoria: string; preco: number; quantidade: number; }

const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

function statusEstoque(q: number): ['danger' | 'warning' | 'primary' | 'success', string] {
  if (q === 0) return ['danger', 'Sem estoque'];
  if (q <= 5)  return ['warning', 'Crítico'];
  if (q <= 15) return ['primary', 'Baixo'];
  return ['success', 'Normal'];
}

export function Estoque() {
  const { can } = useAuth();
  const { confirm, dialogProps } = useConfirm();
  const hl = useHighlight();
  const canDelete = can('estoque', 'delete');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [form, setForm] = useState({ nome: '', preco: '', quantidade: '0', categoria: '' });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [ajuste, setAjuste] = useState<{ produto: Produto; delta: string } | null>(null);
  const [salvando, setSalvando] = useState(false);

  useBeforeUnload(showForm && (!!form.nome || !!form.preco));

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try { setProdutos(await api.get<Produto[]>('/api/estoque')); } catch { /* silent */ }
  }

  const filtrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) || (p.categoria || '').toLowerCase().includes(busca.toLowerCase()));
  const criticos = produtos.filter((p) => p.quantidade <= 5).length;

  function abrirNovo() {
    setEditando(null);
    setForm({ nome: '', preco: '', quantidade: '0', categoria: '' });
    setErrs({});
    setShowForm(true);
  }

  function abrirEdicao(p: Produto) {
    setEditando(p);
    setForm({ nome: p.nome, preco: String(p.preco), quantidade: String(p.quantidade), categoria: p.categoria ?? '' });
    setErrs({});
    setShowForm(true);
  }

  function set(campo: keyof typeof form, val: string) {
    setForm((p) => ({ ...p, [campo]: val }));
    setErrs((p) => ({ ...p, [campo]: '' }));
  }

  async function fecharForm() {
    const temDados = editando ? true : (!!form.nome || !!form.preco);
    if (temDados) {
      const ok = await confirm('Deseja cancelar? Os dados preenchidos serão descartados.');
      if (!ok) return;
    }
    setShowForm(false);
    setErrs({});
    setEditando(null);
  }

  async function salvar() {
    const ne: Record<string, string> = {};
    if (!form.nome.trim()) ne.nome = 'Informe o nome do produto.';
    if (!form.preco) ne.preco = 'Informe o preço.';
    else if (isNaN(Number(form.preco)) || Number(form.preco) <= 0) ne.preco = 'Preço inválido.';
    if (Object.keys(ne).length) { setErrs(ne); return; }

    const ok = await confirm(
      editando ? 'Deseja salvar as alterações deste produto?' : 'Deseja cadastrar este produto?'
    );
    if (!ok) return;

    setSalvando(true);
    const body = { nome: form.nome, preco: Number(form.preco), quantidade: Number(form.quantidade), categoria: form.categoria || undefined };
    try {
      if (editando) await api.put(`/api/estoque/${editando.id}`, body);
      else          await api.post('/api/estoque', body);
      setShowForm(false);
      setEditando(null);
      await carregar();
    } catch {
      setErrs({ _global: 'Erro ao salvar produto. Tente novamente.' });
    }
    setSalvando(false);
  }

  async function excluir(id: number) {
    const ok = await confirm('Deseja excluir este produto? Esta ação não pode ser desfeita.', { confirmLabel: 'Excluir' });
    if (!ok) return;
    await api.del(`/api/estoque/${id}`);
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  }

  async function aplicarAjuste() {
    if (!ajuste) return;
    const delta = Number(ajuste.delta);
    if (isNaN(delta) || delta === 0) return;

    const ok = await confirm(
      `Deseja ajustar o estoque de "${ajuste.produto.nome}" em ${delta > 0 ? '+' : ''}${delta} unidades?`,
      { confirmLabel: 'Confirmar ajuste' }
    );
    if (!ok) return;

    setSalvando(true);
    try {
      await api.patch(`/api/estoque/${ajuste.produto.id}/quantidade`, { delta });
      setAjuste(null);
      await carregar();
    } catch { /* silent */ }
    setSalvando(false);
  }

  const temErro = Object.values(errs).some(Boolean);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <h1>Estoque</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>{produtos.length} produtos · {criticos} com estoque crítico</p>
        </div>
        <Button leadingIcon={<Icon name="plus" size={17} />} onClick={abrirNovo}>Novo Produto</Button>
      </div>

      <div style={{ marginBottom: 16, maxWidth: 440 }}>
        <Input leadingIcon={<Icon name="search" size={16} />} placeholder="Buscar por nome ou categoria..."
          value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <Card padding="0">
        <Table
          rowKey="id"
          data={filtrados}
          empty="Nenhum produto encontrado."
          highlightedKeys={
            (hl === 'estoque-zerado' || hl === 'produtos-esgotados')
              ? new Set(produtos.filter((p) => p.quantidade === 0).map((p) => p.id))
              : (hl === 'estoque-critico' || hl === 'estoque-critico-vendedor')
              ? new Set(produtos.filter((p) => p.quantidade > 0 && p.quantidade <= 5).map((p) => p.id))
              : undefined
          }
          columns={[
            { key: 'nome',       header: 'Produto',    render: (r: Produto) => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.nome}</strong> },
            { key: 'categoria',  header: 'Categoria',  render: (r: Produto) => <span style={{ color: 'var(--text-muted)' }}>{r.categoria || '—'}</span> },
            { key: 'preco',      header: 'Preço',      align: 'right', render: (r: Produto) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(r.preco)}</span> },
            { key: 'quantidade', header: 'Qtd',        align: 'right', render: (r: Produto) => <span style={{ fontWeight: 700, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' }}>{r.quantidade}</span> },
            { key: 'status',     header: 'Status',     render: (r: Produto) => { const [t, l] = statusEstoque(r.quantidade); return <Badge tone={t}>{l}</Badge>; } },
            { key: 'acoes',      header: '',           align: 'right', width: '130px', render: (r: Produto) => (
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <IconButton icon={<Icon name="refresh" size={16} />} label="Ajustar" variant="outline" onClick={() => setAjuste({ produto: r, delta: '' })} />
                <IconButton icon={<Icon name="edit" size={16} />} label="Editar" onClick={() => abrirEdicao(r)} />
                <IconButton icon={<Icon name="trash" size={16} />} label="Excluir" disabled={!canDelete} style={canDelete ? { color: 'var(--danger-text)' } : undefined} onClick={() => excluir(r.id)} />
              </div>
            )},
          ]}
        />
      </Card>

      {showForm && (
        <Modal title={editando ? 'Editar Produto' : 'Novo Produto'} onClose={fecharForm}
          footer={<>
            <Button variant="secondary" onClick={fecharForm}>Cancelar</Button>
            <Button onClick={salvar} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {errs._global
              ? <Alert tone="danger">{errs._global}</Alert>
              : temErro && <Alert tone="warning">Preencha os campos obrigatórios destacados para continuar.</Alert>
            }
            <Input label="Nome *" placeholder="Nome do produto"
              value={form.nome} onChange={(e) => set('nome', e.target.value)} error={errs.nome} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="Preço (R$) *" type="number" placeholder="0.00"
                value={form.preco} onChange={(e) => set('preco', e.target.value)} error={errs.preco} />
              <Input label="Quantidade" type="number" placeholder="0"
                value={form.quantidade} onChange={(e) => set('quantidade', e.target.value)} />
            </div>
            <Input label="Categoria" placeholder="Ex: Informática"
              value={form.categoria} onChange={(e) => set('categoria', e.target.value)} />
          </div>
        </Modal>
      )}

      {ajuste && (
        <Modal title="Ajustar Estoque" onClose={() => setAjuste(null)}
          footer={<>
            <Button variant="secondary" onClick={() => setAjuste(null)}>Cancelar</Button>
            <Button onClick={aplicarAjuste} disabled={salvando}>{salvando ? 'Aplicando...' : 'Confirmar'}</Button>
          </>}>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 16 }}>
            <strong>{ajuste.produto.nome}</strong> — atual: <strong>{ajuste.produto.quantidade}</strong> un.
          </p>
          <Input label="Delta (+ adicionar / − remover)" type="number" placeholder="Ex: 10 ou -5"
            value={ajuste.delta} onChange={(e) => setAjuste({ ...ajuste, delta: e.target.value })} />
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 6 }}>
            Resultado: {ajuste.produto.quantidade + (Number(ajuste.delta) || 0)} un.
          </p>
        </Modal>
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
