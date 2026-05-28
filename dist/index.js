"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const clientes_1 = __importDefault(require("./routes/clientes"));
const estoque_1 = __importDefault(require("./routes/estoque"));
const financeiro_1 = __importDefault(require("./routes/financeiro"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
    credentials: true,
}));
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.json({ mensagem: 'Servidor funcionando!' });
});
app.use('/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/clientes', clientes_1.default);
app.use('/api/estoque', estoque_1.default);
app.use('/api/financeiro', financeiro_1.default);
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
