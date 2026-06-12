# VORTEX ERP — UI Kit

A click-through recreation of the VORTEX ERP product, built entirely from the design system components.

## Run it
Open `index.html`. You land on the **Login** screen (credentials are pre-filled) → **Entrar** → the app shell.

## Screens
| File | Screen | Notes |
|------|--------|-------|
| `LoginScreen.jsx` | Login | Centered card, brand mark, demo credentials |
| `DashboardScreen.jsx` | Dashboard | 4 KPI StatCards, recent-sales table, quick-access list |
| `ClientesScreen.jsx` | Clientes | Searchable table + "Novo Cliente" modal (functional) |
| `EstoqueScreen.jsx` | Estoque | Product table with stock-level Badges + search |
| `VendasScreen.jsx` | Vendas | 4-column Kanban; cards advance/cancel between columns |
| `FinanceiroScreen.jsx` | Financeiro | Receita/Despesa/Saldo summary, type filter, pay toggle |
| `AppShell.jsx` | Chrome | Dark Sidebar (240px) + Topbar (64px) + content (32px padding) |

## Architecture
Each screen is a plain `text/babel` script that reads components off `window.VORTEXERPDesignSystem_6c8a4b` and assigns itself to `window`. `index.html` loads the DS bundle, `data.js` (mock pt-BR data), then every screen, and composes them with a tiny router in the inline `<App>`.

## What's faked
No backend — data lives in `data.js`. Create/edit modals and Kanban moves mutate local React state only. Search and filters are real. RBAC is shown as a static perfis panel under "Usuários".

This kit is a faithful recreation of `saranlalencar/projeto-erp` (frontend-react), re-skinned to the Corporate Navy + Slate palette. See the root `readme.md` for the full source reference.
