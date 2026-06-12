import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button, Icon } from '../design-system/components';
import { AuthShell, StatusDisc, Alert } from '../components/auth/AuthKit';

export function VerificarEmail() {
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? '';
  const [reenviado, setReenviado] = useState(false);
  const [loadingReenvio, setLoadingReenvio] = useState(false);

  async function handleReenviar() {
    if (!email) return;
    setLoadingReenvio(true);
    await supabase.auth.resend({ type: 'signup', email });
    setReenviado(true);
    setLoadingReenvio(false);
  }

  return (
    <AuthShell footer={
      <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
        Voltar para o login
      </Link>
    }>
      <StatusDisc tone="info" />
      <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>
        Verifique seu e-mail
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginBottom: 22 }}>
        Enviamos um link de confirmação para<br />
        <strong style={{ color: 'var(--text-strong)' }}>{email || 'o seu endereço de e-mail'}</strong>.{' '}
        Abra o e-mail e clique no link para ativar sua conta.
      </p>
      {reenviado && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone="success">Link reenviado com sucesso.</Alert>
        </div>
      )}
      <Button variant="secondary" fullWidth onClick={handleReenviar} disabled={loadingReenvio || reenviado}
        leadingIcon={<Icon name="refresh" size={16} />}>
        Reenviar e-mail
      </Button>
    </AuthShell>
  );
}
