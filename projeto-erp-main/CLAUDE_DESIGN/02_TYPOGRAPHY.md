# VORTEX — Tipografia

## Família Principal: Inter

**Por quê Inter?**
- Projetada especificamente para interfaces digitais
- Leitura excelente em tamanhos pequenos (ideal para tabelas de ERP)
- Padrão da indústria de SaaS e ferramentas corporativas (Notion, Linear, Vercel)
- Gratuita via Google Fonts
- Suporte completo a caracteres especiais do português (ç, ã, ô, etc.)

---

## Como importar no projeto

### Opção 1 — Google Fonts no index.html (recomendada)
```html
<!-- Adicionar no <head> de index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Opção 2 — CSS import no index.css
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Escala Tipográfica

| Nome | Tamanho | Peso | Uso |
|------|---------|------|-----|
| `display` | `28px` | `800` | Título da tela de login |
| `heading-lg` | `22px` | `800` | Logo VORTEX na sidebar |
| `heading-md` | `20px` | `700` | Título principal de página |
| `heading-sm` | `16px` | `600` | Título de card ou seção |
| `body-lg` | `15px` | `400` | Texto de parágrafos |
| `body` | `14px` | `400` | Texto padrão de interface |
| `body-sm` | `13px` | `400` | Labels secundários, datas |
| `caption` | `12px` | `600` | Header de tabela (uppercase) |
| `micro` | `11px` | `500` | Badges, tags |

---

## Aplicação em CSS inline (padrão do projeto)

```tsx
// ─── Estilos tipográficos prontos para copiar ───

const typography = {

  // Títulos de página (ex: "Clientes", "Estoque")
  pageTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.01em',
  },

  // Subtítulo de seção ou card
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0f172a',
  },

  // Texto padrão de tabelas e formulários
  body: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#0f172a',
    lineHeight: '1.5',
  },

  // Labels de formulário
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '4px',
    display: 'block',
  },

  // Texto auxiliar / muted
  muted: {
    fontSize: '13px',
    fontWeight: 400,
    color: '#64748b',
  },

  // Header de colunas de tabela
  tableHeader: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },

  // Números e valores monetários
  numeric: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#0f172a',
    fontVariantNumeric: 'tabular-nums',
  },

  // Valor grande em card de resumo
  metricValue: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },

  // Label do card de resumo
  metricLabel: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
  },
}
```

---

## Fonte Monospace (valores numéricos e IDs)

Para IDs de pedido, CPF/CNPJ e valores onde alinhamento de dígitos importa:

```tsx
// Adicionar no index.html junto com Inter:
// family=JetBrains+Mono:wght@400;500

const monoStyle = {
  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
  fontSize: '13px',
  fontVariantNumeric: 'tabular-nums',
}

// Uso: ID do pedido, CPF, CNPJ, valores de estoque
<span style={monoStyle}>#00234</span>
<span style={monoStyle}>123.456.789-00</span>
```

---

## Linha de base — Regras gerais

- **Nunca use peso abaixo de 400** na interface
- **Peso 500** para qualquer item interativo (botão, link, item de menu)
- **Peso 600** para ênfase dentro de texto corrido
- **Peso 700/800** apenas para títulos e logo
- **line-height mínimo de 1.5** em todo texto de corpo
- **letter-spacing negativo** (`-0.01em` a `-0.02em`) em títulos grandes — Inter fica mais elegante
- **letter-spacing positivo** (`0.04em` a `0.08em`) em textos UPPERCASE pequenos
