import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

import { Login }          from './pages/Login';
import { Cadastro }       from './pages/Cadastro';
import { VerificarEmail } from './pages/VerificarEmail';
import { EsqueciSenha }  from './pages/EsqueciSenha';
import { RedefinirSenha } from './pages/RedefinirSenha';
import { Dashboard }      from './pages/Dashboard';
import { Clientes }       from './pages/Clientes';
import { Estoque }        from './pages/Estoque';
import { Vendas }         from './pages/Vendas';
import { Financeiro }     from './pages/Financeiro';
import { Usuarios }       from './pages/Usuarios';
import { SemPermissao }   from './pages/SemPermissao';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login"           element={<Login />} />
          <Route path="/cadastro"        element={<Cadastro />} />
          <Route path="/verificar-email" element={<VerificarEmail />} />
          <Route path="/esqueci-senha"   element={<EsqueciSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />

          {/* Rotas protegidas — todas dentro do Layout */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            <Route
              path="clientes"
              element={
                <ProtectedRoute module="clientes" action="view">
                  <Clientes />
                </ProtectedRoute>
              }
            />

            <Route
              path="estoque"
              element={
                <ProtectedRoute module="estoque" action="view">
                  <Estoque />
                </ProtectedRoute>
              }
            />

            <Route
              path="vendas"
              element={
                <ProtectedRoute module="vendas" action="view">
                  <Vendas />
                </ProtectedRoute>
              }
            />

            <Route
              path="financeiro"
              element={
                <ProtectedRoute module="financeiro" action="view">
                  <Financeiro />
                </ProtectedRoute>
              }
            />

            <Route
              path="usuarios"
              element={
                <ProtectedRoute module="users" action="view">
                  <Usuarios />
                </ProtectedRoute>
              }
            />

            <Route path="sem-permissao" element={<SemPermissao />} />
          </Route>

          {/* Qualquer outra rota → Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
