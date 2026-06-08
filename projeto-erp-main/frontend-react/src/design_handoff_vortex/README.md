# Handoff: VORTEX ERP — Design System → projeto-erp (React + TS + Vite)

## Visão geral
Pacote para reskin completo do front-end **`saranlalencar/projeto-erp`** (`frontend-react/`) com o **VORTEX Design System** — paleta **Corporate Navy + Slate**, tipografia Inter, ícones de linha (Lucide-style) e a marca espiral VORTEX. Substitui o tema índigo + emoji atuais por uma camada de apresentação corporativa e consistente.

> **Sobre os arquivos deste bundle:** os componentes (`design-system/components/*.jsx`) e as páginas (`pages/*.tsx`) são **código React real, pronto para uso** — não são mockups de HTML descartáveis. As páginas preservam sua camada de dados (`api`, `useAuth`, `react-router`); apenas a *apresentação* mudou. Pontos onde você liga seus endpoints reais estão marcados com `// ←`.

## Fidelidade
**Alta fidelidade (hifi).** Cores, tipografia, espaçamento, raios e estados finais. Reproduza 1:1.

---

## Como integrar (passo a passo)

### Pré-requisito: branch isolada
```bash
git checkout -b feat/vortex-design-system
```
Nada é destrutivo — você revisa tudo em PR.

### Etapa 1 — Fundamentos (aditivo, não quebra nada)
1. Copie a pasta `design-system/` para `frontend-react/src/design-system/`.
2. No `src/main.tsx`, adicione **uma linha** (de preferência a primeira import de CSS):
   ```ts
   import './design-system/styles.css';
   ```
   Isso carrega ~92 CSS variables + as fontes Inter/Inter Display globalmente.
3. (Opcional) confirme o `tsconfig`: `"allowJs": true` permite importar os componentes `.jsx` (os `.d.ts` ao lado fornecem os tipos). Se preferir, renomeie cada `Componente.jsx` → `.tsx` (não há sintaxe a mudar).

✅ Ponto de parada seguro: o app já roda com tokens e fontes disponíveis, sem nenhuma tela alterada.

### Etapa 2 — Reskin de cor (mínimo esforço, máximo impacto)
Se quiser o visual navy **sem** trocar a estrutura das telas, substitua os valores fixos do seu `src/index.css` / `App.css` pelos tokens:

| Valor antigo (índigo) | Token VORTEX |
|---|---|
| `#4f46e5` (primária) | `var(--color-primary)` → `#1e40af` |
| `#1e1b4b` (sidebar) | `var(--bg-sidebar)` → `#0f172a` |
| fundo da página | `var(--bg-page)` → `#f1f5f9` |
| bordas | `var(--border-default)` → `#e2e8f0` |
| texto | `var(--text-strong)` / `var(--text-muted)` |
| raios de botão/card | `var(--radius-md)` / `var(--radius-lg)` |

### Etapa 3 — Migrar as telas (versões prontas em `pages/`)
Cada arquivo em `pages/` é a versão reescrita da sua tela correspondente, usando os componentes do DS. **Compare lado a lado** com a sua versão e copie quando estiver satisfeito:

| Sua tela | Versão reescrita | Componentes DS usados |
|---|---|---|
| `components/Layout.tsx` | `pages/Layout.tsx` | `Sidebar`, `SidebarItem`, `Topbar`, `Avatar`, `Button`, `Icon` |
| `pages/Login.tsx` | `pages/Login.tsx` | `Input`, `Button`, `Checkbox`, `Icon` + marca |
| `pages/Dashboard.tsx` | `pages/Dashboard.tsx` | `StatCard`, `Card`, `CardHeader`, `Table`, `Badge`, `Icon` |
| `pages/Clientes.tsx` | `pages/Clientes.tsx` | `Card`, `Table`, `Input`, `Modal`, `IconButton`, `Button` |
| `pages/Estoque.tsx` | `pages/Estoque.tsx` | `Card`, `Table`, `Badge`, `Input`, `IconButton` |
| `pages/Vendas.tsx` | `pages/Vendas.tsx` | Kanban com `Badge`, `Button`, `Icon` |
| `pages/Financeiro.tsx` | `pages/Financeiro.tsx` | `StatCard`, `Card`, `Table`, `Badge`, `Button` |

**O que você precisa ajustar em cada uma:** os comentários `// ←` marcam as chamadas de API (`api.get/post/patch/delete`) e os formatos de dados — alinhe-os aos seus endpoints e tipos reais. A lógica de auth, rotas e validação foi preservada.

---

