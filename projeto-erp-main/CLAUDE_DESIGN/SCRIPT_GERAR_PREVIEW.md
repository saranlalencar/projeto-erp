# Script para Claude Code — Gerar página de preview visual do Design System

## Instrução para o Claude Code

Cole este prompt no Claude Code:

---

```
Crie o arquivo `frontend-react/src/pages/DesignPreview.tsx` com uma página visual 
completa que exibe todos os componentes do design system do VORTEX ERP.
Adicione a rota `/design-preview` no App.tsx como rota pública (sem ProtectedRoute).
Instale lucide-react se não estiver instalado: npm install lucide-react

A página deve usar inline CSS seguindo exatamente esta paleta:
- Primária: #1e40af | Hover: #1d4ed8 | Light: #dbeafe
- Fundo página: #f1f5f9
- Surface/cards: #ffffff
- Bordas: #e2e8f0
- Texto: #0f172a | Muted: #64748b
- Sucesso: bg #dcfce7 / text #16a34a
- Alerta: bg #fef9c3 / text #d97706
- Perigo: bg #fee2e2 / text #dc2626
- Fonte: Inter, system-ui, sans-serif

A página deve ter as seguintes seções, cada uma em um card branco separado com título:

─────────────────────────────────────────────────────────────

SEÇÃO 1 — INPUTS
Título da seção: "Form — Input"
Mostrar lado a lado (grid 3 colunas):

1. Input padrão
   - Label: "Nome completo"
   - Placeholder: "Ex: João Silva"
   - border: 1px solid #e2e8f0, border-radius: 6px, padding: 8px 12px, height: 38px

2. Input com focus (simular visualmente, sem precisar de evento)
   - Label: "Email"
   - Valor preenchido: "joao@empresa.com.br"
   - border: 1px solid #1e40af, box-shadow: 0 0 0 3px #dbeafe

3. Input com erro
   - Label: "CNPJ"
   - Valor: "12.345.678/0001-"
   - border: 1px solid #dc2626, box-shadow: 0 0 0 3px #fee2e2
   - Mensagem de erro abaixo: ícone AlertCircle 12px + texto "CNPJ inválido" cor #dc2626

4. Input desabilitado
   - Label: "Código interno"
   - Valor: "ERP-00234"
   - background: #f8fafc, color: #9ca3af, cursor: not-allowed

5. Input de busca
   - Sem label
   - Ícone Search (lucide) à esquerda dentro do input, cor #94a3b8
   - Placeholder: "Buscar cliente..."
   - padding-left: 36px

6. Input de senha
   - Label: "Senha"
   - Valor: "••••••••"
   - Ícone Eye (lucide) à direita, clicável, cor #64748b

─────────────────────────────────────────────────────────────

SEÇÃO 2 — SELECT
Título da seção: "Form — Select"
Mostrar em grid 3 colunas:

1. Select fechado — padrão
   - Label: "Perfil"
   - Opção selecionada: "Selecione um perfil"  (placeholder, cor #94a3b8)
   - Ícone ChevronDown à direita, cor #64748b
   - border: 1px solid #e2e8f0

2. Select fechado — com valor
   - Label: "Forma de pagamento"
   - Opção selecionada: "PIX"
   - border: 1px solid #e2e8f0

3. Select aberto (dropdown visível)
   - Label: "Categoria"
   - Dropdown com opções listadas abaixo:
     · Fornecedor (hover: bg #f1f5f9)
     · Aluguel
     · Salários (selecionado: bg #dbeafe, color #1e40af, peso 500)
     · Serviços
     · Outros
   - box-shadow: 0 4px 16px rgba(0,0,0,0.08)

─────────────────────────────────────────────────────────────

SEÇÃO 3 — CHECKBOX
Título da seção: "Form — Checkbox"
Mostrar em coluna, 4 variantes:

1. Desmarcado
   - Caixa 16x16px, border-radius 3px, border 1.5px solid #cbd5e1, bg #ffffff
   - Label ao lado: "Recebido via PIX"

2. Marcado
   - Caixa 16x16px, bg #1e40af, border #1e40af
   - Ícone Check branco (lucide, 10px) centralizado
   - Label: "Confirmo os dados do pedido"

3. Hover (simular com borda azul)
   - Caixa com border 1.5px solid #1e40af, bg #ffffff
   - Label: "Enviar notificação"

4. Desabilitado
   - Caixa border #e2e8f0, bg #f8fafc, cursor not-allowed
   - Label cor #9ca3af: "Opção indisponível"

─────────────────────────────────────────────────────────────

SEÇÃO 4 — SWITCH (Toggle)
Título da seção: "Form — Switch"
Mostrar em coluna, 3 variantes:

1. OFF (inativo)
   - Track: 40x22px, border-radius 9999px, bg #e2e8f0
   - Thumb: 16x16px círculo branco, posição: left 3px
   - Label à direita: "Inativo" cor #9ca3af, peso 500

2. ON (ativo)
   - Track: bg #1e40af
   - Thumb: posição: right 3px (translateX)
   - Label à direita: "Ativo" cor #16a34a, peso 500

3. Desabilitado ON
   - Track: bg #bfdbfe (azul desbotado)
   - Thumb branco
   - Label: "Ativo" cor #9ca3af, cursor not-allowed

─────────────────────────────────────────────────────────────

SEÇÃO 5 — ÍCONES
Título da seção: "Icons — Lucide React (stroke)"
Subtítulo abaixo: "strokeWidth 1.75 | size 20px | cor #64748b"

Mostrar em grid de 6 colunas, cada ícone com nome abaixo (fonte 11px, cor #94a3b8):

Importar e exibir os seguintes ícones do lucide-react:
LayoutDashboard, Users, Building2, Package, ShoppingCart,
Wallet, BarChart3, Shield, LogOut, Plus, Pencil, Trash2,
Search, X, AlertTriangle, CheckCircle, XCircle, Info,
ArrowUpDown, ToggleLeft, ToggleRight, TrendingUp, TrendingDown,
Calendar, Download, Filter, History, KanbanSquare, DollarSign,
Eye, EyeOff, ChevronDown, ChevronRight, AlertCircle, Check,
Clock, RefreshCw, FileText, Settings

Cada ícone em um bloco centralizado: 
- 60x60px, bg #f8fafc, border-radius 8px, border 1px solid #e2e8f0
- Ícone no centro, cor #64748b, size 20px, strokeWidth 1.75
- Nome abaixo em 10px, cor #94a3b8

─────────────────────────────────────────────────────────────

SEÇÃO 6 — AVATAR
Título da seção: "Icons — Avatar (iniciais)"
Mostrar 6 variantes lado a lado:

Variante A — 32x32px (topbar / tabela)
Gerar para os nomes: "Luca Ryan", "Sara Nunes", "Admin Vortex"
bg #1e3a8a, texto branco, fonte 11px peso 700

Variante B — 40x40px (perfil expandido)
Mesmos nomes
bg #1e3a8a, texto branco, fonte 13px peso 700

Variante C — 48x48px (tela de perfil / modal)
bg #1e40af com borda 2px solid #dbeafe
texto branco, fonte 15px peso 700

Todos: border-radius 50%, display flex, align/justify center

Lógica das iniciais (implementar como função):
- Pegar primeiras 2 palavras do nome
- Primeira letra de cada uma, maiúsculo
- Ex: "Luca Ryan" → "LR", "Sara Nunes Lima" → "SN"

─────────────────────────────────────────────────────────────

SEÇÃO 7 — BADGES DE STATUS
Título da seção: "Badges — Status"
Mostrar todos em linha:

- Ativo        → bg #dcfce7, color #16a34a
- Inativo      → bg #f1f5f9, color #9ca3af
- Pendente     → bg #fef9c3, color #d97706
- Vencido      → bg #fee2e2, color #dc2626
- Pago         → bg #dcfce7, color #16a34a
- Cancelado    → bg #fee2e2, color #dc2626
- Em andamento → bg #dbeafe, color #1d4ed8
- Orçamento    → bg #dbeafe, color #1d4ed8
- Faturado     → bg #dcfce7, color #16a34a
- Entrega      → bg #f0fdf4, color #15803d
- Admin        → bg #f3e8ff, color #7c3aed
- Vendedor     → bg #dbeafe, color #1d4ed8
- Financeiro   → bg #dcfce7, color #16a34a
- Estoquista   → bg #ffedd5, color #ea580c

Estilo base de badge:
padding: 2px 10px, border-radius: 9999px, font-size: 12px,
font-weight: 600, display: inline-block

─────────────────────────────────────────────────────────────

ESTRUTURA GERAL DA PÁGINA:

- Fundo: #f1f5f9
- Padding: 40px
- Cada seção: card branco, border 1px solid #e2e8f0, border-radius 8px, padding 32px, margin-bottom 24px
- Título de seção: 16px, peso 600, cor #0f172a, margin-bottom 4px
- Subtítulo de seção: 13px, cor #64748b, margin-bottom 24px
- Título da página no topo: "VORTEX — Design System Preview"
  28px, peso 800, cor #0f172a, letter-spacing -0.02em
  Subtítulo: "Referência visual de componentes — Corporate Navy + Slate"
  13px, cor #64748b, margin-bottom 40px
```

---

## Como usar

1. Abra o Claude Code neste projeto
2. Cole o prompt acima
3. Rode `npm run dev` no `frontend-react`
4. Acesse `http://localhost:5173/design-preview`
5. Tire screenshot de cada seção
6. Faça upload das imagens no Claude Design
