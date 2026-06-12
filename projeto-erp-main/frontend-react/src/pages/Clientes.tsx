import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card, Table, Button, Input, IconButton, Modal, Icon } from '../design-system/components';
import { Alert } from '../components/auth/AuthKit';
import { useBeforeUnload } from '../hooks/useBeforeUnload';
import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from '../hooks/useConfirm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { maskPhone, isValidPhone } from '../utils/maskPhone';

interface Cliente { id: number; nome: string; email: string; telefone: string; cpfCnpj: string; }

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function Clientes() {
  const { can } = useAuth();
  const { confirm, dialogProps } = useConfirm();
  const canDelete = can('clientes', 'delete');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState('');
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Cliente | null>(null);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', cpfCnpj: '' });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);

  useBeforeUnload(open && (!!form.nome || !!form.email));

  useEffect(() => { api.get<Cliente[]>('/api/clientes').then(setClientes).catch(() => {}); }, []);

  const filtrados = clientes.filter((c) => {
    const q = busca.toLowerCase();
    return c.nome.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.cpfCnpj || '').includes(q);
  });

  function abrir() { setEditando(null); setForm({ nome: '', email: '', telefone: '', cpfCnpj: '' }); setErrs({}); setOpen(true); }
  function abrirEdicao(c: Cliente) {
    setEditando(c);
    setForm({ nome: c.nome, email: c.email, telefone: c.telefone, cpfCnpj: c.cpfCnpj });
    setErrs({});
    setOpen(true);
  }
  function set(campo: keyof typeof form, val: string) {
    setForm((p) => ({ ...p, [campo]: val }));
    setErrs((p) => ({ ...p, [campo]: '' }));
  }

  async function fechar() {
    const temDados = editando ? true : (!!form.nome || !!form.email || !!form.telefone || !!form.cpfCnpj);
    if (temDados) {
      const ok = await confirm('Deseja cancelar? Os dados preenchidos serão descartados.');
      if (!ok) return;
    }
    setOpen(false);
    setErrs({});
    setEditando(null);
  }

  async function salvar() {
    const ne: Record<string, string> = {};
    if (!form.nome.trim()) ne.nome = 'Informe o nome ou razão social.';
    if (!form.email.trim()) ne.email = 'Informe o e-mail.';
    else if (!isEmail(form.email)) ne.email = 'E-mail inválido.';
    if (!form.telefone.trim()) ne.telefone = 'Informe o telefone.';
    else if (!isValidPhone(form.telefone)) ne.telefone = 'Número inválido. Use o formato (XX) X XXXX-XXXX.';
    if (!form.cpfCnpj.trim()) ne.cpfCnpj = 'Informe o CPF/CNPJ.';
    if (Object.keys(ne).length) { setErrs(ne); return; }

    const ok = await confirm(
      editando ? 'Deseja salvar as alterações deste cliente?' : 'Deseja cadastrar este cliente?'
    );
    if (!ok) return;

    setSalvando(true);
    try {
      if (editando) {
        await api.put(`/api/clientes/${editando.id}`, form);
      } else {
        await api.post('/api/clientes', form);
      }
      const lista = await api.get<Cliente[]>('/api/clientes');
      setClientes(lista);
      setOpen(false);
      setErrs({});
      setEditando(null);
    } catch {
      setErrs({ _global: 'Erro ao salvar cliente. Tente novamente.' });
    }
    setSalvando(false);
  }

  async function excluir(id: number) {
    const ok = await confirm('Deseja excluir este cliente? Esta ação não pode ser desfeita.', { confirmLabel: 'Excluir' });
    if (!ok) return;
    await api.del(`/api/clientes/${id}`);
    setClientes((prev) => prev.filter((c) => c.id !== id));
  }

  const temErro = Object.values(errs).some(Boolean);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <h1>Clientes</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>{clientes.length} clientes cadastrados</p>
        </div>
        <Button leadingIcon={<Icon name="plus" size={17} />} onClick={abrir}>Novo Cliente</Button>
      </div>

      <div style={{ marginBottom: 16, maxWidth: 440 }}>
        <Input leadingIcon={<Icon name="search" size={16} />} placeholder="Buscar por nome, e-mail ou CPF/CNPJ..."
          value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <Card padding="0">
        <Table
          rowKey="id"
          data={filtrados}
          empty={busca ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}
          columns={[
            { key: 'nome',    header: 'Nome',      render: (r: Cliente) => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.nome}</strong> },
            { key: 'email',   header: 'E-mail',    render: (r: Cliente) => <span style={{ color: 'var(--text-muted)' }}>{r.email}</span> },
            { key: 'telefone',header: 'Telefone' },
            { key: 'cpfCnpj', header: 'CPF / CNPJ', render: (r: Cliente) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>{r.cpfCnpj}</span> },
            { key: 'acoes',   header: '', align: 'right', width: '96px', render: (r: Cliente) => (
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <IconButton icon={<Icon name="edit" size={16} />} label="Editar" onClick={() => abrirEdicao(r)} />
                <IconButton icon={<Icon name="trash" size={16} />} label="Excluir" disabled={!canDelete} style={canDelete ? { color: 'var(--danger-text)' } : undefined} onClick={() => excluir(r.id)} />
              </div>
            )},
          ]}
        />
      </Card>

      {open && (
        <Modal title={editando ? 'Editar Cliente' : 'Novo Cliente'} onClose={fechar}
          footer={<>
            <Button variant="secondary" onClick={fechar}>Cancelar</Button>
            <Button onClick={salvar} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</Button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {errs._global
              ? <Alert tone="danger">{errs._global}</Alert>
              : temErro && <Alert tone="warning">Preencha os campos obrigatórios destacados para continuar.</Alert>
            }
            <Input label="Nome *" placeholder="Nome completo ou razão social"
              value={form.nome} onChange={(e) => set('nome', e.target.value)} error={errs.nome} />
            <Input label="E-mail *" type="email" placeholder="contato@empresa.com"
              value={form.email} onChange={(e) => set('email', e.target.value)} error={errs.email} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="Telefone *" placeholder="(11) 9 9999-9999"
                value={form.telefone} onChange={(e) => set('telefone', maskPhone(e.target.value))} error={errs.telefone} />
              <Input label="CPF / CNPJ *" placeholder="000.000.000-00"
                value={form.cpfCnpj} onChange={(e) => set('cpfCnpj', e.target.value)} error={errs.cpfCnpj} />
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
