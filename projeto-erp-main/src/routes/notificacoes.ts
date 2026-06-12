import { Router, Response } from 'express';
import prisma from '../prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

interface Notificacao {
  id: string;
  tipo: 'danger' | 'warning' | 'info';
  titulo: string;
  descricao: string;
  rota: string;
  icone: string;
}

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const role = req.user!.role;
    const notifs: Notificacao[] = [];
    const agora = new Date();
    const em7Dias = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (role === 'admin') {
      // Contas financeiras vencidas (não pagas + vencimento no passado)
      // NULL < date sempre é falso em SQL, então vencimento IS NULL é excluído implicitamente
      const contasVencidas = await prisma.contaFinanceira.count({
        where: { pago: false, vencimento: { lt: agora } },
      });
      if (contasVencidas > 0) {
        notifs.push({
          id: 'contas-vencidas',
          tipo: 'danger',
          titulo: `${contasVencidas} conta${contasVencidas > 1 ? 's' : ''} vencida${contasVencidas > 1 ? 's' : ''}`,
          descricao: 'Contas financeiras em atraso — ação urgente',
          rota: '/financeiro',
          icone: 'wallet',
        });
      }

      // Contas a vencer nos próximos 7 dias (não pagas)
      const contasAVencer = await prisma.contaFinanceira.count({
        where: { pago: false, vencimento: { gte: agora, lte: em7Dias } },
      });
      if (contasAVencer > 0) {
        notifs.push({
          id: 'contas-a-vencer',
          tipo: 'warning',
          titulo: `${contasAVencer} conta${contasAVencer > 1 ? 's' : ''} a vencer`,
          descricao: 'Vencem nos próximos 7 dias',
          rota: '/financeiro',
          icone: 'wallet',
        });
      }

      // Usuários bloqueados aguardando reativação
      const usuariosBloqueados = await prisma.user.count({ where: { status: 'bloqueado' } });
      if (usuariosBloqueados > 0) {
        notifs.push({
          id: 'usuarios-bloqueados',
          tipo: 'warning',
          titulo: `${usuariosBloqueados} usuário${usuariosBloqueados > 1 ? 's' : ''} bloqueado${usuariosBloqueados > 1 ? 's' : ''}`,
          descricao: 'Aguardando reativação pelo administrador',
          rota: '/usuarios',
          icone: 'shield',
        });
      }

      // Produtos com estoque zerado
      const semEstoque = await prisma.produto.count({ where: { quantidade: 0 } });
      if (semEstoque > 0) {
        notifs.push({
          id: 'estoque-zerado',
          tipo: 'danger',
          titulo: `${semEstoque} produto${semEstoque > 1 ? 's' : ''} sem estoque`,
          descricao: 'Reposição urgente necessária',
          rota: '/estoque',
          icone: 'package',
        });
      }

      // Produtos com estoque crítico (1 a 5 unidades)
      const estoqueBaixo = await prisma.produto.count({
        where: { quantidade: { gt: 0, lte: 5 } },
      });
      if (estoqueBaixo > 0) {
        notifs.push({
          id: 'estoque-critico',
          tipo: 'warning',
          titulo: `${estoqueBaixo} produto${estoqueBaixo > 1 ? 's' : ''} com estoque crítico`,
          descricao: 'Menos de 5 unidades restantes',
          rota: '/estoque',
          icone: 'package',
        });
      }
    }

    if (role === 'vendedor') {
      // Vendas em aberto aguardando início
      const vendasAbertas = await prisma.venda.count({ where: { status: 'aberto' } });
      if (vendasAbertas > 0) {
        notifs.push({
          id: 'vendas-abertas',
          tipo: 'info',
          titulo: `${vendasAbertas} venda${vendasAbertas > 1 ? 's' : ''} em aberto`,
          descricao: 'Aguardando início do atendimento',
          rota: '/vendas',
          icone: 'cart',
        });
      }

      // Vendas em andamento aguardando conclusão
      const emAndamento = await prisma.venda.count({ where: { status: 'em_andamento' } });
      if (emAndamento > 0) {
        notifs.push({
          id: 'vendas-andamento',
          tipo: 'warning',
          titulo: `${emAndamento} venda${emAndamento > 1 ? 's' : ''} em andamento`,
          descricao: 'Aguardando conclusão',
          rota: '/vendas',
          icone: 'cart',
        });
      }

      // Produtos esgotados (impacta vendas)
      const semEstoque = await prisma.produto.count({ where: { quantidade: 0 } });
      if (semEstoque > 0) {
        notifs.push({
          id: 'produtos-esgotados',
          tipo: 'warning',
          titulo: `${semEstoque} produto${semEstoque > 1 ? 's' : ''} esgotado${semEstoque > 1 ? 's' : ''}`,
          descricao: 'Indisponível para venda no momento',
          rota: '/estoque',
          icone: 'package',
        });
      }

      // Produtos com estoque crítico (1 a 5 unidades)
      const estoqueCritico = await prisma.produto.count({
        where: { quantidade: { gt: 0, lte: 5 } },
      });
      if (estoqueCritico > 0) {
        notifs.push({
          id: 'estoque-critico-vendedor',
          tipo: 'warning',
          titulo: `${estoqueCritico} produto${estoqueCritico > 1 ? 's' : ''} com estoque crítico`,
          descricao: 'Menos de 5 unidades disponíveis para venda',
          rota: '/estoque',
          icone: 'package',
        });
      }
    }

    res.json(notifs);
  } catch {
    res.status(500).json({ error: 'erro_interno' });
  }
});

export default router;
