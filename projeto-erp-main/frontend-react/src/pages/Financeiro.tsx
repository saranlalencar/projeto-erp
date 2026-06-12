import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card, Table, Button, Badge, StatCard, IconButton, Modal, Icon, Input } from '../design-system/components';
import { Alert } from '../components/auth/AuthKit';
import { useBeforeUnload } from '../hooks/useBeforeUnload';
import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from '../hooks/useConfirm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useHighlight } from '../hooks/useHighlight';

type TipoConta = 'receita' | 'despesa';
interface Conta { id: number; descricao: string; valor: number; tipo: TipoConta; pago: boolean; vencimento: string | null; }

const fmt = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const fmtDate = (s: string | null) => {
  if (!s) return '—';
  const [y, m, d] = s.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
};

export function Financeiro() {
  const { can } = useAuth();
  const { confirm, dialogProps } = useConfirm();
  const hl = useHighlight();
  const canDelete = can('financeiro', 'delete');
  const [contas, setContas] = useState<Conta[]>([]);
  const [filtro, setFiltro] = useState<'' | TipoConta>('');
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Conta | null>(null);
  const [form, setForm] = useState({ descricao: '', valor: '', tipo: 'receita' as TipoConta, vencimento: '' });
  const [errs, setErrs] = useState<Record<string, string>>({});
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
    setErrs({});
    setShowForm(true);
  }

  function abrirEdicao(c: Conta) {
    setEditando(c);
    setForm({ descricao: c.descricao, valor: String(c.valor), tipo: c.tipo, vencimento: c.vencimento ? c.vencimento.substring(0, 10) : '' });
    setErrs({});
    setShowForm(true);
  }

  function set(campo: keyof typeof form, val: string) {
    setForm((p) => ({ ...p, [campo]: val }));
    setErrs((p) => ({ ...p, [campo]: '' }));
  }

  async function fecharForm() {
    const temDados = editando ? true : (!!form.descricao || !!form.valor);
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
    if (!form.descricao.trim()) ne.descricao = 'Informe a descrição.';
    if (!form.valor) ne.valor = 'Informe o valor.';
    else if (isNaN(Number(form.valor)) || Number(form.valor) <= 0) ne.valor = 'Valor inválido.';
    if (Object.keys(ne).length) { setErrs(ne); return; }

    const ok = await confirm(
      editando ? 'Deseja salvar as alterações desta conta?' : 'Deseja cadastrar esta conta?'
    );
    if (!ok) return;

    setSalvando(true);
    const body = { descricao: form.descricao, valor: Number(form.valor), tipo: form.tipo, vencimento: form.vencimento || undefined };
    try {
      if (editando) await api.put(`/api/financeiro/${editando.id}`, body);
      else          await api.post('/api/financeiro', body);
      setShowForm(false);
      setEditando(null);
      await carregar();
    } catch {
      setErrs({ _global: 'Erro ao salvar conta. Tente novamente.' });
    }
    setSalvando(false);
  }

  async function togglePago(c: Conta) {
    setContas((prev) => prev.map((x) => (x.id === c.id ? { ...x, pago: !x.pago } : x)));
    await api.patch(`/api/financeiro/${c.id}/pago`, { pago: !c.pago });
  }

  async function excluir(id: number) {
    const ok = await confirm('Deseja excluir esta conta? Esta ação não pode ser desfeita.', { confirmLabel: 'Excluir' });
    if (!ok) return;
    await api.del(`/api/financeiro/${id}`);
    setContas((prev) => prev.filter((c) => c.id !== id));
  }

  const temErro = Object.values(errs).some(Boolean);

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
          highlightedKeys={(() => {
            if (!hl) return undefined;
            const agora = new Date();
            const em7Dias = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (hl === 'contas-vencidas')
              return new Set(contas.filter((c) => !c.pago && c.vencimento && new Date(c.vencimento) < agora).map((c) => c.id));
            if (hl === 'contas-a-vencer')
              return new Set(contas.filter((c) => !c.pago && c.vencimento && new Date(c.vencimento) >= agora && new Date(c.vencimento) <= em7Dias).map((c) => c.id));
            return undefined;
          })()}
          columns={[
            { key: 'descricao', header: 'Descrição',  render: (r: Conta) => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.descricao}</strong> },
            { key: 'tipo',      header: 'Tipo',        render: (r: Conta) => <Badge tone={r.tipo === 'receita' ? 'success' : 'danger'}>{r.tipo === 'receita' ? 'Receita' : 'Despesa'}</Badge> },
            { key: 'valor',     header: 'Valor',       align: 'right', render: (r: Conta) => <span style={{ fontWeight: 700, color: r.tipo === 'receita' ? 'var(--success-text)' : 'var(--danger-text)', fontVariantNumeric: 'tabular-nums' }}>{fmt(r.valor)}</span> },
            { key: 'vencimento',header: 'Vencimento',  render: (r: Conta) => <span style={{ color: 'var(--text-muted)' }}>{fmtDate(r.vencimento)}</span> },
            { key: 'status',    header: 'Status',      render: (r: Conta) => <Badge tone={r.pago ? 'success' : 'warning'} dot>{r.pago ? 'Pago' : 'Pendente'}</Badge> },
            { key: 'acoes',     header: '',            align: 'right', width: '150px', render: (r: Conta) => (
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <Button size="sm" variant={r.pago ? 'secondary' : 'primary'} onClick={() => togglePago(r)}>{r.pago ? 'Desfazer' : 'Pagar'}</Button>
                <IconButton icon={<Icon name="edit" size={16} />} label="Editar" onClick={() => abrirEdicao(r)} />
                <IconButton icon={<Icon name="trash" size={16} />} label="Excluir" disabled={!canDelete} style={canDelete ? { color: 'var(--danger-text)' } : undefined} onClick={() => excluir(r.id)} />
              </div>
            )},
          ]}
        />
      </Card>

      {showForm && (
        <Modal title={editando ? 'Editar Conta' : 'Nova Conta'} onClose={fecharForm}
          footer={<>
            <Button variant="secondary" onClick={fecharForm}>Cancelar</Button>
            <Button onClick={salvar} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {errs._global
              ? <Alert tone="danger">{errs._global}</Alert>
              : temErro && <Alert tone="warning">Preencha os campos obrigatórios destacados para continuar.</Alert>
            }
            <Input label="Descrição *" placeholder="Ex: Pagamento de fornecedor"
              value={form.descricao} onChange={(e) => set('descricao', e.target.value)} error={errs.descricao} />
            <Input label="Valor (R$) *" type="number" placeholder="0.00"
              value={form.valor} onChange={(e) => set('valor', e.target.value)} error={errs.valor} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 5, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-body)' }}>Tipo</label>
                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoConta })}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)', fontFamily: 'var(--font-sans)', background: '#fff' }}>
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>
              <Input label="Vencimento" type="date"
                value={form.vencimento} onChange={(e) => set('vencimento', e.target.value)} />
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
