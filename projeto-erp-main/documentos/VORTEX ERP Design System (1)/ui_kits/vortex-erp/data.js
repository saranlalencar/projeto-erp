// VORTEX ERP — mock data for the UI kit (pt-BR)
window.VORTEX_DATA = {
  user: { name: 'Ana Paula Souza', email: 'admin@vortex.com', role: 'Administrador' },

  clientes: [
    { id: 1, nome: 'Comércio Aurora Ltda', email: 'contato@aurora.com.br', telefone: '(11) 3344-5566', cpfCnpj: '12.345.678/0001-90' },
    { id: 2, nome: 'Marina Costa', email: 'marina.costa@gmail.com', telefone: '(21) 99888-1122', cpfCnpj: '123.456.789-01' },
    { id: 3, nome: 'TechParts Distribuidora', email: 'vendas@techparts.com', telefone: '(11) 4002-8922', cpfCnpj: '98.765.432/0001-10' },
    { id: 4, nome: 'Rafael Andrade', email: 'rafael.a@outlook.com', telefone: '(31) 98765-4321', cpfCnpj: '987.654.321-00' },
    { id: 5, nome: 'Padaria Pão Quente', email: 'financeiro@paoquente.com', telefone: '(48) 3232-1010', cpfCnpj: '23.456.789/0001-55' },
    { id: 6, nome: 'Júlia Fernandes', email: 'julia.fern@gmail.com', telefone: '(85) 99111-2233', cpfCnpj: '456.789.123-44' },
  ],

  produtos: [
    { id: 1, nome: 'Mouse Logitech MX Master 3S', categoria: 'Periféricos', preco: 549.90, quantidade: 42 },
    { id: 2, nome: 'Teclado Mecânico Keychron K8', categoria: 'Periféricos', preco: 689.00, quantidade: 12 },
    { id: 3, nome: 'Monitor LG UltraFine 27" 4K', categoria: 'Informática', preco: 2150.00, quantidade: 4 },
    { id: 4, nome: 'Cadeira Ergonômica ProDesk', categoria: 'Mobiliário', preco: 1299.00, quantidade: 0 },
    { id: 5, nome: 'Notebook Dell Latitude 5440', categoria: 'Informática', preco: 5890.00, quantidade: 8 },
    { id: 6, nome: 'Webcam Logitech Brio 4K', categoria: 'Periféricos', preco: 899.90, quantidade: 27 },
    { id: 7, nome: 'Hub USB-C 7 portas', categoria: 'Acessórios', preco: 219.90, quantidade: 3 },
  ],

  vendas: [
    { id: 482, status: 'aberto', total: 1099.80, cliente: 'Comércio Aurora Ltda', funcionario: 'Marcos Silva', data: '2026-06-02', itens: 2 },
    { id: 481, status: 'aberto', total: 549.90, cliente: 'Marina Costa', funcionario: 'Marcos Silva', data: '2026-06-02', itens: 1 },
    { id: 479, status: 'em_andamento', total: 4300.00, cliente: 'TechParts Distribuidora', funcionario: 'Beatriz Lima', data: '2026-06-01', itens: 2 },
    { id: 476, status: 'em_andamento', total: 2150.00, cliente: 'Rafael Andrade', funcionario: 'Beatriz Lima', data: '2026-05-30', itens: 1 },
    { id: 471, status: 'concluido', total: 5890.00, cliente: 'Padaria Pão Quente', funcionario: 'Marcos Silva', data: '2026-05-28', itens: 1 },
    { id: 468, status: 'concluido', total: 1789.80, cliente: 'Júlia Fernandes', funcionario: 'Beatriz Lima', data: '2026-05-27', itens: 3 },
    { id: 465, status: 'cancelado', total: 689.00, cliente: 'Marina Costa', funcionario: 'Marcos Silva', data: '2026-05-25', itens: 1 },
  ],

  contas: [
    { id: 1, descricao: 'Venda #471 — Padaria Pão Quente', valor: 5890.00, tipo: 'receita', pago: true, vencimento: '2026-05-28' },
    { id: 2, descricao: 'Pagamento fornecedor TechParts', valor: 3120.90, tipo: 'despesa', pago: true, vencimento: '2026-06-05' },
    { id: 3, descricao: 'Venda #482 — Comércio Aurora', valor: 1099.80, tipo: 'receita', pago: false, vencimento: '2026-06-12' },
    { id: 4, descricao: 'Aluguel do escritório — Junho', valor: 4500.00, tipo: 'despesa', pago: false, vencimento: '2026-06-10' },
    { id: 5, descricao: 'Assinatura software de gestão', valor: 299.00, tipo: 'despesa', pago: true, vencimento: '2026-06-01' },
    { id: 6, descricao: 'Venda #479 — TechParts', valor: 4300.00, tipo: 'receita', pago: false, vencimento: '2026-06-15' },
  ],
};

window.VORTEX_FMT = (v) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
window.VORTEX_DATE = (s) => { const [y,m,d] = s.split('-'); return `${d}/${m}/${y}`; };
