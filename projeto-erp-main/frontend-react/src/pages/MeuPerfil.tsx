import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Avatar, Button, Input, Modal } from '../design-system/components';
import { Alert } from '../components/auth/AuthKit';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { api } from '../api/client';
import { useConfirm } from '../hooks/useConfirm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { maskPhone, isValidPhone } from '../utils/maskPhone';

interface Perfil {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendedor';
  status: string;
  avatar: string | null;
  telefone: string | null;
  createdAt: string;
}

const ROLE_LABEL: Record<Perfil['role'], string> = {
  admin: 'Administrador',
  vendedor: 'Vendedor',
};

const ROLE_OPTIONS: { value: Perfil['role']; label: string }[] = [
  { value: 'vendedor', label: 'Vendedor' },
  { value: 'admin', label: 'Administrador' },
];

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function MeuPerfil() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { confirm, dialogProps } = useConfirm();

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', telefone: '', role: 'vendedor' as Perfil['role'] });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);
  const [emailPendente, setEmailPendente] = useState(false);
  const [novoEmailPendente, setNovoEmailPendente] = useState('');
  const [modalSenha, setModalSenha] = useState(false);
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get<Perfil>('/auth/me')
      .then((data) => {
        setPerfil(data);
        setForm({
          name: data.name,
          email: data.email,
          telefone: data.telefone ?? '',
          role: data.role,
        });
      })
      .catch(() => {
        if (user) {
          const fallback: Perfil = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            avatar: user.avatar,
            telefone: null,
            createdAt: new Date().toISOString(),
          };
          setPerfil(fallback);
          setForm({ name: fallback.name, email: fallback.email, telefone: '', role: fallback.role });
        }
      })
      .finally(() => setCarregando(false));
  }, [user]);

  useEffect(() => {
    if (searchParams.get('senha') === '1') {
      setModalSenha(true);
    }
  }, [searchParams]);

  function validar(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nome é obrigatório';
    if (!form.email.trim()) e.email = 'E-mail é obrigatório';
    else if (!isEmail(form.email)) e.email = 'E-mail inválido';
    if (!form.telefone.trim()) e.telefone = 'Telefone é obrigatório';
    else if (!isValidPhone(form.telefone)) e.telefone = 'Número inválido. Use o formato (XX) X XXXX-XXXX.';
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function handleSalvar() {
    if (!validar() || !perfil) return;

    const ok = await confirm('Deseja salvar as alterações no perfil?');
    if (!ok) return;

    setSalvando(true);
    try {
      const emailMudou = form.email !== perfil.email;

      if (emailMudou) {
        const { error } = await supabase.auth.updateUser({ email: form.email });
        if (error) {
          setErros((prev) => ({ ...prev, email: 'Erro ao atualizar e-mail: ' + error.message }));
          setSalvando(false);
          return;
        }
        setEmailPendente(true);
        setNovoEmailPendente(form.email);
      }

      const payload: { name?: string; telefone?: string; role?: string } = {};
      if (form.name.trim() !== perfil.name) payload.name = form.name.trim();
      if (form.telefone !== (perfil.telefone ?? '')) payload.telefone = form.telefone;
      if (form.role !== perfil.role && user?.role === 'admin') payload.role = form.role;

      if (Object.keys(payload).length > 0) {
        const atualizado = await api.patch<Perfil>('/auth/me', payload);
        setPerfil((prev) => prev ? { ...prev, ...atualizado } : atualizado);
      }

      setEditando(false);
    } catch (err) {
      console.error('[MeuPerfil] Erro ao salvar:', err);
      setErros((prev) => ({ ...prev, _geral: 'Erro ao salvar. Tente novamente.' }));
    } finally {
      setSalvando(false);
    }
  }

  async function handleCancelar() {
    if (!perfil) return;
    const ok = await confirm('Deseja cancelar a edição? As alterações serão descartadas.');
    if (!ok) return;
    setForm({ name: perfil.name, email: perfil.email, telefone: perfil.telefone ?? '', role: perfil.role });
    setErros({});
    setEditando(false);
  }

  async function handleSalvarSenha() {
    setErroSenha('');
    if (novaSenha.length < 8) {
      setErroSenha('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (novaSenha !== confirmSenha) {
      setErroSenha('As senhas não coincidem.');
      return;
    }

    const ok = await confirm('Deseja alterar sua senha? A senha atual deixará de funcionar.', { confirmLabel: 'Alterar senha' });
    if (!ok) return;

    setSalvandoSenha(true);
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    setSalvandoSenha(false);
    if (error) {
      setErroSenha('Erro ao alterar senha: ' + error.message);
      return;
    }
    setModalSenha(false);
    setNovaSenha('');
    setConfirmSenha('');
    setSearchParams({}, { replace: true });
  }

  async function handleFecharModal() {
    if (novaSenha || confirmSenha) {
      const ok = await confirm('Deseja cancelar? A senha não será alterada.');
      if (!ok) return;
    }
    setModalSenha(false);
    setNovaSenha('');
    setConfirmSenha('');
    setErroSenha('');
    setSearchParams({}, { replace: true });
  }

  if (carregando) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Carregando...
      </div>
    );
  }

  if (!perfil) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
        <Alert tone="danger">Não foi possível carregar o perfil.</Alert>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
      {/* Botão voltar */}
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          marginBottom: 20,
          padding: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Voltar
      </button>

      {/* Banner email pendente */}
      {emailPendente && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone="info">
            E-mail de confirmação enviado para <strong>{novoEmailPendente}</strong>. Aguardando confirmação.
          </Alert>
        </div>
      )}

      {/* Erro geral */}
      {erros._geral && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone="danger">{erros._geral}</Alert>
        </div>
      )}

      {/* Card principal */}
      <div
        style={{
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: 32,
          background: 'var(--surface-card)',
        }}
      >
        {/* Header do card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <Avatar name={perfil.name} size="lg" />
          <div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {perfil.name}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>
              {ROLE_LABEL[perfil.role]}
            </div>
          </div>
        </div>

        {!editando ? (
          /* Modo visualização */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <PerfilField label="Nome" value={perfil.name} />
            <PerfilField label="E-mail" value={perfil.email} />
            <PerfilField label="Cargo" value={ROLE_LABEL[perfil.role]} />
            <PerfilField label="Telefone" value={perfil.telefone ?? '—'} />
            <PerfilField label="Membro desde:" value={formatDate(perfil.createdAt)} />
          </div>
        ) : (
          /* Modo edição */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input
              label="Nome *"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              error={erros.name}
            />
            <Input
              label="E-mail *"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={erros.email}
            />
            <Input
              label="Telefone *"
              type="tel"
              placeholder="(11) 9 9999-9999"
              value={form.telefone}
              onChange={(e) => setForm((f) => ({ ...f, telefone: maskPhone(e.target.value) }))}
              error={erros.telefone}
            />

            {/* Campo cargo */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Cargo
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Perfil['role'] }))}
                disabled={!isAdmin}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  background: isAdmin ? 'var(--surface-card)' : 'var(--surface-sunken)',
                  color: isAdmin ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: isAdmin ? 'auto' : 'not-allowed',
                  outline: 'none',
                }}
              >
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {!isAdmin && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  Apenas administradores podem alterar o cargo.
                </span>
              )}
            </div>

            {/* Data criação (read-only) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Membro desde:
              </label>
              <input
                readOnly
                value={formatDate(perfil.createdAt)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  background: 'var(--surface-sunken)',
                  color: 'var(--text-muted)',
                  cursor: 'not-allowed',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        )}

        {/* Botões de ação */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
          {!editando ? (
            <Button variant="primary" onClick={() => setEditando(true)}>
              Editar perfil
            </Button>
          ) : (
            <>
              <Button variant="primary" disabled={salvando} onClick={handleSalvar}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button variant="ghost" onClick={handleCancelar}>
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Modal de senha */}
      <Modal
        open={modalSenha}
        title="Alterar senha"
        onClose={handleFecharModal}
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={handleFecharModal}>Cancelar</Button>
            <Button variant="primary" disabled={salvandoSenha} onClick={handleSalvarSenha}>
              {salvandoSenha ? 'Salvando...' : 'Salvar senha'}
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {erroSenha && <Alert tone="danger">{erroSenha}</Alert>}
          <Input
            label="Nova senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            hint="Mínimo 8 caracteres"
          />
          <Input
            label="Confirmar senha"
            type="password"
            value={confirmSenha}
            onChange={(e) => setConfirmSenha(e.target.value)}
          />
        </div>
      </Modal>

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}

function PerfilField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)',
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}
