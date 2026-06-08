# Prompt para Claude Design — VORTEX ERP
## Criação das telas faltantes + atualização das existentes

---

## SCRIPT — COMPONENTES DE FORMULÁRIO (colar no chat do Claude Design)

```
Crie os componentes de formulário do sistema VORTEX ERP seguindo estas especificações:

ESTILO GERAL
- Variante: outlined (borda visível em todos os estados — nunca underline)
- Fonte: Inter, 14px, peso 400
- Border-radius: 6px
- Altura dos campos: 38px
- Cor de borda padrão: #e2e8f0
- Cor de borda focus: #1e40af
- Glow no focus: box-shadow 0 0 0 3px #dbeafe
- Cor de texto: #0f172a
- Placeholder: #94a3b8
- Background: #ffffff
- Label: Inter 13px peso 500, cor #374151, sempre acima do campo

INPUT
- Estado padrão: border 1px solid #e2e8f0, background #ffffff
- Estado focus: border-color #1e40af, box-shadow 0 0 0 3px #dbeafe
- Estado erro: border-color #dc2626, box-shadow 0 0 0 3px #fee2e2
- Estado desabilitado: background #f8fafc, cor #9ca3af, cursor not-allowed
- Mensagem de erro: texto 12px, cor #dc2626, abaixo do campo, com ícone AlertCircle da Lucide
- Variantes necessárias: texto, email, senha (com toggle mostrar/ocultar), número, busca (com ícone Search à esquerda)

SELECT
- Mesmo estilo visual do Input (outlined, mesmas cores)
- Ícone ChevronDown da Lucide à direita, cor #64748b
- Ao abrir: dropdown com background #ffffff, border 1px solid #e2e8f0, border-radius 6px, box-shadow 0 4px 16px rgba(0,0,0,0.08)
- Item hover: background #f1f5f9
- Item selecionado: background #dbeafe, cor #1e40af, peso 500
- Placeholder (sem seleção): cor #94a3b8

CHECKBOX
- Formato: quadrado (não arredondado) — border-radius 3px
- Tamanho: 16x16px
- Estado desmarcado: border 1.5px solid #cbd5e1, background #ffffff
- Estado marcado: background #1e40af, border-color #1e40af, ícone Check branco da Lucide
- Estado hover: border-color #1e40af
- Label ao lado direito: Inter 14px, cor #0f172a
- Uso no sistema: confirmação em modais, seleção em tabela

SWITCH (Toggle ativo/inativo)
- Tamanho: 40x22px
- Estado inativo (off): background #e2e8f0, bolinha branca à esquerda
- Estado ativo (on): background #1e40af, bolinha branca à direita
- Transição suave: 200ms ease
- Label ao lado: Inter 13px — "Ativo" (cor #16a34a) ou "Inativo" (cor #9ca3af)
- Uso no sistema: ativar/inativar Produto, Funcionário e Fornecedor

AGRUPAMENTO DE CAMPOS (form group)
- Espaço entre label e campo: 4px
- Espaço entre campos no formulário: 16px (vertical), 12px (horizontal em grid)
- Campos lado a lado: grid de 2 colunas com gap 12px
- Campos de largura total: width 100%

Todos os componentes devem ser consistentes com a paleta:
Primária #1e40af | Borda #e2e8f0 | Fundo #ffffff | Erro #dc2626 | Texto #0f172a
```

---

## CONTEXTO DO PROJETO

Você está criando/atualizando o frontend React de um sistema ERP chamado **VORTEX**.

**Stack:** React + Vite + TypeScript + React Router v6  
**Estilo:** Inline CSS (sem biblioteca de UI), design system próprio — paleta Corporate Navy + Slate (ver seção abaixo)  
**Auth:** JWT com RBAC (perfis: Administrador, Vendedor, Financeiro, Estoquista)  
**Backend:** Node.js + Express + Prisma + PostgreSQL

---

## PALETA DE CORES — Corporate Navy + Slate (Light Mode)

> Substitua completamente qualquer referência ao indigo `#4f46e5` anterior por esta paleta.

### Cores Base

