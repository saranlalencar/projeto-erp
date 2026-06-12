import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Input, Button, Icon } from '../design-system/components';
import { AuthShell, Alert, Spinner } from '../components/auth/AuthKit';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [conf, setConf] = useState('');
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGlobal, setErroGlobal] = useState('');
  const [loading, setLoading] = useState(false);

  function clearErro(campo: string) {
    setErros((p) => p[campo] ? { ...p, [campo]: '' } : p);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroGlobal('');
    const ne: Record<string, string> = {};
    if (!nome.trim()) ne.nome = 'Informe seu nome completo.';
    if (!email.trim()) ne.email = 'Informe seu e-mail.';
    else if (!isEmail(email)) ne.email = 'E-mail inválido.';
    if (!senha) ne.senha = 'Crie uma senha.';
    else if (senha.length < 8) ne.senha = 'A senha deve ter no mínimo 8 caracteres.';
    if (!conf) ne.conf = 'Confirme a senha.';
    else if (senha && conf !== senha) ne.conf = 'As senhas não coincidem.';
    setErros(ne);
    if (Object.keys(ne).length) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { name: nome } },
    });

    if (error) {
      if (error.message.includes('already registered')) setErroGlobal('Este e-mail já está cadastrado.');
      else setErroGlobal('Erro ao criar conta. Tente novamente.');
      setLoading(false);
      return;
    }

    navigate('/verificar-email', { state: { email } });
    setLoading(false);
  }

  const temCampoVazio = Object.values(erros).some(Boolean);
  const temSenhasDif = erros.conf === 'As senhas não coincidem.';

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Comece a usar o VORTEX ERP"
      footer={<>Já tem conta? <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>Entrar</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {erroGlobal && <Alert tone="danger">{erroGlobal}</Alert>}
        {!erroGlobal && temSenhasDif && <Alert tone="danger">As senhas não coincidem. Verifique e tente novamente.</Alert>}
        {!erroGlobal && !temSenhasDif && temCampoVazio && <Alert tone="warning">Preencha os campos destacados para continuar.</Alert>}

        <Input
          label="Nome completo" value={nome}
          onChange={(e) => { setNome(e.target.value); clearErro('nome'); }}
          placeholder="Seu nome"
          error={erros.nome}
        />
        <Input
          label="E-mail" type="email" value={email}
          onChange={(e) => { setEmail(e.target.value); clearErro('email'); }}
          leadingIcon={<Icon name="mail" size={16} />}
          placeholder="voce@empresa.com"
          error={erros.email}
        />
        <Input
          label="Senha" type="password" value={senha}
          onChange={(e) => { setSenha(e.target.value); clearErro('senha'); }}
          placeholder="Mínimo 8 caracteres"
          hint={erros.senha ? undefined : 'Use letras, números e um símbolo.'}
          error={erros.senha}
        />
        <Input
          label="Confirmar senha" type="password" value={conf}
          onChange={(e) => { setConf(e.target.value); clearErro('conf'); }}
          placeholder="Repita a senha"
          error={erros.conf}
        />
        <Button type="submit" fullWidth size="lg" disabled={loading}
          leadingIcon={loading ? <Spinner size={17} color="#fff" /> : undefined}>
          {loading ? 'Criando conta...' : 'Criar conta'}
        </Button>
      </form>
    </AuthShell>
  );
}
