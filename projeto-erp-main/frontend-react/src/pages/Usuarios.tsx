import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card, Table, Button, Badge, IconButton, Modal, Icon, Input } from '../design-system/components';
import { useBeforeUnload } from '../hooks/useBeforeUnload';

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'ativo' | 'bloqueado';
}

const ROLE_LABEL: Record<string, string> = { admin: 'Admin', manager: 'Gerente', user: 'Usuário' };
const ROLE_TONE: Record<string, 'primary' | 'warning' | 'neutral'> = { admin: 'primary', manager: 'warning', user: 'neutral' };

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' as Usuario['role'] });
  const [salvando, setSalvando] = useState(false);

  useBeforeUnload(open && (!!form.name || !!form.email));

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try { setUsuarios(await api.get<Usuario[]>('/api/users')); } catch { /* sem permissão */ }
  }

  async function salvar() {
    if (!form.name || !form.email || !form.password) return;
    setSalvando(true);
    try {
      await api.post('/api/users', form);
      setOpen(false);
      setForm({ name: '', email: '', password: '', role: 'user' });
      await carregar();
    } catch { /* silent */ }
    setSalvando(false);
  }

  async function toggleStatus(u: Usuario) {
    const novoStatus = u.status === 'ativo' ? 'bloqueado' : 'ativo';
    setUsuarios((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: novoStatus } : x)));
    await api.patch(`/api/users/${u.id}/status`, { status: novoStatus });
  }

  async function excluir(id: string) {
    if (!confirm('Excluir este usuário?')) return;
    await api.del(`/api/users/${id}`);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <h1>Usuários</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>{usuarios.length} usuários cadastrados</p>
        </div>
        <Button leadingIcon={<Icon name="plus" size={17} />} onClick={() => setOpen(true)}>Novo Usuário</Button>
      </div>

      <Card padding="0">
        <Table
          rowKey="id"
          data={usuarios}
          empty="Nenhum usuário encontrado."
          columns={[
            { key: 'name',   header: 'Nome',  render: (r: Usuario) => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.name}</strong> },
            { key: 'email',  header: 'E-mail', render: (r: Usuario) => <span style={{ color: 'var(--text-muted)' }}>{r.email}</span> },
            { key: 'role',   header: 'Perfil', render: (r: Usuario) => <Badge tone={ROLE_TONE[r.role]}>{ROLE_LABEL[r.role]}</Badge> },
            { key: 'status', header: 'Status', render: (r: Usuario) => <Badge tone={r.status === 'ativo' ? 'success' : 'danger'} dot>{r.status === 'ativo' ? 'Ativo' : 'Bloqueado'}</Badge> },
            { key: 'acoes',  header: '', align: 'right', width: '120px', render: (r: Usuario) => (
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <Button size="sm" variant={r.status === 'ativo' ? 'secondary' : 'primary'} onClick={() => toggleStatus(r)}>
                  {r.status === 'ativo' ? 'Bloquear' : 'Ativar'}
                </Button>
                <IconButton icon={<Icon name="trash" size={16} />} label="Excluir" style={{ color: 'var(--danger-text)' }} onClick={() => excluir(r.id)} />
              </div>
            ) },
          ]}
        />
      </Card>

      {open && (
        <Modal title="Novo Usuário" onClose={() => setOpen(false)}
          footer={<>
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={salvar} disabled={salvando}>{salvando ? 'Salvando...' : 'Criar'}</Button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Nome *" placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="E-mail *" type="email" placeholder="usuario@empresa.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Senha *" type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-body)' }}>Perfil</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Usuario['role'] })}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)', fontFamily: 'var(--font-sans)', background: '#fff' }}>
                <option value="user">Usuário</option>
                <option value="manager">Gerente</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
