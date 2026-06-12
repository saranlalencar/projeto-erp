import { Request, Response, NextFunction } from 'express';
import prisma from '../prisma';
import { supabaseAdmin } from '../lib/supabaseAdmin';

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'nao_autenticado' });
    return;
  }

  const token = header.slice(7);
  const { data: { user: supaUser }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !supaUser) {
    res.status(401).json({ error: 'token_invalido' });
    return;
  }

  // Busca ou cria o perfil no Prisma (criação lazy no primeiro login)
  let perfil = await prisma.user.findUnique({ where: { id: supaUser.id } });
  const VALID_ROLES = ['admin', 'vendedor'];
  const rawRole = supaUser.user_metadata?.role as string | undefined;
  const metaRole = rawRole && VALID_ROLES.includes(rawRole) ? rawRole : 'vendedor';

  if (!perfil) {
    const name = (supaUser.user_metadata?.name as string | undefined)
      || supaUser.email?.split('@')[0]
      || 'Usuário';

    perfil = await prisma.user.create({
      data: {
        id: supaUser.id,
        name,
        email: supaUser.email!,
        password: 'supabase_managed',
        role: metaRole,
        status: 'ativo',
        emailVerified: true,
      },
    });
  } else if (metaRole !== 'vendedor' && perfil.role !== metaRole) {
    // Sincroniza role do Supabase metadata caso o registro Prisma esteja desatualizado
    perfil = await prisma.user.update({
      where: { id: perfil.id },
      data: { role: metaRole },
    });
  }

  if (perfil.status === 'bloqueado') {
    res.status(423).json({ error: 'conta_bloqueada' });
    return;
  }

  req.user = { id: perfil.id, email: perfil.email, role: perfil.role };
  next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ error: 'sem_permissao' });
      return;
    }
    next();
  };
}
