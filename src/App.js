import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Login from './pages/Login/Container';
import Dashboard from './pages/Dashboard';
import Dica from './pages/Dica/Container';
import VidaNoturna from './pages/VidaNoturna/Container';
import Passeio from './pages/Passeio/Container';
import Restaurante from './pages/Restaurante/Container';
import PontoInteresse from './pages/PontoInteresse/Container';
import Aeroporto from './pages/Aeroporto/Container';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dicas"
              element={
                <PrivateRoute>
                  <Dica />
                </PrivateRoute>
              }
            />
            <Route
              path="/vida-noturna"
              element={
                <PrivateRoute>
                  <VidaNoturna />
                </PrivateRoute>
              }
            />
            <Route
              path="/passeios"
              element={
                <PrivateRoute>
                  <Passeio />
                </PrivateRoute>
              }
            />
            <Route
              path="/restaurantes"
              element={
                <PrivateRoute>
                  <Restaurante />
                </PrivateRoute>
              }
            />
            <Route
              path="/pontos-interesse"
              element={
                <PrivateRoute>
                  <PontoInteresse />
                </PrivateRoute>
              }
            />
            <Route
              path="/aeroportos"
              element={
                <PrivateRoute>
                  <Aeroporto />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
