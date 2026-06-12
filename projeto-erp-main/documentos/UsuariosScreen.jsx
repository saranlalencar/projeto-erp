// VORTEX ERP — Usuários (RBAC list + modal Criar Usuário com validação + telas de feedback). Exposes window.UsuariosScreen
(function () {
const { Card, CardHeader, Table, Button, Input, IconButton, Modal, Icon, Badge } = window.VORTEXERPDesignSystem_6c8a4b;

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());

function Alert({ tone = 'warning', children }) {
  const bgMap = { warning: 'var(--warning-bg)', danger: 'var(--danger-bg)', success: 'var(--success-bg)' };
  const colorMap = { warning: 'var(--warning-text)', danger: 'var(--danger-text)', success: 'var(--success-text)' };
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 14px', background: bgMap[tone], color: colorMap[tone], borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      {children}
    </div>
  );
}

function StatusDisc({ tone = 'info', spinning }) {
  const colorMap = { info: 'var(--info-bg)', success: 'var(--success-bg)', danger: 'var(--danger-bg)' };
  const textMap = { info: 'var(--info-text)', success: 'var(--success-text)', danger: 'var(--danger-text)' };
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%', background: colorMap[tone], display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 24px', animation: spinning ? 'spin 1.2s linear infinite' : 'none',
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={textMap[tone]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {tone === 'success' && <polyline points="20 6 9 17 4 12"></polyline>}
        {tone === 'danger' && <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>}
        {tone === 'info' && <circle cx="12" cy="12" r="10"></circle>}
      </svg>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function UsuariosScreen() {
  const [usuarios, setUsuarios] = React.useState(window.VORTEX_DATA.usuarios || [
    { id: 1, nome: 'Ana Paula Souza', email: 'admin@vortex.com', role: 'Administrador' },
    { id: 2, nome: 'Marcos Lima', email: 'marcos@vortex.com', role: 'Vendedor' },
  ]);
  const [busca, setBusca] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form, setForm] = React.useState({ nome: '', email: '', role: 'Vendedor' });
  const [erros, setErros] = React.useState({});
  const [feedback, setFeedback] = React.useState(null); // 'email-existe' | 'confirmacao' | null

  const filtrados = usuarios.filter((u) => {
    const q = busca.toLowerCase();
    return u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  function abrir() { setForm({ nome: '', email: '', role: 'Vendedor' }); setErros({}); setFeedback(null); setModalOpen(true); }
  function fechar() { setModalOpen(false); setFeedback(null); setErros({}); }
  function set(campo, val) { setForm((p) => ({ ...p, [campo]: val })); setErros((p) => ({ ...p, [campo]: undefined })); }

  function salvar() {
    const ne = {};
    if (!form.nome.trim()) ne.nome = 'Informe o nome do usuário.';
    if (!form.email.trim()) ne.email = 'Informe o e-mail.';
    else if (!isEmail(form.email)) ne.email = 'E-mail inválido.';
    if (Object.keys(ne).length) { setErros(ne); return; }

    // Verifica se e-mail já existe
    if (usuarios.some((u) => u.email === form.email)) {
      setFeedback('email-existe');
      return;
    }

    // Sucesso — mostra tela de confirmação
    setFeedback('confirmacao');
  }

  const temErro = Object.values(erros).some(Boolean);

  // Tela: E-mail já cadastrado
  if (feedback === 'email-existe') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ maxWidth: 440, textAlign: 'center' }}>
          <StatusDisc tone="danger" />
          <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 8, color: 'var(--text-strong)' }}>E-mail já cadastrado</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
            O e-mail <strong>{form.email}</strong> já está registrado no sistema. Use outro e-mail ou recupere a senha da conta existente.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button variant="secondary" onClick={() => { setFeedback(null); setForm({ ...form, email: '' }); }}>Tentar outro e-mail</Button>
            <Button onClick={fechar}>Voltar</Button>
          </div>
        </div>
      </div>
    );
  }

  // Tela: Confirmação de envio
  if (feedback === 'confirmacao') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ maxWidth: 440, textAlign: 'center' }}>
          <StatusDisc tone="info" />
          <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: 8, color: 'var(--text-strong)' }}>Verifique seu e-mail</h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
            Enviamos um link de confirmação para<br />
            <strong style={{ color: 'var(--text-strong)' }}>{form.email}</strong>. Abra o e-mail e clique no link para ativar a conta do usuário.
          </p>
          <Button fullWidth size="lg" onClick={fechar} trailingIcon={<Icon name="arrowRight" size={16} />}>
            Voltar para usuários
          </Button>
        </div>
      </div>
    );
  }

  // Tela principal: Lista de usuários
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, gap: 16 }}>
        <div>
          <h1>Usuários</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 4 }}>{usuarios.length} usuários cadastrados</p>
        </div>
        <Button leadingIcon={<Icon name="plus" size={17} />} onClick={abrir}>Novo usuário</Button>
      </div>

      <div style={{ marginBottom: 16, maxWidth: 440 }}>
        <Input leadingIcon={<Icon name="search" size={16} />} placeholder="Buscar por nome ou e-mail..."
          value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      <Card padding="0">
        <Table rowKey="id"
          empty="Nenhum usuário cadastrado."
          columns={[
            { key: 'nome', header: 'Nome', render: r => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.nome}</strong> },
            { key: 'email', header: 'E-mail', render: r => <span style={{ color: 'var(--text-muted)' }}>{r.email}</span> },
            { key: 'role', header: 'Perfil', render: r => <Badge tone="primary">{r.role}</Badge> },
            { key: 'acoes', header: '', align: 'right', width: '96px', render: () => (
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <IconButton icon={<Icon name="edit" size={16} />} label="Editar" />
                <IconButton icon={<Icon name="trash" size={16} />} label="Excluir" style={{ color: 'var(--danger-text)' }} />
              </div>
            )},
          ]}
          data={filtrados}
        />
      </Card>

      {modalOpen && (
        <Modal title="Criar novo usuário" onClose={fechar}
          footer={<><Button variant="secondary" onClick={fechar}>Cancelar</Button><Button onClick={salvar}>Criar usuário</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {temErro && <Alert tone="warning">Preencha os campos obrigatórios destacados para continuar.</Alert>}
            <Input label="Nome *" placeholder="Nome completo"
              value={form.nome} onChange={(e) => set('nome', e.target.value)} error={erros.nome} />
            <Input label="E-mail *" type="email" placeholder="usuario@empresa.com"
              value={form.email} onChange={(e) => set('email', e.target.value)} error={erros.email} />
            <div>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-strong)', marginBottom: 8 }}>Perfil</label>
              <select value={form.role} onChange={(e) => set('role', e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', background: 'var(--surface-card)', color: 'var(--text-body)' }}>
                <option value="Vendedor">Vendedor</option>
                <option value="Gerente">Gerente</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

window.UsuariosScreen = UsuariosScreen;
})();