| Token | Valor | Uso |
|-------|-------|-----|
| `primary` | `#1e40af` | Botões principais, links ativos, item ativo da sidebar |
| `primary-hover` | `#1d4ed8` | Estado hover dos botões primários |
| `primary-light` | `#dbeafe` | Background de badges, highlights de linha |
| `sidebar-bg` | `#0f172a` | Fundo da sidebar (escura, fixa) |
| `sidebar-text` | `#cbd5e1` | Texto dos itens de menu inativos |
| `sidebar-active-bg` | `#1e3a8a` | Background do item ativo no menu |
| `sidebar-active-text` | `#ffffff` | Texto do item ativo no menu |
| `bg` | `#f1f5f9` | Fundo geral da página |
| `surface` | `#ffffff` | Cards, modais, painéis, tabelas |
| `surface-2` | `#f8fafc` | Linhas alternadas de tabela (zebra stripe) |
| `border` | `#e2e8f0` | Bordas de inputs, cards e separadores |
| `text` | `#0f172a` | Texto principal |
| `text-muted` | `#64748b` | Labels, datas, subtítulos, placeholders |
| `topbar-bg` | `#ffffff` | Fundo da topbar |
| `topbar-border` | `#e2e8f0` | Borda inferior da topbar |

### Cores Semânticas (status e alertas)

| Uso | Background | Texto | Aplicação |
|-----|-----------|-------|-----------|
| Sucesso / Ativo / Pago | `#dcfce7` | `#16a34a` | Badge verde |
| Alerta / Próximo vencer | `#fef9c3` | `#d97706` | Badge amarelo |
| Perigo / Vencido / Crítico | `#fee2e2` | `#dc2626` | Badge vermelho |
| Info / Neutro | `#dbeafe` | `#1d4ed8` | Badge azul |
| Inativo / Desabilitado | `#f1f5f9` | `#9ca3af` | Linhas acinzentadas |

### Aplicação em CSS (inline style — padrão do projeto)

```tsx
// Botão primário
const btnPrimary = {
  backgroundColor: '#1e40af',
  color: '#ffffff',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 16px',
  cursor: 'pointer',
}

// Botão hover (use onMouseEnter/onMouseLeave)
const btnPrimaryHover = { backgroundColor: '#1d4ed8' }

// Card / Surface
const card = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  border: '1px solid #e2e8f0',
  padding: '24px',
}

// Fundo da página
const pageBackground = { backgroundColor: '#f1f5f9', minHeight: '100vh' }

// Sidebar
const sidebar = {
  backgroundColor: '#0f172a',
  width: '240px',
  height: '100vh',
  position: 'fixed' as const,
}

// Item ativo na sidebar
const sidebarItemActive = {
  backgroundColor: '#1e3a8a',
  color: '#ffffff',
  borderRadius: '6px',
}

// Item inativo na sidebar
const sidebarItemInactive = { color: '#cbd5e1' }

// Input
const input = {
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '14px',
  color: '#0f172a',
  backgroundColor: '#ffffff',
  outline: 'none',
}

// Input focus (use onFocus/onBlur)
const inputFocus = { borderColor: '#1e40af', boxShadow: '0 0 0 3px #dbeafe' }

// Header de tabela
const tableHeader = {
  backgroundColor: '#f8fafc',
  color: '#64748b',
  fontWeight: 600,
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  padding: '12px 16px',
  borderBottom: '1px solid #e2e8f0',
}

// Linha alternada de tabela
const tableRowEven = { backgroundColor: '#f8fafc' }
const tableRowOdd  = { backgroundColor: '#ffffff' }
```

### Badges de status (reutilizável)

```tsx
const badge = (type: 'success' | 'warning' | 'danger' | 'info' | 'neutral') => ({
  success:  { backgroundColor: '#dcfce7', color: '#16a34a' },
  warning:  { backgroundColor: '#fef9c3', color: '#d97706' },
  danger:   { backgroundColor: '#fee2e2', color: '#dc2626' },
  info:     { backgroundColor: '#dbeafe', color: '#1d4ed8' },
  neutral:  { backgroundColor: '#f1f5f9', color: '#9ca3af' },
}[type])

// Estilo base do badge (combine com o objeto acima)
const badgeBase = {
  padding: '2px 10px',
  borderRadius: '9999px',
  fontSize: '12px',
  fontWeight: 600,
  display: 'inline-block',
}
```

