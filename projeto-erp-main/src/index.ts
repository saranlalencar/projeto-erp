import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import clientesRoutes from './routes/clientes';
import estoqueRoutes from './routes/estoque';
import financeiroRoutes from './routes/financeiro';
import vendasRoutes from './routes/vendas';
import notificacoesRoutes from './routes/notificacoes';

const app = express();

app.use(cors({
  origin: (origin, cb) => {
    // Permite: sem origin (curl/Postman), localhost em qualquer porta, e FRONTEND_URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:5500';
    const isLocalhost = !origin
      || origin === frontendUrl
      || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    cb(null, isLocalhost);
  },
  credentials: true,
}));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ mensagem: 'Servidor funcionando!' });
});

app.use('/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/financeiro', financeiroRoutes);
app.use('/api/vendas', vendasRoutes);
app.use('/api/notificacoes', notificacoesRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
