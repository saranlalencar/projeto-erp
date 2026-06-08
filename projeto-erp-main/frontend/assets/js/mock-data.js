// ============================================================
// mock-data.js — Dados de exemplo para desenvolvimento
// Usuários, permissões e registros de auditoria fictícios
// ============================================================

const MockData = (() => {
  const users = [
    {
      id: '1',
      name: 'Administrador',
      email: 'admin@vortex.com',
      password: 'Admin@123',
      role: 'admin',
      status: 'ativo',
      avatar: null,
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      name: 'Maria Gerente',
      email: 'gerente@vortex.com',
      password: 'Gerente@123',
      role: 'manager',
      status: 'ativo',
      avatar: null,
      createdAt: '2025-02-15T10:00:00.000Z',
    },
    {
      id: '3',
      name: 'João Silva',
      email: 'joao@vortex.com',
      password: 'User@123',
      role: 'user',
      status: 'ativo',
      avatar: null,
      createdAt: '2025-03-10T09:00:00.000Z',
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana@vortex.com',
      password: 'User@123',
      role: 'user',
      status: 'bloqueado',
      avatar: null,
      createdAt: '2025-04-01T08:00:00.000Z',
    },
  ];

  const auditLog = [
    { id: '1', action: 'login', userId: '1', data: { email: 'admin@vortex.com' }, timestamp: '2025-05-20T08:00:00.000Z' },
    { id: '2', action: 'user_created', userId: '1', data: { targetId: '3' }, timestamp: '2025-05-20T08:15:00.000Z' },
    { id: '3', action: 'logout', userId: '1', data: {}, timestamp: '2025-05-20T17:00:00.000Z' },
  ];

  const permissions = [
    { role: 'admin',   modules: ['users', 'finance', 'stock', 'sales', 'reports', 'audit'] },
    { role: 'manager', modules: ['finance', 'stock', 'sales', 'reports'] },
    { role: 'user',    modules: ['sales', 'reports'] },
  ];

  return { users, auditLog, permissions };
})();
