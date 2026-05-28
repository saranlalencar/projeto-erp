import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

import { Login }          from './pages/Login';
import { VerificarEmail } from './pages/VerificarEmail';
import { Dashboard }      from './pages/Dashboard';
import { Clientes }       from './pages/Clientes';
import { Estoque }        from './pages/Estoque';
import { Vendas }         from './pages/Vendas';
import { Financeiro }     from './pages/Financeiro';
import { SemPermissao }   from './pages/SemPermissao';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login"          element={<Login />} />
          <Route path="/verificar-email" element={<VerificarEmail />} />

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

            <Route path="sem-permissao" element={<SemPermissao />} />
          </Route>

          {/* Qualquer outra rota → Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
