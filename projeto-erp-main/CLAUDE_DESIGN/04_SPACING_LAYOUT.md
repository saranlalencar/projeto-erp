# VORTEX — Espaçamento e Layout

## Grid do Layout Principal

```
┌────────────────────────────────────────────────────────┐
│  Sidebar 240px (fixa, #0f172a)  │  Área de conteúdo   │
│                                 │  margin-left: 240px  │
│  Logo VORTEX                    │                      │
│  ─────────────                  │  Topbar (64px alto)  │
│  > Dashboard                    │  ─────────────────── │
│    Clientes                     │                      │
│    Fornecedores                 │  Conteúdo da página  │
│    Estoque                      │  padding: 32px       │
│    Vendas                       │  bg: #f1f5f9         │
│    Financeiro                   │                      │
│    Relatórios                   │                      │
│    Usuários                     │                      │
│  ─────────────                  │                      │
│  Avatar + nome                  │                      │
│  Logout                         │                      │
└────────────────────────────────────────────────────────┘
```

---

## Escala de Espaçamento (múltiplos de 4px)

| Token | Valor | Uso típico |
|-------|-------|-----------|
| `xs` | `4px` | Gap entre ícone e texto, padding de badge |
| `sm` | `8px` | Padding interno de botão (vertical), gap de ícones |
| `md` | `12px` | Padding de input, gap entre campos do form |
| `lg` | `16px` | Padding de botão (horizontal), gap entre cards |
| `xl` | `24px` | Padding interno de card, espaço entre seções |
| `2xl` | `32px` | Padding da área de conteúdo da página |
| `3xl` | `48px` | Espaço entre blocos maiores |

---

## Dimensões fixas

| Elemento | Valor |
|----------|-------|
| Sidebar width | `240px` |
| Topbar height | `64px` |
| Botão altura padrão | `36px` |
| Botão altura pequeno | `30px` |
| Input altura | `38px` |
| Badge height | `22px` |
| Linha de tabela (tr) | `52px` |
| Header de tabela (th) | `44px` |
| Modal max-width padrão | `560px` |
| Modal max-width largo | `720px` |
| Card border-radius | `8px` |
| Botão border-radius | `6px` |
| Input border-radius | `6px` |
| Badge border-radius | `9999px` |

---

## Estrutura de página padrão

```tsx
// Toda página segue este padrão interno:

const PageLayout = ({ title, action, children }) => (
  <div style={{ padding: '32px' }}>

    {/* Cabeçalho da página */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
    }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
        {title}
      </h1>
      {action}  {/* Ex: botão "Novo Cliente" */}
    </div>

    {/* Barra de filtros (quando houver) */}
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
    }}>
      {/* inputs de busca e filtros */}
    </div>

    {/* Tabela / conteúdo principal */}
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      {children}
    </div>

  </div>
)
```

---

## Grid de cards de resumo (Dashboard / topo de módulos)

```tsx
// 4 cards em linha (responsivo para 2 colunas em telas menores)
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px',
  marginBottom: '24px',
}}>
  {/* Card individual */}
  <div style={{
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  }}>
    <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      Total de Clientes
    </div>
    <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginTop: '8px', letterSpacing: '-0.02em' }}>
      142
    </div>
  </div>
</div>
```

---

## Estrutura de tabela padrão

```tsx
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th style={{
        padding: '12px 16px',
        textAlign: 'left',
        fontSize: '12px',
        fontWeight: 600,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
      }}>
        Nome
      </th>
      {/* demais colunas */}
    </tr>
  </thead>
  <tbody>
    {items.map((item, i) => (
      <tr key={item.id} style={{
        backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#0f172a' }}>
          {item.nome}
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

---

## Estrutura de modal padrão

```tsx
{/* Overlay */}
<div style={{
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}}>
  {/* Modal */}
  <div style={{
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '560px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  }}>
    {/* Header do modal */}
    <div style={{
      padding: '20px 24px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', margin: 0 }}>
        Título do Modal
      </h2>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
        <X size={20} />
      </button>
    </div>

    {/* Corpo */}
    <div style={{ padding: '24px' }}>
      {/* formulário / conteúdo */}
    </div>

    {/* Rodapé */}
    <div style={{
      padding: '16px 24px',
      borderTop: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px',
      backgroundColor: '#f8fafc',
    }}>
      <button onClick={onClose} style={btnSecondary}>Cancelar</button>
      <button onClick={onSave} style={btnPrimary}>Salvar</button>
    </div>
  </div>
</div>
```
