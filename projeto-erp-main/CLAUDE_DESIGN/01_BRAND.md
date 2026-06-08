# VORTEX — Identidade de Marca

## Nome do Sistema
**VORTEX**

## Tagline
> "Gestão integrada. Controle total."

## Submarca / Descritivo
VORTEX Sistema ERP Integrado  
Vendas · Financeiro · Estoque · Cadastros

---

## Logotipo (descrição para geração/implementação)

### Forma
Wordmark tipográfico — somente texto, sem ícone externo.  
A letra **V** pode ter um detalhe sutil: as duas hastes em ângulo formam uma seta apontando para baixo (convergência), simbolizando centralização e controle.

### Tipografia do Logo
- Fonte: **Inter** — peso **800 (ExtraBold)**
- Letras: MAIÚSCULAS
- Espaçamento entre letras: `0.15em`
- Cor no fundo escuro (sidebar): `#ffffff`
- Cor no fundo claro (login, documentos): `#0f172a`

### Variações de uso

| Contexto | Versão |
|----------|--------|
| Sidebar (fundo `#0f172a`) | VORTEX em branco `#ffffff` |
| Tela de Login | VORTEX em `#0f172a` + tagline em `#64748b` |
| Favicon / ícone | Letra **V** em `#1e40af` sobre fundo `#0f172a` |

### Implementação React (sidebar)
```tsx
<div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #1e293b' }}>
  <div style={{
    fontSize: '22px',
    fontWeight: 800,
    letterSpacing: '0.15em',
    color: '#ffffff',
    fontFamily: 'Inter, system-ui, sans-serif',
  }}>
    VORTEX
  </div>
  <div style={{
    fontSize: '10px',
    color: '#64748b',
    letterSpacing: '0.05em',
    marginTop: '2px',
    textTransform: 'uppercase',
  }}>
    Sistema ERP
  </div>
</div>
```

### Implementação React (tela de login)
```tsx
<div style={{ textAlign: 'center', marginBottom: '32px' }}>
  <div style={{
    fontSize: '36px',
    fontWeight: 800,
    letterSpacing: '0.15em',
    color: '#0f172a',
    fontFamily: 'Inter, system-ui, sans-serif',
  }}>
    VORTEX
  </div>
  <div style={{
    fontSize: '13px',
    color: '#64748b',
    marginTop: '4px',
  }}>
    Gestão integrada. Controle total.
  </div>
</div>
```

---

## Tom de voz
- Direto e objetivo
- Sem jargões desnecessários
- Mensagens de erro claras e sem detalhes técnicos expostos
- Confirmações positivas e concisas

## Exemplos de mensagens

| Contexto | Mensagem |
|----------|----------|
| Login bem-sucedido | "Bem-vindo de volta, [Nome]." |
| Erro de credenciais | "Email ou senha incorretos." |
| Item salvo | "Registro salvo com sucesso." |
| Confirmação de exclusão | "Tem certeza? Esta ação não pode ser desfeita." |
| Estoque insuficiente | "Estoque insuficiente para [Produto]. Disponível: [N] unidades." |
| Sem permissão | "Você não tem acesso a este módulo." |
