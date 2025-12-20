import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Login from './index';

const LoginContainer = () => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e, formValues = null) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const finalUsername = formValues?.username || username;
      const finalSenha = formValues?.senha || senha;

      const result = await login(finalUsername, finalSenha);

      if (!result.success) {
        setError(result.error || 'Credenciais inválidas');
      }
    } catch (error) {
      setError(error.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSenhaChange = (e) => {
    setSenha(e.target.value);
  };

  return (
    <Login
      username={username}
      senha={senha}
      error={error}
      loading={loading}
      onUsernameChange={handleUsernameChange}
      onSenhaChange={handleSenhaChange}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginContainer;


