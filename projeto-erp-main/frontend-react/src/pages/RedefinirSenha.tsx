import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Input, Button, Icon } from '../design-system/components';
import { AuthShell, Alert, StatusDisc, Spinner } from '../components/auth/AuthKit';

export function RedefinirSenha() {
  const navigate = useNavigate();
  const [pronto, setPronto] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [senha, setSenha] = useState('');
  const [conf, setConf] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase detecta o token de recovery no hash da URL e dispara PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setPronto(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  function clearErro(campo: string) {
    setErros((p) => p[campo] ? { ...p, [campo]: '' } : p);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ne: Record<string, string> = {};
    if (!senha) ne.senha = 'Crie uma nova senha.';
    else if (senha.length < 8) ne.senha = 'A senha deve ter no mínimo 8 caracteres.';
    if (!conf) ne.conf = 'Confirme a nova senha.';
    else if (senha && conf !== senha) ne.conf = 'As senhas não coincidem.';
    setErros(ne);
    if (Object.keys(ne).length) return;

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) {
      setErros({ conf: 'Erro ao redefinir senha. O link pode ter expirado.' });
    } else {
      await supabase.auth.signOut();
      setSucesso(true);
    }
    setLoading(false);
  }

  if (sucesso) {
    return (
      <AuthShell>
        <StatusDisc tone="success" />
        <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>
          Senha redefinida!
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginBottom: 22 }}>
          Sua senha foi alterada com sucesso. Use a nova senha para entrar.
        </p>
        <Button fullWidth size="lg" onClick={() => navigate('/login')}
          trailingIcon={<Icon name="arrowRight" size={16} />}>
          Ir para o login
        </Button>
      </AuthShell>
    );
  }

  if (!pronto) {
    return (
      <AuthShell>
        <StatusDisc tone="info" spinning />
        <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>
          Validando link…
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginBottom: 22 }}>
          Verificando seu link de recuperação.
        </p>
        <Link to="/esqueci-senha" style={{ textDecoration: 'none' }}>
          <Button fullWidth variant="secondary">Solicitar novo link</Button>
        </Link>
      </AuthShell>
    );
  }

  const temVazio = erros.senha === 'Crie uma nova senha.' || erros.conf === 'Confirme a nova senha.';
  const temErro = Object.values(erros).some(Boolean);

  return (
    <AuthShell
      title="Redefinir senha"
      subtitle="Escolha uma nova senha para sua conta."
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {temErro && (
          <Alert tone={temVazio ? 'warning' : 'danger'}>
            {temVazio ? 'Preencha os campos destacados para continuar.' : (erros.conf || erros.senha)}
          </Alert>
        )}
        <Input
          label="Nova senha" type="password" value={senha}
          onChange={(e) => { setSenha(e.target.value); clearErro('senha'); }}
          placeholder="Mínimo 8 caracteres"
          hint={erros.senha ? undefined : 'Use letras, números e um símbolo.'}
          error={erros.senha}
        />
        <Input
          label="Confirmar nova senha" type="password" value={conf}
          onChange={(e) => { setConf(e.target.value); clearErro('conf'); }}
          placeholder="Repita a senha"
          error={erros.conf}
        />
        <Button type="submit" fullWidth size="lg" disabled={loading}
          leadingIcon={loading ? <Spinner size={17} color="#fff" /> : undefined}>
          {loading ? 'Salvando...' : 'Redefinir senha'}
        </Button>
      </form>
    </AuthShell>
  );
}
