// VORTEX Auth — As 6 telas de autenticação. Exposes window.AuthScreens
// Cada tela aceita: forcedState (modo doc), flow (modo fluxo real),
// onNav(screen, data) e data (ex.: { email }).
(function () {
  const DS = window.VORTEXERPDesignSystem_6c8a4b;
  const { Input, Button, Checkbox, Icon } = DS;
  const { AuthShell, Alert, StatusDisc, Spinner } = window.AuthKit;

  const link = { fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer' };
  const A = ({ children, onClick }) => <a onClick={(e) => { e.preventDefault(); onClick && onClick(); }} href="#" style={link}>{children}</a>;

  // Validação de e-mail simples
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
  // Hook utilitário de erros por campo
  function useErrors() {
    const [errs, setErrs] = React.useState({});
    const clear = (campo) => setErrs((p) => (p[campo] ? { ...p, [campo]: undefined } : p));
    return [errs, setErrs, clear];
  }

  // Botão discreto "simular clique no link do e-mail" (só no modo fluxo)
  function SimLink({ children, onClick }) {
    return (
      <button onClick={onClick} style={{
        marginTop: 18, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: '9px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)',
        background: 'var(--surface-sunken)', color: 'var(--text-muted)', cursor: 'pointer',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 600,
      }}>
        <Icon name="mail" size={14} /> {children}
      </button>
    );
  }

  // ─────────────────────────────────────────  LOGIN  /login
  function Login({ forcedState, onNav, flow }) {
    const [st, setSt] = React.useState(forcedState || 'form');
    const [email, setEmail] = React.useState('admin@vortex.com');
    const [senha, setSenha] = React.useState('Admin@123');
    const [errs, setErrs, clear] = useErrors();
    React.useEffect(() => setSt(forcedState || 'form'), [forcedState]);
    function submit(e) {
      e.preventDefault();
      const ne = {};
      if (!email.trim()) ne.email = 'Informe seu e-mail.';
      else if (!isEmail(email)) ne.email = 'E-mail inválido.';
      if (!senha) ne.senha = 'Informe sua senha.';
      setErrs(ne);
      if (Object.keys(ne).length) return;
      setSt('loading');
      if (flow) setTimeout(() => onNav && onNav('__erp__'), 850);
    }
    return (
      <AuthShell title="Acesse sua conta" subtitle="Sistema ERP Integrado"
        footer={<>Não tem conta? <A onClick={() => onNav && onNav('Cadastro')}>Cadastre-se</A></>}>
        <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {st === 'erro' && <Alert tone="danger">E-mail ou senha incorretos.</Alert>}
          {Object.keys(errs).some((k) => errs[k]) && <Alert tone="warning">Preencha os campos destacados para continuar.</Alert>}
          <Input label="E-mail" type="email" value={email} onChange={(e) => { setEmail(e.target.value); clear('email'); }} leadingIcon={<Icon name="mail" size={16} />} placeholder="voce@empresa.com" error={errs.email} />
          <Input label="Senha" type="password" value={senha} onChange={(e) => { setSenha(e.target.value); clear('senha'); }} placeholder="••••••••" error={errs.senha} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Checkbox label="Lembrar de mim" checked readOnly />
            <A onClick={() => onNav && onNav('EsqueciSenha')}>Esqueceu a senha?</A>
          </div>
          <Button type="submit" fullWidth size="lg" disabled={st === 'loading'}
            leadingIcon={st === 'loading' ? <Spinner size={17} color="#fff" /> : null}>
            {st === 'loading' ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </AuthShell>
    );
  }

  // ─────────────────────────────────────────  CADASTRO  /cadastro
  function Cadastro({ forcedState, onNav, flow }) {
    const [st, setSt] = React.useState(forcedState || 'form');
    const [nome, setNome] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [senha, setSenha] = React.useState('');
    const [conf, setConf] = React.useState('');
    const [errs, setErrs, clear] = useErrors();
    React.useEffect(() => {
      if (flow) return;
      if (forcedState === 'validação') {
        setSt('form'); setNome(''); setEmail(''); setSenha(''); setConf('');
        setErrs({ nome: 'Informe seu nome completo.', email: 'Informe seu e-mail.', senha: 'Crie uma senha.', conf: 'Confirme a senha.' });
      } else if (forcedState === 'senhas ≠') {
        setSt('form'); setNome('Ana Paula Souza'); setEmail('ana.souza@empresa.com'); setSenha('NovaSenha1!'); setConf('NovaSenha2!');
        setErrs({ conf: 'As senhas não coincidem.' });
      } else if (forcedState === 'e-mail em uso') {
        setSt('erro'); setErrs({});
      } else {
        setSt(forcedState || 'form'); setErrs({});
      }
    }, [forcedState, flow]);
    function submit(e) {
      e.preventDefault();
      const ne = {};
      if (!nome.trim()) ne.nome = 'Informe seu nome completo.';
      if (!email.trim()) ne.email = 'Informe seu e-mail.';
      else if (!isEmail(email)) ne.email = 'E-mail inválido.';
      if (!senha) ne.senha = 'Crie uma senha.';
      else if (senha.length < 8) ne.senha = 'A senha deve ter no mínimo 8 caracteres.';
      if (!conf) ne.conf = 'Confirme a senha.';
      else if (senha && conf !== senha) ne.conf = 'As senhas não coincidem.';
      setErrs(ne);
      if (Object.keys(ne).length) return;
      setSt('loading');
      if (flow) setTimeout(() => onNav && onNav('VerificarEmail', { email: email || 'ana.souza@empresa.com' }), 850);
    }
    return (
      <AuthShell title="Criar conta" subtitle="Comece a usar o VORTEX ERP"
        footer={<>Já tem conta? <A onClick={() => onNav && onNav('Login')}>Entrar</A></>}>
        <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {st === 'erro' && <Alert tone="danger">Este e-mail já está cadastrado.</Alert>}
          {errs.conf === 'As senhas não coincidem.'
            ? <Alert tone="danger">As senhas não coincidem. Verifique e tente novamente.</Alert>
            : (Object.keys(errs).some((k) => errs[k]) && <Alert tone="warning">Preencha os campos destacados para continuar.</Alert>)}
          <Input label="Nome completo" value={nome} onChange={(e) => { setNome(e.target.value); clear('nome'); }} placeholder="Seu nome" error={errs.nome} />
          <Input label="E-mail" type="email" value={email} onChange={(e) => { setEmail(e.target.value); clear('email'); }} leadingIcon={<Icon name="mail" size={16} />} placeholder="voce@empresa.com" error={errs.email} />
          <Input label="Senha" type="password" value={senha} onChange={(e) => { setSenha(e.target.value); clear('senha'); }} placeholder="Mínimo 8 caracteres" hint={errs.senha ? undefined : 'Use letras, números e um símbolo.'} error={errs.senha} />
          <Input label="Confirmar senha" type="password" value={conf} onChange={(e) => { setConf(e.target.value); clear('conf'); }} placeholder="Repita a senha" error={errs.conf} />
          <Button type="submit" fullWidth size="lg" disabled={st === 'loading'}
            leadingIcon={st === 'loading' ? <Spinner size={17} color="#fff" /> : null}>
            {st === 'loading' ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
      </AuthShell>
    );
  }

  // ─────────────────────────────────────────  VERIFICAR E-MAIL  /verificar-email
  function VerificarEmail({ onNav, flow, data }) {
    const [resent, setResent] = React.useState(false);
    const email = (data && data.email) || 'ana.souza@empresa.com';
    return (
      <AuthShell footer={<A onClick={() => onNav && onNav('Login')}>Voltar para o login</A>}>
        <StatusDisc tone="info" />
        <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>Verifique seu e-mail</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginBottom: 22 }}>
          Enviamos um link de confirmação para<br />
          <strong style={{ color: 'var(--text-strong)' }}>{email}</strong>. Abra o e-mail e clique no link para ativar sua conta.
        </p>
        {resent && <div style={{ marginBottom: 16 }}><Alert tone="success">Link reenviado com sucesso.</Alert></div>}
        <Button variant="secondary" fullWidth onClick={() => setResent(true)} leadingIcon={<Icon name="refresh" size={16} />}>
          Reenviar e-mail
        </Button>
        {flow && <SimLink onClick={() => onNav && onNav('ContaConfirmada')}>Simular clique no link do e-mail →</SimLink>}
      </AuthShell>
    );
  }

  // ─────────────────────────────────────────  CONTA CONFIRMADA  /conta-confirmada
  function ContaConfirmada({ forcedState, onNav, flow }) {
    const [st, setSt] = React.useState(flow ? 'aguardando' : (forcedState || 'sucesso'));
    React.useEffect(() => { if (!flow) setSt(forcedState || 'sucesso'); }, [forcedState, flow]);
    React.useEffect(() => {
      if (flow && st === 'aguardando') {
        const t = setTimeout(() => setSt('sucesso'), 1600);
        return () => clearTimeout(t);
      }
    }, [flow, st]);

    if (st === 'aguardando') {
      return (
        <AuthShell>
          <StatusDisc tone="info" spinning />
          <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>Confirmando sua conta…</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Aguarde um instante enquanto validamos o link.</p>
        </AuthShell>
      );
    }
    if (st === 'erro') {
      return (
        <AuthShell footer={<A onClick={() => onNav && onNav('Login')}>Voltar para o login</A>}>
          <StatusDisc tone="danger" />
          <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>Link inválido ou expirado</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginBottom: 22 }}>
            Não foi possível confirmar sua conta. Solicite um novo link de verificação.
          </p>
          <Button fullWidth onClick={() => onNav && onNav('Cadastro')}>Criar conta novamente</Button>
        </AuthShell>
      );
    }
    return (
      <AuthShell>
        <StatusDisc tone="success" />
        <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>Conta confirmada!</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginBottom: 22 }}>
          Sua conta foi ativada com sucesso. Você já pode acessar o sistema.
        </p>
        <Button fullWidth size="lg" onClick={() => onNav && onNav('Login')} trailingIcon={<Icon name="arrowRight" size={16} />}>
          Ir para o login
        </Button>
      </AuthShell>
    );
  }

  // ─────────────────────────────────────────  ESQUECI A SENHA  /esqueci-senha
  function EsqueciSenha({ forcedState, onNav, flow }) {
    const [st, setSt] = React.useState(forcedState || 'form');
    React.useEffect(() => setSt(forcedState || 'form'), [forcedState]);
    const email = 'ana.souza@empresa.com';
    if (st === 'enviado') {
      return (
        <AuthShell footer={<A onClick={() => onNav && onNav('Login')}>Voltar para o login</A>}>
          <StatusDisc tone="info" />
          <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>Verifique seu e-mail</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55 }}>
            Se houver uma conta com <strong style={{ color: 'var(--text-strong)' }}>{email}</strong>, enviamos um link para redefinir sua senha.
          </p>
          {flow && <SimLink onClick={() => onNav && onNav('RedefinirSenha')}>Simular clique no link do e-mail →</SimLink>}
        </AuthShell>
      );
    }
    return (
      <AuthShell title="Esqueceu a senha?" subtitle="Informe seu e-mail e enviaremos um link para redefinir."
        footer={<A onClick={() => onNav && onNav('Login')}>Voltar para o login</A>}>
        <EsqueciForm onEnviar={() => setSt('enviado')} />
      </AuthShell>
    );
  }

  function EsqueciForm({ onEnviar }) {
    const [email, setEmail] = React.useState('');
    const [erro, setErro] = React.useState('');
    function submit(e) {
      e.preventDefault();
      if (!email.trim()) { setErro('Informe seu e-mail.'); return; }
      if (!isEmail(email)) { setErro('E-mail inválido.'); return; }
      setErro('');
      onEnviar();
    }
    return (
      <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {erro && <Alert tone="warning">Preencha o campo destacado para continuar.</Alert>}
        <Input label="E-mail" type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (erro) setErro(''); }} leadingIcon={<Icon name="mail" size={16} />} placeholder="voce@empresa.com" error={erro} />
        <Button type="submit" fullWidth size="lg">Enviar link de redefinição</Button>
      </form>
    );
  }

  // ─────────────────────────────────────────  REDEFINIR SENHA  /redefinir-senha
  function RedefinirSenha({ forcedState, onNav, flow }) {
    const initState = flow ? 'aguardando' : (forcedState === 'erro' ? 'form' : (forcedState || 'form'));
    const [st, setSt] = React.useState(initState);
    const [senha, setSenha] = React.useState(forcedState === 'erro' ? 'NovaSenha1!' : '');
    const [conf, setConf] = React.useState(forcedState === 'erro' ? 'NovaSenha2!' : '');
    const [errs, setErrs] = React.useState(forcedState === 'erro' ? { conf: 'As senhas não coincidem.' } : {});
    const clear = (campo) => setErrs((p) => (p[campo] ? { ...p, [campo]: undefined } : p));
    React.useEffect(() => {
      if (flow) return;
      if (forcedState === 'erro') {
        setSt('form'); setSenha('NovaSenha1!'); setConf('NovaSenha2!'); setErrs({ conf: 'As senhas não coincidem.' });
      } else {
        setSt(forcedState || 'form'); setErrs({});
      }
    }, [forcedState, flow]);
    React.useEffect(() => {
      if (flow && st === 'aguardando') {
        const t = setTimeout(() => setSt('form'), 1300);
        return () => clearTimeout(t);
      }
    }, [flow, st]);

    function submit(e) {
      e.preventDefault();
      const ne = {};
      if (!senha) ne.senha = 'Crie uma nova senha.';
      else if (senha.length < 8) ne.senha = 'A senha deve ter no mínimo 8 caracteres.';
      if (!conf) ne.conf = 'Confirme a nova senha.';
      else if (senha && conf !== senha) ne.conf = 'As senhas não coincidem.';
      setErrs(ne);
      if (Object.keys(ne).some((k) => ne[k])) return;
      setSt('sucesso');
    }

    if (st === 'aguardando') {
      return (
        <AuthShell>
          <StatusDisc tone="info" spinning />
          <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>Validando link…</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Verificando seu link de recuperação.</p>
        </AuthShell>
      );
    }
    if (st === 'sucesso') {
      return (
        <AuthShell>
          <StatusDisc tone="success" />
          <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>Senha redefinida!</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginBottom: 22 }}>
            Sua senha foi alterada com sucesso. Use a nova senha para entrar.
          </p>
          <Button fullWidth size="lg" onClick={() => onNav && onNav('Login')} trailingIcon={<Icon name="arrowRight" size={16} />}>Ir para o login</Button>
        </AuthShell>
      );
    }
    const temVazio = errs.senha === 'Crie uma nova senha.' || errs.conf === 'Confirme a nova senha.';
    const temErro = Object.keys(errs).some((k) => errs[k]);
    return (
      <AuthShell title="Redefinir senha" subtitle="Escolha uma nova senha para sua conta.">
        <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {temErro && <Alert tone={temVazio ? 'warning' : 'danger'}>{temVazio ? 'Preencha os campos destacados para continuar.' : (errs.conf || errs.senha)}</Alert>}
          <Input label="Nova senha" type="password" placeholder="Mínimo 8 caracteres"
            hint={errs.senha ? undefined : 'Use letras, números e um símbolo.'}
            value={senha} onChange={(e) => { setSenha(e.target.value); clear('senha'); }}
            error={errs.senha} />
          <Input label="Confirmar nova senha" type="password" placeholder="Repita a senha"
            value={conf} onChange={(e) => { setConf(e.target.value); clear('conf'); }}
            error={errs.conf} />
          <Button type="submit" fullWidth size="lg">Redefinir senha</Button>
        </form>
      </AuthShell>
    );
  }

  window.AuthScreens = { Login, Cadastro, VerificarEmail, ContaConfirmada, EsqueciSenha, RedefinirSenha };
})();
