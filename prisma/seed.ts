import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed completo...\n');

  // ── 1. Usuários ─────────────────────────────────────────────
  const users = [
    { id: '1', name: 'Administrador', email: 'admin@vortex.com',      password: 'Admin@123',   role: 'admin',   status: 'ativo' },
    { id: '2', name: 'Maria Gerente', email: 'gerente@vortex.com',    password: 'Gerente@123', role: 'manager', status: 'ativo' },
    { id: '3', name: 'João Silva',    email: 'joao@vortex.com',       password: 'User@123',    role: 'user',    status: 'ativo' },
    { id: '4', name: 'Ana Costa',     email: 'ana@vortex.com',        password: 'User@123',    role: 'user',    status: 'bloqueado' },
  ];
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { id: u.id, name: u.name, email: u.email, password: hashed, role: u.role, status: u.status, emailVerified: true },
    });
  }
  console.log(`  ✓ ${users.length} usuários`);

  // ── 2. Funcionários ─────────────────────────────────────────
  const funcionarios = [
    { nome: 'Carlos Vendas',    email: 'carlos@vortex.com',    cargo: 'vendedor',    salario: 3500 },
    { nome: 'Beatriz Estoque',  email: 'beatriz@vortex.com',   cargo: 'estoquista',  salario: 3000 },
    { nome: 'Ricardo Financeiro', email: 'ricardo@vortex.com', cargo: 'financeiro',  salario: 4000 },
    { nome: 'Fernanda Gerente', email: 'fernanda@vortex.com',  cargo: 'gerente',     salario: 6000 },
  ];
  const funcCriados: { id: number }[] = [];
  for (const f of funcionarios) {
    const func = await prisma.funcionario.upsert({
      where: { email: f.email },
      update: {},
      create: f,
    });
    funcCriados.push(func);
  }
  console.log(`  ✓ ${funcionarios.length} funcionários`);

  // ── 3. Clientes ─────────────────────────────────────────────
  const clientes = [
    { nome: 'Empresa Alpha Ltda',    email: 'alpha@empresa.com',    telefone: '(11) 99001-0001', cpfCnpj: '12.345.678/0001-90' },
    { nome: 'Beta Comércio S.A.',    email: 'beta@comercio.com',    telefone: '(21) 99002-0002', cpfCnpj: '98.765.432/0001-10' },
    { nome: 'Carlos Pereira',        email: 'carlos.p@email.com',   telefone: '(31) 99003-0003', cpfCnpj: '111.222.333-44' },
    { nome: 'Delta Serviços ME',     email: 'delta@servicos.com',   telefone: '(41) 99004-0004', cpfCnpj: '55.666.777/0001-88' },
    { nome: 'Elena Rodrigues',       email: 'elena.r@email.com',    telefone: '(51) 99005-0005', cpfCnpj: '555.666.777-88' },
    { nome: 'Gamma Tecnologia',      email: 'contato@gamma.com.br', telefone: '(61) 99006-0006', cpfCnpj: '11.222.333/0001-44' },
  ];
  const clientesCriados: { id: number }[] = [];
  for (const c of clientes) {
    const cl = await prisma.cliente.upsert({
      where: { email: c.email },
      update: {},
      create: c,
    });
    clientesCriados.push(cl);
  }
  console.log(`  ✓ ${clientes.length} clientes`);

  // ── 4. Produtos ─────────────────────────────────────────────
  const produtos = [
    { nome: 'Notebook Dell XPS 15',    preco: 8999.90, quantidade: 12, categoria: 'Informática' },
    { nome: 'Monitor LG 27" 4K',       preco: 2499.00, quantidade: 25, categoria: 'Informática' },
    { nome: 'Teclado Mecânico RGB',     preco:  349.90, quantidade: 50, categoria: 'Periféricos' },
    { nome: 'Mouse Sem Fio Logitech',   preco:  199.90, quantidade: 40, categoria: 'Periféricos' },
    { nome: 'Cadeira Gamer ErgoMax',    preco: 1299.00, quantidade:  8, categoria: 'Móveis' },
    { nome: 'Headset Sony WH-1000XM5', preco: 1999.00, quantidade: 15, categoria: 'Áudio' },
    { nome: 'HD Externo 2TB Seagate',   preco:  449.90, quantidade: 30, categoria: 'Armazenamento' },
    { nome: 'Webcam Full HD 1080p',     preco:  289.00, quantidade: 20, categoria: 'Periféricos' },
  ];
  const produtosCriados: { id: number; preco: number }[] = [];
  for (const p of produtos) {
    const prod = await prisma.produto.upsert({
      where: { id: produtosCriados.length + 1 },
      update: {},
      create: p,
    });
    produtosCriados.push(prod);
  }
  console.log(`  ✓ ${produtos.length} produtos`);

  // ── 5. Vendas / Pedidos ─────────────────────────────────────
  type StatusVenda = 'aberto' | 'em_andamento' | 'concluido' | 'cancelado';
  const vendasDef: Array<{
    clienteIdx: number;
    funcIdx: number;
    status: StatusVenda;
    itens: Array<{ produtoIdx: number; quantidade: number }>;
  }> = [
    {
      clienteIdx: 0, funcIdx: 0, status: 'concluido',
      itens: [
        { produtoIdx: 0, quantidade: 1 }, // Notebook
        { produtoIdx: 2, quantidade: 2 }, // Teclado
      ],
    },
    {
      clienteIdx: 1, funcIdx: 0, status: 'em_andamento',
      itens: [
        { produtoIdx: 1, quantidade: 2 }, // Monitor
        { produtoIdx: 3, quantidade: 2 }, // Mouse
      ],
    },
    {
      clienteIdx: 2, funcIdx: 0, status: 'aberto',
      itens: [
        { produtoIdx: 5, quantidade: 1 }, // Headset
      ],
    },
    {
      clienteIdx: 3, funcIdx: 0, status: 'concluido',
      itens: [
        { produtoIdx: 4, quantidade: 2 }, // Cadeira
        { produtoIdx: 6, quantidade: 3 }, // HD
      ],
    },
    {
      clienteIdx: 4, funcIdx: 0, status: 'aberto',
      itens: [
        { produtoIdx: 7, quantidade: 1 }, // Webcam
        { produtoIdx: 2, quantidade: 1 }, // Teclado
      ],
    },
  ];

  for (const v of vendasDef) {
    const itensPrices = v.itens.map(it => ({
      produtoId: produtosCriados[it.produtoIdx].id,
      quantidade: it.quantidade,
      precoUnit: produtosCriados[it.produtoIdx].preco,
    }));
    const total = itensPrices.reduce((sum, it) => sum + it.precoUnit * it.quantidade, 0);

    await prisma.venda.create({
      data: {
        clienteId: clientesCriados[v.clienteIdx].id,
        funcionarioId: funcCriados[v.funcIdx].id,
        status: v.status,
        total,
        itens: { create: itensPrices },
      },
    });
  }
  console.log(`  ✓ ${vendasDef.length} vendas com itens`);

  // ── 6. Contas Financeiras ───────────────────────────────────
  const contas = [
    { tipo: 'receita',  descricao: 'Pagamento Alpha Ltda — NF #1001',  valor: 9699.70, pago: true,  vencimento: new Date('2026-05-10') },
    { tipo: 'receita',  descricao: 'Pagamento Beta Comércio — NF #1002', valor: 5397.80, pago: false, vencimento: new Date('2026-06-15') },
    { tipo: 'despesa',  descricao: 'Aluguel sede — Junho/2026',          valor: 4500.00, pago: false, vencimento: new Date('2026-06-05') },
    { tipo: 'despesa',  descricao: 'Salários — Maio/2026',               valor: 16500.00, pago: true, vencimento: new Date('2026-05-30') },
    { tipo: 'receita',  descricao: 'Pagamento Elena Rodrigues',           valor: 1999.00, pago: false, vencimento: new Date('2026-06-20') },
    { tipo: 'despesa',  descricao: 'Internet e telefone — Junho',         valor:  350.00, pago: false, vencimento: new Date('2026-06-10') },
    { tipo: 'receita',  descricao: 'Gamma Tecnologia — NF #1003',        valor: 7497.70, pago: true,  vencimento: new Date('2026-05-25') },
    { tipo: 'despesa',  descricao: 'Material de escritório',              valor:  280.00, pago: true,  vencimento: new Date('2026-05-20') },
  ];
  for (const c of contas) {
    await prisma.contaFinanceira.create({ data: c });
  }
  console.log(`  ✓ ${contas.length} contas financeiras`);

  console.log('\n✅ Seed completo! Resumo:');
  console.log(`   👤 ${users.length} usuários`);
  console.log(`   👔 ${funcionarios.length} funcionários`);
  console.log(`   👥 ${clientes.length} clientes`);
  console.log(`   📦 ${produtos.length} produtos`);
  console.log(`   🛒 ${vendasDef.length} vendas`);
  console.log(`   💰 ${contas.length} contas financeiras`);
}

main()
  .catch((e) => { console.error('❌ Erro no seed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
