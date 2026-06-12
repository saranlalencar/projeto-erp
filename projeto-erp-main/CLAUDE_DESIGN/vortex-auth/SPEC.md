# VORTEX — Especificação do Fluxo de Autenticação

Documentação visual e lógica das **6 telas de autenticação**, no formato de design system VORTEX (Corporate Navy + Slate, light mode, pt-BR). Integração de backend assumida via **Supabase Auth**.

> **Onde ver:** `ui_kits/vortex-auth/index.html` — navegador interativo. Escolha a **tela** na barra lateral e o **estado** na barra superior.

---

## 1. Tokens & paleta (referência rápida)

Todas as telas consomem as CSS variables do design system (`styles.css`). As mais usadas no fluxo de auth:

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#1e40af` | Botão primário, links, mark |
| `--color-primary-hover` | `#1d4ed8` | Hover do botão |
| `--bg-page` | `#f1f5f9` | Fundo da tela |
| `--surface-card` | `#ffffff` | Card central |
| `--border-default` | `#e2e8f0` | Borda do card / inputs |
| `--text-strong` | `#0f172a` | Títulos |
| `--text-muted` | `#64748b` | Subtítulos / ajuda |
| `--success-bg` / `--success-text` | `#dcfce7` / `#16a34a` | Sucesso |
| `--danger-bg` / `--danger-text` | `#fee2e2` / `#dc2626` | Erro |
| `--info-bg` / `--info-text` | `#dbeafe` / `#1e40af` | Info (e-mail enviado) |
| `--radius-md` / `--radius-lg` / `--radius-xl` | 6 / 8 / 12px | Inputs / — / card |

**Fontes:** Inter (corpo) + Inter Display (títulos, wordmark).

---

## 2. Componentes reutilizáveis do kit

Arquivo `AuthShell.jsx` exporta `window.AuthKit`:

- **`VortexMark({ size, color })`** — apenas o símbolo espiral (3 arcos + ponto). SVG, herda cor.
- **`AuthLogo({ tile })`** — mark + wordmark "VORTEX". `tile=true` põe o mark num quadrado `--color-primary` (uso padrão nas telas de auth).
- **`AuthShell({ title, subtitle, children, footer, width })`** — wrapper comum: fundo `--bg-page`, logo no topo, card branco centralizado (`--radius-xl`, `--shadow-md`, 400px), footer opcional abaixo. **Todas as 6 telas usam este shell.**
- **`Alert({ tone, children })`** — faixa inline de feedback (danger / success / warning / info) com ícone.
- **`StatusDisc({ tone, spinning })`** — disco 72px para telas de status (✓ sucesso, ✕ erro, ✉ info, ou spinner).
- **`Spinner({ size, color })`** — indicador de carregamento (usado em botões e discos).

Componentes do DS usados: `Input`, `Button`, `Checkbox`, `Icon`.

---

## 3. Especificação por tela

Legenda: **Estado inicial** = o que renderiza ao montar. **Supabase** = chamada de backend. **Navegação** = para onde vai ao concluir.

---

### 3.1 Login — `/login`
**Estados:** `form` · `loading` · `erro`

| | |
|---|---|
| **Inicial** | `form` — título "Acesse sua conta", subtítulo "Sistema ERP Integrado". Campos: E-mail (ícone mail), Senha. Checkbox "Lembrar de mim" + link "Esqueceu a senha?". Botão primário "Entrar". Footer: "Não tem conta? Cadastre-se". |
| **loading** | Botão desabilitado com spinner + texto "Entrando…". Disparado no submit. |
| **erro** | `<Alert tone="danger">` no topo do form: "E-mail ou senha incorretos." |
| **Supabase** | `supabase.auth.signInWithPassword({ email, password })` |
| **Navegação** | Sucesso → `/` (dashboard). "Cadastre-se" → `/cadastro`. "Esqueceu a senha?" → `/esqueci-senha`. |