---

## PADRÃO DE DESIGN A SEGUIR

- Sidebar fixa de 240px com logo "VORTEX ERP" — fundo `#0f172a`
- Topbar com nome do usuário, role e botão de logout — fundo `#ffffff`, borda inferior `#e2e8f0`
- Fundo da página: `#f1f5f9` (slate frio, não branco puro)
- Cards em `#ffffff` com `border: 1px solid #e2e8f0` e `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`
- Tabelas com header `#f8fafc`, linhas alternadas, bordas `#e2e8f0`
- Modais com overlay `rgba(0,0,0,0.4)`, surface `#ffffff`, `border-radius: 8px`
- Botões primários: `#1e40af` → hover `#1d4ed8`
- Botões secundários: `border: 1px solid #e2e8f0`, `backgroundColor: #ffffff`, `color: #0f172a`
- Inputs com borda `#e2e8f0`, focus com borda `#1e40af` e glow `#dbeafe`
- Badges arredondados (`border-radius: 9999px`) com as cores semânticas da tabela acima
- Tipografia: fonte padrão do sistema, tamanho base `14px`, títulos de seção `18px 600`
- Layout responsivo, funciona em Chrome, Firefox e Edge

---

## SISTEMA DE ROTAS ATUAL (App.tsx)

```
/ → Dashboard (protegida)
/login → Login (pública)
/verificar-email → VerificarEmail (pública)
/clientes → Clientes (protegida, módulo: clientes)
/estoque → Estoque (protegida, módulo: estoque)
/vendas → Vendas (protegida, módulo: vendas)
/financeiro → Financeiro (protegida, módulo: financeiro)
/sem-permissao → SemPermissao (protegida)
```

---

## TELAS A CRIAR (NOVAS)

---

### TELA 1: Usuários/Funcionários
**Arquivo:** `frontend-react/src/pages/Usuarios.tsx`  
**Rota:** `/usuarios`  
**Permissão:** Somente Administrador

**Funcionalidades:**
- Listar todos os funcionários cadastrados em tabela com colunas: Nome, Email, Perfil (role), Status (ativo/inativo), Ações
- Busca em tempo real por nome e email
- Cadastrar novo funcionário: nome, email, senha inicial, perfil (select: Administrador, Vendedor, Financeiro, Estoquista)
- Editar funcionário existente (não permitir editar própria conta de admin)
- Ativar/inativar conta de funcionário (toggle)
- Exibir badge colorido para cada perfil: Administrador (roxo), Vendedor (azul), Financeiro (verde), Estoquista (laranja)
- Modal de confirmação ao inativar conta
- Botão "Novo Funcionário" no topo direito

**API calls esperadas:**
- `GET /api/usuarios` → lista funcionários
- `POST /api/usuarios` → cria funcionário
- `PUT /api/usuarios/:id` → edita funcionário
- `PATCH /api/usuarios/:id/status` → ativa/inativa

---

### TELA 2: Fornecedores
**Arquivo:** `frontend-react/src/pages/Fornecedores.tsx`  
**Rota:** `/fornecedores`  
**Permissão:** Administrador e Financeiro

**Funcionalidades:**
- Listar fornecedores em tabela com colunas: Nome, CNPJ, Contato (telefone/email), Condições Comerciais, Status, Ações
- Busca por nome e situação (ativo/inativo)
- Filtro por status (Todos / Ativos / Inativos)
- Cadastrar fornecedor: nome, CNPJ (com máscara XX.XXX.XXX/XXXX-XX), email, telefone, condições comerciais (textarea)
- Editar e inativar fornecedores
- Badge de status ativo/inativo
- Botão "Novo Fornecedor" no topo direito

**API calls esperadas:**
- `GET /api/fornecedores` → lista fornecedores
- `POST /api/fornecedores` → cria fornecedor
- `PUT /api/fornecedores/:id` → edita fornecedor
- `PATCH /api/fornecedores/:id/status` → ativa/inativa

---

### TELA 3: Relatórios de Vendas
**Arquivo:** `frontend-react/src/pages/Relatorios.tsx`  
**Rota:** `/relatorios`  
**Permissão:** Administrador e Financeiro

