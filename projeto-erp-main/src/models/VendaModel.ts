import prisma from '../prisma';

// ── ItemVenda ────────────────────────────────────────────────

export class ItemVendaModel {
  id: number;
  vendaId: number;
  produtoId: number;
  quantidade: number;
  precoUnit: number;

  constructor(data: { id: number; vendaId: number; produtoId: number; quantidade: number; precoUnit: number }) {
    this.id       = data.id;
    this.vendaId  = data.vendaId;
    this.produtoId = data.produtoId;
    this.quantidade = data.quantidade;
    this.precoUnit  = data.precoUnit;
  }

  calcSubtotal(): number {
    return this.quantidade * this.precoUnit;
  }

  async validateEstoque(): Promise<boolean> {
    const produto = await prisma.produto.findUnique({ where: { id: this.produtoId } });
    return produto !== null && produto.quantidade >= this.quantidade;
  }
}

// ── Venda ────────────────────────────────────────────────────

export class VendaModel {
  id: number;
  clienteId: number;
  userId: string | null;  // ID do usuário autenticado que registrou a venda
  status: string;
  total: number;
  createdAt: Date;

  constructor(data: { id: number; clienteId: number; funcionarioId?: number | null; status: string; total: number; createdAt: Date }) {
    this.id        = data.id;
    this.clienteId = data.clienteId;
    this.userId    = data.funcionarioId != null ? String(data.funcionarioId) : null;
    this.status    = data.status;
    this.total     = data.total;
    this.createdAt = data.createdAt;
  }

  static async create(data: {
    clienteId: number;
    funcionarioId?: number | null;
    itens: Array<{ produtoId: number; quantidade: number }>;
  }): Promise<VendaModel> {
    // Validar estoque antes de criar
    for (const item of data.itens) {
      const produto = await prisma.produto.findUnique({ where: { id: item.produtoId } });
      if (!produto) throw Object.assign(new Error('produto_nao_encontrado'), { produtoId: item.produtoId });
      if (produto.quantidade < item.quantidade) {
        throw Object.assign(new Error('estoque_insuficiente'), { produto: produto.nome, disponivel: produto.quantidade });
      }
    }

    // Buscar preços atuais
    const produtos = await prisma.produto.findMany({
      where: { id: { in: data.itens.map((i) => i.produtoId) } },
    });

    const total = data.itens.reduce((sum, item) => {
      const p = produtos.find((x) => x.id === item.produtoId);
      return sum + item.quantidade * (p?.preco ?? 0);
    }, 0);

    // Criar venda e descontar estoque em transação atômica
    const registro = await prisma.$transaction(async (tx) => {
      const venda = await tx.venda.create({
        data: {
          clienteId:    data.clienteId,
          funcionarioId: data.funcionarioId ?? null,
          total,
          status: 'aberto',
          itens: {
            create: data.itens.map((item) => {
              const p = produtos.find((x) => x.id === item.produtoId)!;
              return { produtoId: item.produtoId, quantidade: item.quantidade, precoUnit: p.preco };
            }),
          },
        },
      });

      for (const item of data.itens) {
        await tx.produto.update({
          where: { id: item.produtoId },
          data:  { quantidade: { decrement: item.quantidade } },
        });
      }

      return venda;
    });

    return new VendaModel(registro);
  }

  async updateStatus(status: string): Promise<void> {
    const validos = ['aberto', 'em_andamento', 'concluido', 'cancelado'];
    if (!validos.includes(status)) throw new Error('status_invalido');

    await prisma.venda.update({ where: { id: this.id }, data: { status } });
    this.status = status;
  }

  calcTotal(): number {
    return this.total;
  }

  async getItens(): Promise<ItemVendaModel[]> {
    const itens = await prisma.itemVenda.findMany({ where: { vendaId: this.id } });
    return itens.map((i) => new ItemVendaModel(i));
  }

  async cancelar(): Promise<void> {
    await this.updateStatus('cancelado');
  }
}
