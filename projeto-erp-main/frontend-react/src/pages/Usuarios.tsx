import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Card, Table, Button, Badge, IconButton, Modal, Icon, Input } from '../design-system/components';
import { Alert, StatusDisc } from '../components/auth/AuthKit';
import { useBeforeUnload } from '../hooks/useBeforeUnload';
import { useAuth } from '../contexts/AuthContext';
import { useConfirm } from '../hooks/useConfirm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useHighlight } from '../hooks/useHighlight';

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendedor';
  status: 'ativo' | 'bloqueado';
}

type Feedback = null | 'email-existe' | 'confirmacao';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const ROLE_LABEL: Record<string, string> = { admin: 'Admin', vendedor: 'Vendedor' };
const ROLE_TONE: Record<string, 'primary' | 'warning' | 'neutral'> = { admin: 'primary', vendedor: 'neutral' };

export function Usuarios() {
  const { can } = useAuth();
  const { confirm, dialogProps } = useConfirm();
  const hl = useHighlight();
  const canDelete = can('users', 'delete');
  const canBlock  = can('users', 'block');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [erroCarregar, setErroCarregar] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'vendedor' as Usuario['role'] });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [senhaTemp, setSenhaTemp] = useState('');

  useBeforeUnload(open && (!!form.name || !!form.email));

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setErroCarregar('');
    try {
      setUsuarios(await api.get<Usuario[]>('/api/users'));
    } catch (e: unknown) {
      const err = e as { status?: number; error?: string };
      if (err?.status === 403) setErroCarregar('Sem permissão para visualizar usuários.');
      else if (err?.status === 401) setErroCarregar('Sessão expirada. Faça login novamente.');
      else setErroCarregar('Não foi possível carregar os usuários. Verifique se o backend está em execução.');
    }
  }

  function abrir() {
    setForm({ name: '', email: '', role: 'vendedor' });
    setErrs({});
    setFeedback(null);
    setOpen(true);
  }

  async function fechar() {
    if (!feedback && (!!form.name || !!form.email)) {
      const ok = await confirm('Deseja cancelar? O usuário não será criado.');
      if (!ok) return;
    }
    setOpen(false);
    setFeedback(null);
    setErrs({});
    setSenhaTemp('');
  }

  function set(campo: keyof typeof form, val: string) {
    setForm((p) => ({ ...p, [campo]: val }));
    setErrs((p) => ({ ...p, [campo]: '' }));
  }

  async function salvar() {
    const ne: Record<string, string> = {};
    if (!form.name.trim()) ne.name = 'Informe o nome completo.';
    if (!form.email.trim()) ne.email = 'Informe o e-mail.';
    else if (!isEmail(form.email)) ne.email = 'E-mail inválido.';
    if (Object.keys(ne).length) { setErrs(ne); return; }

    const ok = await confirm('Deseja criar o usuário e enviar o convite de acesso?', { confirmLabel: 'Criar e enviar' });
    if (!ok) return;

    setSalvando(true);
    try {
      const resp = await api.post<{ success: boolean; senhaTemporaria?: string }>('/api/users', form);
      await carregar();
      setSenhaTemp(resp.senhaTemporaria ?? '');
      setFeedback('confirmacao');
    } catch (e: unknown) {
      const err = e as { error?: string; detail?: string; status?: number };
      if (err?.error === 'email_em_uso') {
        setFeedback('email-existe');
      } else if (err?.error === 'sem_permissao') {
        setErrs({ _global: 'Sem permissão. Apenas administradores podem criar usuários.' });
      } else {
        const detalhe = err?.detail || err?.error || 'desconhecido';
        setErrs({ _global: `Erro ao criar usuário: ${detalhe}` });
      }
    }
    setSalvando(false);
  }

  async function toggleStatus(u: Usuario) {
    const novoStatus = u.status === 'ativo' ? 'bloqueado' : 'ativo';
    const acao = novoStatus === 'bloqueado' ? 'bloquear' : 'ativar';
    const ok = await confirm(
      `Deseja ${acao} o usuário "${u.name}"?`,
      { confirmLabel: novoStatus === 'bloqueado' ? 'Bloquear' : 'Ativar' }
    );
    if (!ok) return;
    setUsuarios((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: novoStatus } : x)));
    await api.patch(`/api/users/${u.id}/status`, { status: novoStatus });
  }

  async function excluir(id: string) {
    const ok = await confirm('Deseja excluir este usuário? Esta ação não pode ser desfeita.', { confirmLabel: 'Excluir' });
    if (!ok) return;
    await api.del(`/api/users/${id}`);
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  }

  const temErro = Object.values(errs).some(Boolean);

  function renderModalContent() {
    if (feedback === 'email-existe') {
      return (
        <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
          <StatusDisc tone="danger" />
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-strong)', marginBottom: 8 }}>
            E-mail já cadastrado
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
            O e-mail <strong style={{ color: 'var(--text-strong)' }}>{form.email}</strong> já está registrado
            no sistema. Use outro e-mail ou recupere a senha da conta existente.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => { setFeedback(null); setForm((p) => ({ ...p, email: '' })); }}>
              Tentar outro e-mail
            </Button>
            <Button onClick={() => { setOpen(false); setFeedback(null); setErrs({}); }}>Voltar</Button>
          </div>
        </div>
      );
    }

    if (feedback === 'confirmacao') {
      return (
        <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
          <StatusDisc tone="success" />
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-strong)', marginBottom: 8 }}>
            Usuário criado com sucesso
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
            Conta criada para <strong style={{ color: 'var(--text-strong)' }}>{form.email}</strong>.<br />
            Compartilhe a senha temporária abaixo com o usuário. Ele poderá alterá-la após o primeiro acesso.
          </p>
          {senhaTemp && (
            <div style={{ marginBottom: 20 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--surface-sunken)', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)', padding: '10px 14px',
              }}>
                <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '0.05em', userSelect: 'all' }}>
                  {senhaTemp}
                </span>
                <button
                  type="button"
                  title="Copiar senha"
                  onClick={() => navigator.clipboard.writeText(senhaTemp)}
                  style={{ flexShrink: 0, padding: '4px 6px', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', borderRadius: 'var(--radius-sm)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--slate-200)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
                >
                  <Icon name="clipboard" size={15} />
                </button>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 6 }}>
                Esta senha é exibida apenas uma vez. Salve antes de fechar.
              </p>
            </div>
          )}
          <Button
            fullWidth
            size="lg"
            onClick={() => { setOpen(false); setFeedback(null); setErrs({}); setSenhaTemp(''); }}
            trailingIcon={<Icon name="arrowRight" size={16} />}
          >
            Voltar para usuários
          </Button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {errs._global
          ? <Alert tone="danger">{errs._global}</Alert>
          : temErro && <Alert tone="warning">Preencha os campos obrigatórios destacados para continuar.</Alert>
        }
        <Input label="Nome *" placeholder="Nome completo"
          value={form.name} onChange={(e) => set('name', e.target.value)} error={errs.name} />
        <Input label="E-mail *" type="email" placeholder="usuario@empresa.com"
          value={form.email} onChange={(e) => set('email', e.target.value)} error={errs.email} />
        <div>
          <label style={{ display: 'block', marginBottom: 5, fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-body)' }}>
            Perfil
          </label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Usuario['role'] })}
            style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-base)', fontFamily: 'var(--font-sans)', background: '#fff' }}
          >
            <option value="vendedor">Vendedor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
          Um link de ativação será enviado ao e-mail do usuário.
        </p>
      </div>
    );
  }

  function renderModalFooter() {
    if (feedback) return null;
    return (
      <>
        <Button variant="secondary" onClick={fechar}>Cancelar</Button>
        <Button onClick={salvar} disabled={salvando}>
          {salvando ? 'Enviando...' : 'Criar e enviar convite'}
        </Button>
      </>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <h1>Usuários</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>{usuarios.length} usuários cadastrados</p>
        </div>
        <Button leadingIcon={<Icon name="plus" size={17} />} onClick={abrir}>Novo Usuário</Button>
      </div>

      {erroCarregar && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone="danger">{erroCarregar}</Alert>
        </div>
      )}

      <Card padding="0">
        <Table
          rowKey="id"
          data={usuarios}
          empty="Nenhum usuário encontrado."
          highlightedKeys={hl === 'usuarios-bloqueados'
            ? new Set(usuarios.filter((u) => u.status === 'bloqueado').map((u) => u.id))
            : undefined}
          columns={[
            { key: 'name',   header: 'Nome',   render: (r: Usuario) => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.name}</strong> },
            { key: 'email',  header: 'E-mail', render: (r: Usuario) => <span style={{ color: 'var(--text-muted)' }}>{r.email}</span> },
            { key: 'role',   header: 'Perfil', render: (r: Usuario) => <Badge tone={ROLE_TONE[r.role]}>{ROLE_LABEL[r.role]}</Badge> },
            { key: 'status', header: 'Status', render: (r: Usuario) => <Badge tone={r.status === 'ativo' ? 'success' : 'danger'} dot>{r.status === 'ativo' ? 'Ativo' : 'Bloqueado'}</Badge> },
            { key: 'acoes',  header: '', align: 'right', width: '120px', render: (r: Usuario) => (
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <Button size="sm" variant={r.status === 'ativo' ? 'secondary' : 'primary'} disabled={!canBlock} onClick={() => toggleStatus(r)}>
                  {r.status === 'ativo' ? 'Bloquear' : 'Ativar'}
                </Button>
                <IconButton icon={<Icon name="trash" size={16} />} label="Excluir" disabled={!canDelete} style={canDelete ? { color: 'var(--danger-text)' } : undefined} onClick={() => excluir(r.id)} />
              </div>
            )},
          ]}
        />
      </Card>

      {open && (
        <Modal
          title={feedback ? ' ' : 'Novo Usuário'}
          onClose={fechar}
          footer={renderModalFooter()}
        >
          {renderModalContent()}
        </Modal>
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
