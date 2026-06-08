import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card, Table, Button, Input, IconButton, Modal, Icon } from '../design-system/components';
import { useBeforeUnload } from '../hooks/useBeforeUnload';

interface Cliente { id: number; nome: string; email: string; telefone: string; cpfCnpj: string; }

export function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', cpfCnpj: '' });

  useBeforeUnload(open && (!!form.nome || !!form.email));

  useEffect(() => { api.get<Cliente[]>('/api/clientes').then(setClientes).catch(() => {}); }, []);

  const filtrados = clientes.filter((c) => {
    const q = busca.toLowerCase();
    return c.nome.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.cpfCnpj || '').includes(q);
  });

  async function salvar() {
    if (!form.nome || !form.email) return;
    const novo = await api.post<Cliente>('/api/clientes', form);
    setClientes([novo, ...clientes]);
    setOpen(false);
    setForm({ nome: '', email: '', telefone: '', cpfCnpj: '' });
  }

  async function excluir(id: number) {
    await api.del(`/api/clientes/${id}`);
    setClientes((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <h1>Clientes</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>{clientes.length} clientes cadastrados</p>
        </div>
        <Button leadingIcon={<Icon name="plus" size={17} />} onClick={() => setOpen(true)}>Novo Cliente</Button>
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
            { key: 'nome', header: 'Nome', render: (r: Cliente) => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.nome}</strong> },
            { key: 'email', header: 'E-mail', render: (r: Cliente) => <span style={{ color: 'var(--text-muted)' }}>{r.email}</span> },
            { key: 'telefone', header: 'Telefone' },
            { key: 'cpfCnpj', header: 'CPF / CNPJ', render: (r: Cliente) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>{r.cpfCnpj}</span> },
            { key: 'acoes', header: '', align: 'right', width: '96px', render: (r: Cliente) => (
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <IconButton icon={<Icon name="edit" size={16} />} label="Editar" />
                <IconButton icon={<Icon name="trash" size={16} />} label="Excluir" style={{ color: 'var(--danger-text)' }} onClick={() => excluir(r.id)} />
              </div>
            ) },
          ]}
        />
      </Card>

      {open && (
        <Modal title="Novo Cliente" onClose={() => setOpen(false)}
          footer={<>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={salvar}>Salvar</Button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Nome *" placeholder="Nome completo ou razão social" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            <Input label="E-mail *" type="email" placeholder="contato@empresa.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="Telefone" placeholder="(11) 99999-9999" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
              <Input label="CPF / CNPJ" placeholder="000.000.000-00" value={form.cpfCnpj} onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