**Funcionalidades:**
- Filtros no topo: período (data inicial + data final), vendedor (select), produto (select)
- Botão "Gerar Relatório" que busca dados filtrados
- Cards de resumo: Total de Pedidos, Valor Total, Ticket Médio, Pedidos por Status
- Gráfico simples de barras (implementar com CSS puro, sem biblioteca) mostrando vendas por período
- Tabela com pedidos filtrados: ID, Cliente, Vendedor, Produtos, Valor Total, Data, Status
- Totalizador no rodapé da tabela
- Exportar como CSV (botão que gera download do arquivo)

**API calls esperadas:**
- `GET /api/relatorios/vendas?dataInicio=&dataFim=&vendedorId=&produtoId=` → dados filtrados
- `GET /api/funcionarios?role=vendedor` → lista vendedores para o select
- `GET /api/produtos` → lista produtos para o select

---

## TELAS A ATUALIZAR (EXISTENTES COM AJUSTES)

---

### ATUALIZAÇÃO 1: Vendas.tsx — Corrigir colunas do Kanban

**Arquivo:** `frontend-react/src/pages/Vendas.tsx`

**Problema atual:** As colunas do Kanban estão erradas (Aberto, Em Andamento, Concluído, Cancelado).

**Correção — Novas colunas do Kanban (em ordem):**
1. **Orçamento** (status: `orcamento`) — azul claro
2. **Separar Estoque** (status: `separar_estoque`) — amarelo
3. **Faturar** (status: `faturar`) — laranja
4. **Faturado** (status: `faturado`) — verde claro
5. **Entrega** (status: `entrega`) — verde escuro

**Funcionalidades adicionais a incluir:**
- Modal de criação de novo pedido com: seleção de cliente (busca por nome), adição de múltiplos produtos com quantidade, cálculo automático do total (RF-V06)
- Validação de estoque disponível ao criar pedido — exibir erro se estoque insuficiente (RF-V02)
- Exibir total do pedido no card do Kanban
- Botão "Novo Pedido" no topo direito (somente Administrador e Vendedor)
- Filtro por período e cliente no topo

---

### ATUALIZAÇÃO 2: Financeiro.tsx — Separar em Contas a Receber e Contas a Pagar

**Arquivo:** `frontend-react/src/pages/Financeiro.tsx`

**Problema atual:** Tela única sem distinção clara entre receber/pagar e sem os campos corretos.

**Nova estrutura:**
- Tabs no topo: **Contas a Receber** | **Contas a Pagar** | **Resumo**
- Cards de resumo sempre visíveis: Total a Receber, Total a Pagar, Saldo Previsto

**Aba Contas a Receber:**
- Tabela: Cliente, Valor, Vencimento, Forma de Recebimento, Situação, Ações
- Situação com badge: Pendente (amarelo), Recebido (verde), Vencido (vermelho — calculado automaticamente pela data)
- Filtros: por situação e período de vencimento
- Marcar como recebido: modal pedindo valor recebido (total ou parcial) e forma (PIX, Boleto, Cartão, Depósito)
- Contas vencidas destacadas em vermelho na tabela

**Aba Contas a Pagar:**
- Tabela: Fornecedor, Descrição, Categoria, Valor, Vencimento, Situação, Ações
- Mesmos filtros e badges da aba receber
- Cadastrar nova conta a pagar: fornecedor (select), descrição, categoria (select: Fornecedor, Aluguel, Salários, Serviços, Outros), valor, vencimento
- Marcar como pago: modal confirmando pagamento total ou parcial

**Aba Resumo:**
- Cards grandes: Total a Receber, Total a Pagar, Saldo Previsto
- Lista das 5 contas mais próximas do vencimento (receber e pagar)

---

### ATUALIZAÇÃO 3: Clientes.tsx — Adicionar histórico de pedidos

**Arquivo:** `frontend-react/src/pages/Clientes.tsx`

**Adicionar:**
- Botão "Ver Histórico" na linha de cada cliente na tabela
- Modal ou página lateral (drawer) que abre ao clicar mostrando:
  - Dados do cliente no topo
  - Lista de pedidos do cliente: ID, Data, Status, Valor Total
  - Filtro por status e período nos pedidos

