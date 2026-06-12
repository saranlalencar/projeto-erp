// VORTEX ERP — Clientes (list + search + create modal com validação). Exposes window.ClientesScreen
(function () {
const { Card, Table, Button, Input, IconButton, Modal, Icon } = window.VORTEXERPDesignSystem_6c8a4b;

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());

function Alert({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 14px', background: 'var(--warning-bg)', color: 'var(--warning-text)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      {children}
    </div>
  );
}

function ClientesScreen() {
  const [clientes, setClientes] = React.useState(window.VORTEX_DATA.clientes);
  const [busca, setBusca] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ nome: '', email: '', telefone: '', cpfCnpj: '' });
  const [errs, setErrs] = React.useState({});

  const filtrados = clientes.filter((c) => {
    const q = busca.toLowerCase();
    return c.nome.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.cpfCnpj || '').includes(q);
  });

  function abrir() { setForm({ nome: '', email: '', telefone: '', cpfCnpj: '' }); setErrs({}); setOpen(true); }
  function fechar() { setOpen(false); setErrs({}); }
  function set(campo, val) { setForm((p) => ({ ...p, [campo]: val })); setErrs((p) => ({ ...p, [campo]: undefined })); }

  function salvar() {
    const ne = {};
    if (!form.nome.trim()) ne.nome = 'Informe o nome ou razão social.';
    if (!form.email.trim()) ne.email = 'Informe o e-mail.';
    else if (!isEmail(form.email)) ne.email = 'E-mail inválido.';
    if (!form.telefone.trim()) ne.telefone = 'Informe o telefone.';
    if (!form.cpfCnpj.trim()) ne.cpfCnpj = 'Informe o CPF/CNPJ.';
    if (Object.keys(ne).length) { setErrs(ne); return; }
    setClientes([{ id: Date.now(), ...form },...clientes]);
    fechar();
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
        <Table rowKey="id"
          empty={busca ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}
          columns={[
            { key: 'nome', header: 'Nome', render: r => <strong style={{ color: 'var(--text-strong)', fontWeight: 600 }}>{r.nome}</strong> },
            { key: 'email', header: 'E-mail', render: r => <span style={{ color: 'var(--text-muted)' }}>{r.email}</span> },
            { key: 'telefone', header: 'Telefone' },
            { key: 'cpfCnpj', header: 'CPF / CNPJ', render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>{r.cpfCnpj}</span> },
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

      {open && (
        <Modal title="Novo Cliente" onClose={fechar}
          footer={<><Button variant="secondary" onClick={fechar}>Cancelar</Button><Button onClick={salvar}>Salvar</Button></>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {temErro && <Alert>Preencha os campos obrigatórios destacados para continuar.</Alert>}
            <Input label="Nome *" placeholder="Nome completo ou razão social"
              value={form.nome} onChange={(e) => set('nome', e.target.value)} error={errs.nome} />
            <Input label="E-mail *" type="email" placeholder="contato@empresa.com"
              value={form.email} onChange={(e) => set('email', e.target.value)} error={errs.email} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="Telefone" placeholder="(11) 99999-9999"
                value={form.telefone} onChange={(e) => set('telefone', e.target.value)} />
              <Input label="CPF / CNPJ" placeholder="000.000.000-00"
                value={form.cpfCnpj} onChange={(e) => set('cpfCnpj', e.target.value)} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

window.ClientesScreen = ClientesScreen;
})();
