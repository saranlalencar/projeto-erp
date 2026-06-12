// VORTEX ERP — Perfil de usuário com dropdown + tela Meu Perfil editável. Exposes window.ProfileDropdown, window.MyProfileScreen
(function () {
const { Avatar, Button, Input, Icon, Modal, Badge } = window.VORTEXERPDesignSystem_6c8a4b;

// ─────────────────────────────────────────  DROPDOWN MENU
function ProfileDropdown({ userName = 'Ana Paula Souza', userRole = 'Administrador', onMyProfile, onChangePassword, onLogout }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
        <Avatar name={userName} size="sm" />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--surface-card)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', minWidth: 240, zIndex: 1000,
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)' }}>{userName}</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{userRole}</div>
          </div>

          <button onClick={() => { onMyProfile && onMyProfile(); setOpen(false); }}
            style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-sunken)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <Icon name="user" size={16} /> Meu perfil
          </button>

          <button onClick={() => { onChangePassword && onChangePassword(); setOpen(false); }}
            style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-sunken)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <Icon name="lock" size={16} /> Alterar senha
          </button>

          <div style={{ borderTop: '1px solid var(--border-default)' }}>
            <button onClick={() => { onLogout && onLogout(); setOpen(false); }}
              style={{ width: '100%', padding: '12px 16px', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <Icon name="logout" size={16} /> Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────  MEU PERFIL SCREEN
function MyProfileScreen({ user = {}, userRole = 'Administrador', onBack }) {
  const defaultUser = {
    id: 1,
    nome: 'Ana Paula Souza',
    email: 'ana.souza@empresa.com',
    cargo: 'Administrador',
    telefone: '(11) 99888-1122',
    dataCriacao: '2024-01-15',
    avatar: 'Ana Paula Souza',
    ...user
  };

  const [dados, setDados] = React.useState(defaultUser);
  const [editando, setEditando] = React.useState(false);
  const [form, setForm] = React.useState(dados);
  const [erros, setErros] = React.useState({});
  const [emailPendente, setEmailPendente] = React.useState(false);
  const [alterarSenha, setAlterarSenha] = React.useState(false);
  const [novaSenha, setNovaSenha] = React.useState('');
  const [confirmSenha, setConfirmSenha] = React.useState('');
  const [erroSenha, setErroSenha] = React.useState('');

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
  const isAdmin = userRole === 'Administrador';

  function set(campo, val) {
    setForm((p) => ({ ...p, [campo]: val }));
    setErros((p) => ({ ...p, [campo]: undefined }));
  }

  function salvar() {
    const ne = {};
    if (!form.nome.trim()) ne.nome = 'Nome não pode estar vazio.';
    if (!form.email.trim()) ne.email = 'E-mail não pode estar vazio.';
    else if (!isEmail(form.email)) ne.email = 'E-mail inválido.';
    if (!form.telefone.trim()) ne.telefone = 'Telefone não pode estar vazio.';
    
    setErros(ne);
    if (Object.keys(ne).length) return;

    // Se e-mail foi alterado, mostra status pendente
    if (form.email !== dados.email) {
      setEmailPendente(true);
      setEditando(false);
      setTimeout(() => setEmailPendente(false), 4000);
      return;
    }

    setDados(form);
    setEditando(false);
  }

  function salvarSenha() {
    if (!novaSenha || !confirmSenha) {
      setErroSenha('Preencha ambos os campos.');
      return;
    }
    if (novaSenha.length < 8) {
      setErroSenha('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    if (novaSenha !== confirmSenha) {
      setErroSenha('As senhas não coincidem.');
      return;
    }
    setErroSenha('');
    setAlterarSenha(false);
    setNovaSenha('');
    setConfirmSenha('');
    // Aqui enviaria a requisição ao backend
  }

  const temErro = Object.values(erros).some(Boolean);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon name="arrowLeft" size={16} /> Voltar
      </button>

      {emailPendente && (
        <div style={{ padding: '12px 14px', background: 'var(--info-bg)', color: 'var(--info-text)', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 'var(--text-sm)' }}>
          ✓ E-mail de confirmação enviado para <strong>{form.email}</strong>. Aguardando sua confirmação.
        </div>
      )}

      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: 32, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <Avatar name={dados.avatar} size="lg" />
          <div>
            <h1 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>{dados.nome}</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{dados.cargo}</p>
          </div>
        </div>

        {editando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {temErro && <div style={{ padding: '11px 14px', background: 'var(--warning-bg)', color: 'var(--warning-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Preencha os campos corretamente.</div>}
            <Input label="Nome *" value={form.nome} onChange={(e) => set('nome', e.target.value)} error={erros.nome} />
            <Input label="E-mail *" value={form.email} onChange={(e) => set('email', e.target.value)} error={erros.email} />
            <Input label="Telefone *" value={form.telefone} onChange={(e) => set('telefone', e.target.value)} error={erros.telefone} />
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 8, color: isAdmin ? 'var(--text-strong)' : 'var(--text-muted)' }}>Cargo / Função</label>
              <select value={form.cargo} onChange={(e) => set('cargo', e.target.value)} disabled={!isAdmin}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', background: isAdmin ? 'var(--surface-card)' : 'var(--slate-100)', color: isAdmin ? 'var(--text-body)' : 'var(--text-muted)', cursor: isAdmin ? 'pointer' : 'not-allowed', opacity: isAdmin ? 1 : 0.6 }}>
                <option value="Vendedor">Vendedor</option>
                <option value="Gerente">Gerente</option>
                <option value="Administrador">Administrador</option>
              </select>
              {!isAdmin && <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 4 }}>Apenas administradores podem alterar.</p>}
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)', opacity: 0.6 }}>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Data de criação da conta</label>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{new Date(dados.dataCriacao).toLocaleDateString('pt-BR')}</span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 4 }}>Não pode ser alterado.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="secondary" onClick={() => { setEditando(false); setForm(dados); setErros({}); }}>Cancelar</Button>
              <Button onClick={salvar}>Salvar alterações</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Nome</label>
              <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-body)' }}>{dados.nome}</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>E-mail</label>
              <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-body)' }}>{dados.email}</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Telefone</label>
              <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-body)' }}>{dados.telefone}</p>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Cargo / Função</label>
              <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-body)' }}>{dados.cargo}</p>
            </div>
            <div style={{ padding: '10px 12px', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-md)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Data de criação</label>
              <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-body)' }}>{new Date(dados.dataCriacao).toLocaleDateString('pt-BR')}</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button onClick={() => setEditando(true)}>Editar perfil</Button>
              <Button variant="secondary" onClick={() => setAlterarSenha(true)}>Alterar senha</Button>
            </div>
          </div>
        )}
      </div>

      {alterarSenha && (
        <Modal title="Alterar senha" onClose={() => { setAlterarSenha(false); setErroSenha(''); setNovaSenha(''); setConfirmSenha(''); }}
          footer={<><Button variant="secondary" onClick={() => setAlterarSenha(false)}>Cancelar</Button><Button onClick={salvarSenha}>Alterar senha</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {erroSenha && <div style={{ padding: '11px 14px', background: 'var(--warning-bg)', color: 'var(--warning-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{erroSenha}</div>}
            <Input label="Nova senha" type="password" placeholder="Mínimo 8 caracteres" value={novaSenha} onChange={(e) => { setNovaSenha(e.target.value); if (erroSenha) setErroSenha(''); }} />
            <Input label="Confirmar senha" type="password" placeholder="Repita a senha" value={confirmSenha} onChange={(e) => { setConfirmSenha(e.target.value); if (erroSenha) setErroSenha(''); }} />
          </div>
        </Modal>
      )}
    </div>
  );
}

window.ProfileDropdown = ProfileDropdown;
window.MyProfileScreen = MyProfileScreen;
})();