**API call adicional:**
- `GET /api/clientes/:id/pedidos` → histórico de pedidos do cliente

---

### ATUALIZAÇÃO 4: Estoque.tsx — Melhorias completas

**Arquivo:** `frontend-react/src/pages/Estoque.tsx`

**Adicionar:**
- Toggle ativo/inativo por produto (RF-E04) — produtos inativos aparecem com linha acinzentada
- Filtro adicional: Todos / Ativos / Inativos
- Campo "Quantidade Mínima" no cadastro de produto (RF-E01)
- Badge de alerta vermelho quando quantidade atual ≤ quantidade mínima (RF-E06)
- Ao ajustar estoque manualmente, abrir modal pedindo: quantidade (positivo ou negativo) e **justificativa** obrigatória (RF-E05)
- Coluna "Qtd. Mínima" na tabela

---

## ATUALIZAÇÃO DO ROTEADOR (App.tsx)

Adicionar as novas rotas ao arquivo `frontend-react/src/App.tsx`:

```tsx
// Importar as novas páginas
import Usuarios from './pages/Usuarios'
import Fornecedores from './pages/Fornecedores'
import Relatorios from './pages/Relatorios'

// Adicionar dentro das rotas protegidas:
<Route path="/usuarios" element={
  <ProtectedRoute module="usuarios" action="view">
    <Usuarios />
  </ProtectedRoute>
} />
<Route path="/fornecedores" element={
  <ProtectedRoute module="fornecedores" action="view">
    <Fornecedores />
  </ProtectedRoute>
} />
<Route path="/relatorios" element={
  <ProtectedRoute module="relatorios" action="view">
    <Relatorios />
  </ProtectedRoute>
} />
```

---

## ATUALIZAÇÃO DO LAYOUT (Layout.tsx)

Adicionar os novos itens no menu da sidebar em `frontend-react/src/components/Layout.tsx`:

```
Dashboard (ícone: 📊) → /
Clientes (ícone: 👥) → /clientes
Fornecedores (ícone: 🏭) → /fornecedores  [Novo — visível para Admin e Financeiro]
Estoque (ícone: 📦) → /estoque
Vendas (ícone: 🛒) → /vendas
Financeiro (ícone: 💰) → /financeiro
Relatórios (ícone: 📈) → /relatorios  [Novo — visível para Admin e Financeiro]
Usuários (ícone: 🔐) → /usuarios  [Novo — visível somente para Admin]
```

---

## REGRAS GERAIS A SEGUIR EM TODAS AS TELAS

1. **Estoque não pode ficar negativo** — bloquear pedido e exibir mensagem de erro clara
2. **Pedidos confirmados não podem ser excluídos**, apenas cancelados com justificativa
3. **Contas a receber não podem ser excluídas**, apenas baixadas ou canceladas com justificativa
4. **Produtos inativos** não aparecem na seleção de novos pedidos
5. **Validação de campos obrigatórios** em todos os formulários com mensagem de erro inline
6. **Loading state** enquanto aguarda resposta da API (spinner simples)
7. **Toast de sucesso/erro** após cada operação (usando o padrão já existente no projeto)
8. **Confirmação modal** antes de qualquer exclusão ou inativação
9. **Permissões RBAC** — cada botão de ação (criar, editar, excluir) deve verificar `can(modulo, acao)` antes de exibir

---

## RESUMO DE ROTAS COMPLETAS (após implementação)

| Rota | Tela | Perfis com Acesso |
|------|------|-------------------|
| `/` | Dashboard | Todos |
| `/login` | Login | Público |
| `/verificar-email` | Verificar Email | Público |
| `/clientes` | Clientes | Admin, Vendedor |
| `/fornecedores` | Fornecedores | Admin, Financeiro |
| `/estoque` | Estoque | Admin, Estoquista, Vendedor (só leitura) |
| `/vendas` | Vendas (Kanban) | Admin, Vendedor |
| `/financeiro` | Financeiro | Admin, Financeiro |
| `/relatorios` | Relatórios | Admin, Financeiro |
| `/usuarios` | Usuários | Admin |
| `/sem-permissao` | Sem Permissão | Todos (página de erro) |
