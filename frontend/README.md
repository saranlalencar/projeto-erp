# Vortex ERP — Frontend

Frontend puro (HTML + CSS + JS Vanilla) do sistema Vortex ERP. Não depende de frameworks ou ferramentas de build — basta abrir os arquivos no navegador ou servir com qualquer servidor HTTP estático.

---

## 📁 Estrutura de pastas

```
vortex-erp/
│
├── index.html              ← Entrada principal (redireciona por sessão)
├── login.html              ← Autenticação
├── register.html           ← Cadastro de novo usuário
├── forgot-password.html    ← Solicitar recuperação de senha
├── validate-code.html      ← Validar código de 6 dígitos
├── reset-password.html     ← Definir nova senha
├── blocked.html            ← Conta bloqueada
├── session-expired.html    ← Sessão expirada
├── unauthorized.html       ← Acesso não autorizado
│
├── assets/
│   ├── css/
│   │   ├── global.css      ← Reset, variáveis, botões e utilitários
│   │   ├── login.css       ← Páginas de autenticação e status
│   │   ├── dashboard.css   ← Layout do painel principal
│   │   ├── users.css       ← Tabelas e badges do módulo de usuários
│   │   ├── forms.css       ← Inputs, labels e erros de formulário
│   │   ├── modal.css       ← Overlay e diálogos modais
│   │   ├── toast.css       ← Notificações temporárias (toast)
│   │   ├── darkmode.css    ← Variáveis do tema escuro
│   │   └── responsive.css  ← Media queries (mobile/tablet)
│   │
│   ├── js/
│   │   ├── app.js          ← Ponto de entrada: inicializa o app
│   │   ├── auth.js         ← Login, logout, registro, bloqueio
│   │   ├── session.js      ← Criação, verificação e expiração de sessão
│   │   ├── users.js        ← CRUD de usuários
│   │   ├── permissions.js  ← Controle de acesso por role (RBAC)
│   │   ├── recovery.js     ← Fluxo de recuperação de senha
│   │   ├── storage.js      ← Abstração do localStorage
│   │   ├── routes.js       ← Roteamento e guard de páginas
│   │   ├── ui.js           ← Helpers de DOM e formatação
│   │   ├── validators.js   ← Validações reutilizáveis
│   │   ├── mock-data.js    ← Dados fictícios para desenvolvimento
│   │   ├── profile.js      ← Perfil e troca de senha do usuário logado
│   │   ├── audit.js        ← Log de auditoria de ações
│   │   └── darkmode.js     ← Toggle e persistência do tema escuro
│   │
│   ├── components/
│   │   ├── sidebar.js      ← Barra lateral com menu por permissão
│   │   ├── topbar.js       ← Barra superior com título e avatar
│   │   ├── modal.js        ← Modal/diálogo reutilizável
│   │   ├── toast.js        ← Notificações toast
│   │   ├── loading.js      ← Overlay de carregamento global
│   │   ├── protected-page.js ← Guard de páginas protegidas
│   │   └── avatar.js       ← Avatar com iniciais gerado por canvas
│   │
│   ├── pages/
│   │   ├── dashboard/      ← Módulo: painel principal
│   │   ├── users/          ← Módulo: gestão de usuários
│   │   ├── profile/        ← Módulo: perfil do usuário
│   │   ├── finance/        ← Módulo: financeiro
│   │   ├── stock/          ← Módulo: estoque
│   │   ├── sales/          ← Módulo: vendas
│   │   └── reports/        ← Módulo: relatórios
│   │
│   └── img/
│       ├── logo.svg            ← Logotipo vetorial do Vortex ERP
│       ├── avatar-default.png  ← Avatar padrão (substituir por PNG real)
│       └── bg-login.jpg        ← Imagem de fundo do login (substituir)
│
├── data/
│   ├── users.json          ← Usuários de exemplo (mock)
│   ├── permissions.json    ← Matriz de permissões por role
│   └── audit-log.json      ← Registros de auditoria de exemplo
│
└── README.md               ← Este arquivo
```

---

## 🚀 Como usar

### Servir localmente

```bash
# Com Python 3
cd vortex-erp
python -m http.server 3000

# Com Node.js (npx)
npx serve .

# Com VS Code: instale a extensão "Live Server" e clique em "Go Live"
```

Acesse: `http://localhost:3000`

### Credenciais de acesso (mock)

| Role       | E-mail                  | Senha          |
|------------|-------------------------|----------------|
| Admin      | admin@vortex.com        | Admin@123      |
| Gerente    | gerente@vortex.com      | Gerente@123    |
| Usuário    | joao@vortex.com         | User@123       |

---

## 🏗️ Arquitetura

- **Sem frameworks**: HTML, CSS e JS puro (ES6+)
- **Módulos como IIFEs**: cada arquivo JS exporta um objeto global (ex: `Auth`, `Session`, `UI`)
- **RBAC**: controle de acesso baseado em roles via `permissions.js`
- **Mock data**: dados armazenados em `localStorage`; os arquivos `.json` em `data/` servem como referência/seed
- **Dark mode**: aplicado via atributo `data-theme="dark"` no `<html>`

---

## 📋 Roles e permissões

| Módulo     | Admin | Gerente | Usuário |
|------------|-------|---------|---------|
| Usuários   | CRUD + bloquear | Visualizar + criar + editar | — |
| Financeiro | CRUD  | Visualizar + criar + editar | Visualizar |
| Estoque    | CRUD  | Visualizar + criar + editar | Visualizar |
| Vendas     | CRUD  | Visualizar + criar + editar | Visualizar + criar |
| Relatórios | Visualizar + exportar | Visualizar + exportar | Visualizar |
| Auditoria  | Visualizar | — | — |

---

## 📌 Próximos passos

- [ ] Implementar páginas dos módulos em `assets/pages/*/`
- [ ] Integrar com a API backend (`vortex_erp`)
- [ ] Substituir `avatar-default.png` e `bg-login.jpg` por imagens reais
- [ ] Adicionar gráficos ao dashboard (ex: Chart.js)
- [ ] Implementar exportação de relatórios (PDF/CSV)
