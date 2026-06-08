# VORTEX — Ícones

## Biblioteca: Lucide React

**Por quê Lucide?**
- Ícones limpos, traço fino (stroke), visual corporativo
- Tree-shakeable — apenas os ícones usados entram no bundle
- Consistente em tamanho e peso visual
- Padrão em projetos React profissionais (usado por Shadcn, Vercel, Linear)
- Gratuito e open source

---

## Instalação

```bash
npm install lucide-react
```

---

## Mapa de ícones por módulo

| Módulo / Ação | Ícone Lucide | Import |
|---------------|-------------|--------|
| Dashboard | `LayoutDashboard` | `import { LayoutDashboard } from 'lucide-react'` |
| Clientes | `Users` | `import { Users } from 'lucide-react'` |
| Fornecedores | `Building2` | `import { Building2 } from 'lucide-react'` |
| Estoque | `Package` | `import { Package } from 'lucide-react'` |
| Vendas / Kanban | `ShoppingCart` | `import { ShoppingCart } from 'lucide-react'` |
| Financeiro | `Wallet` | `import { Wallet } from 'lucide-react'` |
| Relatórios | `BarChart3` | `import { BarChart3 } from 'lucide-react'` |
| Usuários | `Shield` | `import { Shield } from 'lucide-react'` |
| Logout | `LogOut` | `import { LogOut } from 'lucide-react'` |
| Adicionar / Novo | `Plus` | `import { Plus } from 'lucide-react'` |
| Editar | `Pencil` | `import { Pencil } from 'lucide-react'` |
| Excluir | `Trash2` | `import { Trash2 } from 'lucide-react'` |
| Busca | `Search` | `import { Search } from 'lucide-react'` |
| Fechar modal | `X` | `import { X } from 'lucide-react'` |
| Alerta / Aviso | `AlertTriangle` | `import { AlertTriangle } from 'lucide-react'` |
| Sucesso / Check | `CheckCircle` | `import { CheckCircle } from 'lucide-react'` |
| Erro | `XCircle` | `import { XCircle } from 'lucide-react'` |
| Info | `Info` | `import { Info } from 'lucide-react'` |
| Ajuste de estoque | `ArrowUpDown` | `import { ArrowUpDown } from 'lucide-react'` |
| Ativar/Inativar | `ToggleLeft` / `ToggleRight` | `import { ToggleLeft, ToggleRight } from 'lucide-react'` |
| Conta a receber | `TrendingUp` | `import { TrendingUp } from 'lucide-react'` |
| Conta a pagar | `TrendingDown` | `import { TrendingDown } from 'lucide-react'` |
| Calendário / Data | `Calendar` | `import { Calendar } from 'lucide-react'` |
| Download / Export | `Download` | `import { Download } from 'lucide-react'` |
| Filtro | `Filter` | `import { Filter } from 'lucide-react'` |
| Histórico | `ClockArrowUp` | `import { History } from 'lucide-react'` |
| Kanban / Mover | `KanbanSquare` | `import { KanbanSquare } from 'lucide-react'` |
| Saldo / Moeda | `DollarSign` | `import { DollarSign } from 'lucide-react'` |
| Olho (ver) | `Eye` | `import { Eye } from 'lucide-react'` |

---

## Tamanhos padrão

| Contexto | Tamanho | strokeWidth |
|----------|---------|-------------|
| Menu da sidebar | `20px` | `1.75` |
| Botões com ícone | `16px` | `2` |
| Ícones de ação na tabela | `15px` | `1.75` |
| Ícone decorativo em card | `24px` | `1.5` |
| Toast / alerta inline | `16px` | `2` |

---

## Uso padrão no código

```tsx
import { Users, Plus, Pencil, Trash2 } from 'lucide-react'

// ─── Na sidebar ───
<Users size={20} strokeWidth={1.75} />

// ─── Botão com ícone ───
<button style={btnPrimary}>
  <Plus size={16} strokeWidth={2} style={{ marginRight: '6px' }} />
  Novo Cliente
</button>

// ─── Ações na tabela ───
<button title="Editar" style={btnIcon}>
  <Pencil size={15} strokeWidth={1.75} />
</button>
<button title="Excluir" style={{ ...btnIcon, color: '#dc2626' }}>
  <Trash2 size={15} strokeWidth={1.75} />
</button>

// ─── Estilo de botão só ícone ───
const btnIcon = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#64748b',
  padding: '4px',
  borderRadius: '4px',
  display: 'inline-flex',
  alignItems: 'center',
}
```

---

## Ícone de perfil de usuário (avatar)

Use as iniciais do nome do usuário em um círculo — sem imagem externa:

```tsx
const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div style={{
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#1e3a8a',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '0.05em',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}
```