```ts
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) setState('erro');
else navigate('/');
```

---

### 3.2 Cadastro — `/cadastro`
**Estados:** `form` · `loading` · `erro`

| | |
|---|---|
| **Inicial** | `form` — título "Criar conta", subtítulo "Comece a usar o VORTEX ERP". Campos: Nome completo, E-mail, Senha (com hint de força), Confirmar senha. Botão "Criar conta". Footer: "Já tem conta? Entrar". |
| **loading** | Botão com spinner + "Criando conta…". |
| **erro** | `<Alert tone="danger">`: "Este e-mail já está cadastrado." (ou validação: senhas não conferem). |
| **Supabase** | `supabase.auth.signUp({ email, password, options: { data: { nome }, emailRedirectTo } })` |
| **Navegação** | Sucesso → `/verificar-email`, **passando o e-mail via state de rota**. "Entrar" → `/login`. |

```ts
const { error } = await supabase.auth.signUp({
  email, password,
  options: { data: { nome }, emailRedirectTo: `${origin}/conta-confirmada` },
});
if (error) setState('erro');
else navigate('/verificar-email', { state: { email } });
```

---

### 3.3 Verificar E-mail — `/verificar-email`
**Estados:** `info` (único). **Recebe `email` via state de rota.**

| | |
|---|---|
| **Inicial** | `info` — `StatusDisc` azul (ícone mail). Título "Verifique seu e-mail". Texto: "Enviamos um link de confirmação para **{email}**…". Botão secundário "Reenviar e-mail". Footer: "Voltar para o login". |
| **Sub-estado** | Após reenviar → `<Alert tone="success">`: "Link reenviado com sucesso." |
| **Supabase** | `supabase.auth.resend({ type: 'signup', email })` |
| **Navegação** | "Voltar para o login" → `/login`. (A confirmação real acontece quando o usuário clica no link do e-mail → `/conta-confirmada`.) |

```ts
const email = location.state?.email ?? '';   // fallback se acessado direto
await supabase.auth.resend({ type: 'signup', email });
```

---

### 3.4 Conta Confirmada — `/conta-confirmada`
**Estados:** `aguardando` · `sucesso` · `erro`. Destino do link de e-mail.

| | |
|---|---|
| **Inicial** | `aguardando` — `StatusDisc` azul **com spinner**. "Confirmando sua conta…". Valida o token da URL. |
| **sucesso** | `StatusDisc` verde (✓). "Conta confirmada!". Botão "Ir para o login" (seta). |
| **erro** | `StatusDisc` vermelho (✕). "Link inválido ou expirado". Botão "Criar conta novamente". |
| **Supabase** | O SDK detecta o token na URL automaticamente; escute `onAuthStateChange`, ou use `verifyOtp({ token_hash, type: 'signup' })`. |
| **Navegação** | sucesso → `/login` (ou `/` se auto-login). erro → `/cadastro`. |

```ts
useEffect(() => {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') setState('sucesso');
  });
  // timeout de segurança → setState('erro')
}, []);
```

---

### 3.5 Esqueci a Senha — `/esqueci-senha`
**Estados:** `form` · `enviado`

| | |
|---|---|
| **Inicial** | `form` — título "Esqueceu a senha?", subtítulo explicativo. Campo único: E-mail (ícone mail). Botão "Enviar link de redefinição". Footer: "Voltar para o login". |
| **enviado** | `StatusDisc` azul (mail). "Verifique seu e-mail". Texto neutro por segurança: "Se houver uma conta com **{email}**, enviamos um link…" (não revela se o e-mail existe). |
| **Supabase** | `supabase.auth.resetPasswordForEmail(email, { redirectTo: \`${origin}/redefinir-senha\` })` |
| **Navegação** | "Voltar para o login" → `/login`. |