## Componentes disponíveis (`design-system/components`)
Importe pelo barrel:
```tsx
import { Button, Table, Card, StatCard, Badge, Modal,
         Sidebar, SidebarItem, Topbar, Input, Select,
         Checkbox, Switch, Icon, Avatar, IconButton } from '@/design-system/components';
```
- **Button** — `variant: primary | secondary | ghost | danger`, `size: sm | md | lg`, `leadingIcon`, `fullWidth`, `disabled`.
- **IconButton** — quadrado, `variant: ghost | outline`, sempre com `label`.
- **Input / Select** — `label`, `hint`, `error`, `leadingIcon`; foco com anel navy.
- **Checkbox / Switch** — preenchimento navy quando ativo.
- **Badge** — `tone: neutral | primary | success | warning | danger`, `dot`.
- **Card / CardHeader** — superfície branca 8px; use `padding="0"` ao envolver `Table`.
- **StatCard** — KPI: tile de ícone tonal + número tabular + label + `delta`.
- **Table** — `columns` (com `render`, `align`, `width`) + `data` + `onRowClick`.
- **Modal** — `title`, `onClose`, `footer`, `width`.
- **Sidebar / SidebarItem** — rail escuro 240px; item ativo recebe fill navy-900.
- **Topbar** — barra 64px com `title`, `breadcrumb`, `actions`.
- **Icon** — ícones de linha; `name` (ex.: `cart`, `users`, `trash`), `size`, herda `currentColor`.
- **Avatar** — iniciais em tile navy; `size: sm | md | lg`.

---

## Design Tokens (resumo)
**Cores** — primária `#1e40af` (hover `#1d4ed8`, active `#1e3a8a`, tint `#dbeafe`); sidebar `#0f172a`; página `#f1f5f9`; surface `#ffffff`; bordas `#e2e8f0`; texto `#0f172a` / muted `#64748b`. Semânticas (bg/text): success `#dcfce7`/`#16a34a`, warning `#fef9c3`/`#d97706`, danger `#fee2e2`/`#dc2626`.
**Tipografia** — Inter (UI/corpo) + Inter Display (títulos/números). Base 14px, título 28px, tabular-nums em valores monetários.
**Espaçamento** — escala 4px. Shell: sidebar 240px + topbar 64px + padding de conteúdo 32px.
**Raios** — 6px botões/inputs · 8px cards · 12px modais · pill badges.
**Sombras** — `--shadow-sm` (cards), `--shadow-md` (popover), `--shadow-lg` (modal). Tons frios, nunca preto puro.
**Motion** — só cor/borda; 0.15–0.2s `cubic-bezier(0.4,0,0.2,1)`. Sem bounce/entradas.

Todos definidos em `design-system/tokens/*.css`.

## Assets
- **Fontes** — `design-system/assets/fonts/` (Inter Variable + Inter Display). Declaradas em `tokens/fonts.css` — ajuste os caminhos relativos se mudar a estrutura.
- **Marca** — `design-system/assets/logo/`: `vortex-wordmark.svg` (navy), `vortex-wordmark-light.svg` (branca, p/ fundo escuro), `vortex-mark.svg` (símbolo), `vortex-mark-white.svg` (app-icon no tile primário), `favicon.svg`.
- **Ícones** — sem dependência de CDN: o set Lucide-style está inline em `components/foundation/Icon.jsx`. Adicione glifos no mapa `PATHS`.

## Decisões de design (do brief)
1. **Paleta navy** sobrescreve o índigo original do código.
2. **Ícones de linha** substituem os emoji originais (📊👥📦🛒💰).
Reverter qualquer uma é trivial — fale com quem montou o sistema.

## Arquivos neste bundle
```
design-system/
  styles.css                 ← entry point (só @imports)
  tokens/                    ← colors, typography, spacing, base, fonts (.css)
  assets/fonts/              ← Inter + Inter Display
  assets/logo/               ← marca VORTEX (svg)
  components/
    index.ts                 ← barrel de exports
    foundation/  (Icon, Avatar)
    buttons/     (Button, IconButton)
    forms/       (Input, Select, Checkbox, Switch)
    data-display/(Badge, Card, StatCard, Table)
    feedback/    (Modal)
    navigation/  (Sidebar, Topbar)
  (cada componente: .jsx + .d.ts + .prompt.md)
pages/                       ← versões reescritas das suas telas (.tsx)
  Layout, Login, Dashboard, Clientes, Estoque, Vendas, Financeiro
README.md                    ← este arquivo
```

## Fonte original
Repo: https://github.com/saranlalencar/projeto-erp — surface `frontend-react/`.
