import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Input, Button, Icon } from '../design-system/components';
import { AuthShell, Alert, StatusDisc } from '../components/auth/AuthKit';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erroEmail, setErroEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) { setErroEmail('Informe seu e-mail.'); return; }
    if (!isEmail(email)) { setErroEmail('E-mail inválido.'); return; }
    setErroEmail('');
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });
    // Sempre mostra sucesso para evitar enumeração de e-mails
    setEnviado(true);
    setLoading(false);
  }

  const footer = (
    <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
      Voltar para o login
    </Link>
  );

  if (enviado) {
    return (
      <AuthShell footer={footer}>
        <StatusDisc tone="info" />
        <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>
          Verifique seu e-mail
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55 }}>
          Se houver uma conta com{' '}
          <strong style={{ color: 'var(--text-strong)' }}>{email}</strong>,{' '}
          enviamos um link para redefinir sua senha.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Esqueceu a senha?"
      subtitle="Informe seu e-mail e enviaremos um link para redefinir."
      footer={footer}
    >
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {erroEmail && <Alert tone="warning">Preencha o campo destacado para continuar.</Alert>}
        <Input
          label="E-mail" type="email" value={email}
          onChange={(e) => { setEmail(e.target.value); if (erroEmail) setErroEmail(''); }}
          leadingIcon={<Icon name="mail" size={16} />}
          placeholder="voce@empresa.com"
          error={erroEmail}
        />
        <Button type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar link de redefinição'}
        </Button>
      </form>
    </AuthShell>
  );
}
