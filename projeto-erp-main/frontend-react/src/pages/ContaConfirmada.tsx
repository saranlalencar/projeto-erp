import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button, Icon } from '../design-system/components';
import { AuthShell, StatusDisc } from '../components/auth/AuthKit';

type Estado = 'aguardando' | 'sucesso' | 'erro';

export function ContaConfirmada() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<Estado>('aguardando');

  useEffect(() => {
    // Supabase processa o token de confirmação automaticamente a partir do hash da URL.
    // Ouvimos o evento SIGNED_IN que indica verificação bem-sucedida.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setEstado('sucesso');
      } else if (event === 'TOKEN_REFRESHED') {
        setEstado('sucesso');
      }
    });

    // Se após 5s nenhum evento chegar, o link é inválido/expirado
    const timeout = setTimeout(() => {
      setEstado((prev) => prev === 'aguardando' ? 'erro' : prev);
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (estado === 'aguardando') {
    return (
      <AuthShell>
        <StatusDisc tone="info" spinning />
        <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>
          Confirmando sua conta…
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Aguarde um instante enquanto validamos o link.
        </p>
      </AuthShell>
    );
  }

  if (estado === 'erro') {
    return (
      <AuthShell footer={
        <a href="#"
          style={{ fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer' }}
          onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
          Voltar para o login
        </a>
      }>
        <StatusDisc tone="danger" />
        <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>
          Link inválido ou expirado
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginBottom: 22 }}>
          Não foi possível confirmar sua conta. Solicite um novo link de verificação.
        </p>
        <Button fullWidth onClick={() => navigate('/cadastro')}>
          Criar conta novamente
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <StatusDisc tone="success" />
      <h1 style={{ fontSize: 'var(--text-xl)', textAlign: 'center', marginBottom: 8 }}>
        Conta confirmada com sucesso!
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginBottom: 22 }}>
        Seu endereço de e-mail foi verificado e sua conta está ativa. Agora você já pode acessar o sistema utilizando suas credenciais.
      </p>
      <Button fullWidth size="lg" onClick={() => navigate('/login')}
        trailingIcon={<Icon name="arrowRight" size={16} />}>
        Ir para o login
      </Button>
    </AuthShell>
  );
}