```ts
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${origin}/redefinir-senha`,
});
setState('enviado');   // sempre, mesmo se o e-mail não existir
```

---

### 3.6 Redefinir Senha — `/redefinir-senha`
**Estados:** `aguardando` · `form` · `erro` · `sucesso`. Destino do link de recuperação.

| | |
|---|---|
| **Inicial** | `aguardando` — `StatusDisc` azul com spinner. "Validando link…". Confirma o token de recuperação. |
| **form** | Token válido → campos: Nova senha (hint de força), Confirmar nova senha. Botão "Redefinir senha". |
| **erro** | Validação **client-side** no submit. Se a senha tem < 8 caracteres → "A senha deve ter no mínimo 8 caracteres." Se **nova senha ≠ confirmar senha** → `<Alert tone="danger">` "As senhas não coincidem. Verifique e tente novamente." + borda vermelha nos campos. **Permanece no form**, não chama o Supabase. O alerta some ao editar qualquer campo. |
| **sucesso** | `StatusDisc` verde (✓). "Senha redefinida!". Botão "Ir para o login". |
| **Supabase** | Só é chamado **após** passar na validação: sessão de recovery vem do link; então `supabase.auth.updateUser({ password })`. |
| **Navegação** | sucesso → `/login`. (Token inválido/expirado pode reusar o estado de erro do padrão 3.4.) |

```ts
function submit() {
  if (senha.length < 8) return setErr('A senha deve ter no mínimo 8 caracteres.');
  if (senha !== confirmar) return setErr('As senhas não coincidem. Verifique e tente novamente.');
  const { error } = await supabase.auth.updateUser({ password: senha });
  setState(error ? 'form' : 'sucesso');
}
```
> A validação de **senhas iguais** é feita no cliente, antes de qualquer chamada ao backend — feedback imediato e sem ida ao servidor. O token de recovery chega via `onAuthStateChange(event === 'PASSWORD_RECOVERY')`, que libera o estado `form`.

---

## 4. Padrões transversais

- **Layout:** todas as telas = `AuthShell` (card 400px centralizado sobre `--bg-page`). Telas de status (verificar/confirmada/redefinir) trocam o form por `StatusDisc` + título + texto + 1 botão.
- **Validação:** mínima inline. Senha ≥ 8 caracteres; confirmação deve bater; e-mail formato válido. Erros de campo via prop `error` do `Input` (borda + texto vermelho). Erros de servidor via `<Alert tone="danger">` no topo do form.
- **Segurança de cópia:** mensagens de recuperação **nunca confirmam se um e-mail existe** ("Se houver uma conta com…").
- **Loading:** botões mostram `Spinner` + verbo no gerúndio ("Entrando…", "Criando conta…"). Botão fica `disabled`.
- **Acessibilidade:** foco visível (anel `--focus-ring`), labels em todos os inputs, `aria-label` no spinner, hit targets ≥ 44px nos botões `size="lg"`.
- **Motion:** apenas o spinner gira (0.8s linear). Sem animações de entrada.
- **Rotas → arquivo (no app real):** `pages/auth/Login.tsx`, `Cadastro.tsx`, `VerificarEmail.tsx`, `ContaConfirmada.tsx`, `EsqueciSenha.tsx`, `RedefinirSenha.tsx`, todas envolvidas por um `<AuthLayout>` (= `AuthShell`).

---

## 5. Mapa de navegação

```
/login ──"Cadastre-se"──▶ /cadastro ──signUp ok──▶ /verificar-email
   ▲                                                      │
   │                                          (clique no link do e-mail)
   │                                                      ▼
   │                                            /conta-confirmada
   │                                              │ sucesso → /login
   │                                              │ erro → /cadastro
   │
   ├──"Esqueceu a senha?"──▶ /esqueci-senha ──envio──▶ (e-mail)
   │                                                      │
   │                                          (clique no link do e-mail)
   │                                                      ▼
   └──────────────────◀── sucesso ──── /redefinir-senha
```
