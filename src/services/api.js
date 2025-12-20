import API_BASE_URL from '../config/api';

const handleUnauthorized = (response, endpoint) => {
  if (response.status === 401) {
    // Não redireciona se for a requisição de login (para permitir exibir mensagem de erro)
    if (endpoint && endpoint.includes('/api/auth/login')) {
      return null;
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    return new Promise(() => {});
  }
  return null;
};

const api = {
  async request(endpoint, options = {}) {
    if (!API_BASE_URL) {
      throw new Error('API_BASE_URL não está configurada. Verifique a variável de ambiente REACT_APP_API_URL.');
    }

    const token = localStorage.getItem('accessToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const unauthorizedResult = handleUnauthorized(response, endpoint);
      if (unauthorizedResult) {
        return unauthorizedResult;
      }
      
      let errorMessage = 'Erro na requisição';
      const clonedResponse = response.clone();
      try {
        const errorText = await clonedResponse.text();
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorText || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
      } catch {
        errorMessage = `Erro ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  },

  async login(username, senha) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: { username, senha },
    });
  },

  async logout(refreshToken) {
    return this.request('/api/auth/logout', {
      method: 'POST',
      body: { refreshToken },
    });
  },

  async refreshToken(refreshToken) {
    return this.request('/api/auth/refresh-token', {
      method: 'POST',
      body: { refreshToken },
    });
  },

  async listarDicas() {
    return this.request('/api/dicas', {
      method: 'GET',
    });
  },

  async buscarDicaPorId(id) {
    return this.request(`/api/dicas/${id}`, {
      method: 'GET',
    });
  },

  async cadastrarDica(formData) {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/dicas`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const unauthorizedResult = handleUnauthorized(response, '/api/dicas');
        if (unauthorizedResult) {
          return unauthorizedResult;
        }
        
        let errorMessage = 'Erro ao cadastrar dica';
        const clonedResponse = response.clone();
        try {
          const errorData = await clonedResponse.json();
          if (errorData.errors) {
            const error = new Error(errorData.message || errorMessage);
            error.response = errorData;
            error.errors = errorData.errors;
            throw error;
          }
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          if (err.errors) {
            throw err;
          }
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            if (response.status === 413) {
              errorMessage = 'O arquivo é muito grande. Tamanho máximo permitido: 50 MB. Por favor, escolha um arquivo menor.';
            }
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message.includes('NetworkError')) {
        throw new Error('Erro ao enviar arquivo. Verifique sua conexão ou se o arquivo não excede 50 MB.');
      }
      throw error;
    }
  },

  obterImagemUrl(id) {
    return `${API_BASE_URL}/api/dicas/${id}/imagem`;
  },

  obterIconeUrl(id) {
    return `${API_BASE_URL}/api/dicas/${id}/icone`;
  },

  async atualizarDica(id, formData) {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/dicas/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const unauthorizedResult = handleUnauthorized(response, `/api/dicas/${id}`);
        if (unauthorizedResult) {
          return unauthorizedResult;
        }
        
        let errorMessage = 'Erro ao atualizar dica';
        const clonedResponse = response.clone();
        try {
          const errorData = await clonedResponse.json();
          if (errorData.errors) {
            const error = new Error(errorData.message || errorMessage);
            error.response = errorData;
            error.errors = errorData.errors;
            throw error;
          }
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          if (err.errors) {
            throw err;
          }
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            if (response.status === 413) {
              errorMessage = 'O arquivo é muito grande. Tamanho máximo permitido: 50 MB. Por favor, escolha um arquivo menor.';
            }
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message.includes('NetworkError')) {
        throw new Error('Erro ao enviar arquivo. Verifique sua conexão ou se o arquivo não excede 50 MB.');
      }
      throw error;
    }
  },

  async excluirDica(id) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/api/dicas/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const unauthorizedResult = handleUnauthorized(response, `/api/dicas/${id}`);
      if (unauthorizedResult) {
        return unauthorizedResult;
      }
      const error = await response.text();
      throw new Error(error || 'Erro ao excluir dica');
    }
  },

  async listarVidaNoturna() {
    return this.request('/api/vida-noturna', {
      method: 'GET',
    });
  },

  async buscarVidaNoturnaPorId(id) {
    return this.request(`/api/vida-noturna/${id}`, {
      method: 'GET',
    });
  },

  async cadastrarVidaNoturna(formData) {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vida-noturna`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const unauthorizedResult = handleUnauthorized(response, '/api/vida-noturna');
        if (unauthorizedResult) {
          return unauthorizedResult;
        }
        
        let errorMessage = 'Erro ao cadastrar vida noturna';
        const clonedResponse = response.clone();
        try {
          const errorData = await clonedResponse.json();
          if (errorData.errors) {
            const error = new Error(errorData.message || errorMessage);
            error.response = errorData;
            error.errors = errorData.errors;
            throw error;
          }
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          if (err.errors) {
            throw err;
          }
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            if (response.status === 413) {
              errorMessage = 'O arquivo é muito grande. Tamanho máximo permitido: 50 MB. Por favor, escolha um arquivo menor.';
            }
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Erro de conexão. Verifique sua internet ou se o servidor está disponível.');
      }
      throw error;
    }
  },

  async atualizarVidaNoturna(id, formData) {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/vida-noturna/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const unauthorizedResult = handleUnauthorized(response, `/api/vida-noturna/${id}`);
        if (unauthorizedResult) {
          return unauthorizedResult;
        }
        
        let errorMessage = 'Erro ao atualizar vida noturna';
        const clonedResponse = response.clone();
        try {
          const errorData = await clonedResponse.json();
          if (errorData.errors) {
            const error = new Error(errorData.message || errorMessage);
            error.response = errorData;
            error.errors = errorData.errors;
            throw error;
          }
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          if (err.errors) {
            throw err;
          }
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            if (response.status === 413) {
              errorMessage = 'O arquivo é muito grande. Tamanho máximo permitido: 50 MB. Por favor, escolha um arquivo menor.';
            }
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message.includes('NetworkError')) {
        throw new Error('Erro ao enviar arquivo. Verifique sua conexão ou se o arquivo não excede 50 MB.');
      }
      throw error;
    }
  },

  async excluirVidaNoturna(id) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/api/vida-noturna/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const unauthorizedResult = handleUnauthorized(response, `/api/vida-noturna/${id}`);
      if (unauthorizedResult) {
        return unauthorizedResult;
      }
      const error = await response.text();
      throw new Error(error || 'Erro ao excluir vida noturna');
    }
  },

  async listarPasseios() {
    return this.request('/api/passeios', {
      method: 'GET',
    });
  },

  async buscarPasseioPorId(id) {
    return this.request(`/api/passeios/${id}`, {
      method: 'GET',
    });
  },

  async cadastrarPasseio(formData) {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/passeios`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const unauthorizedResult = handleUnauthorized(response, '/api/passeios');
        if (unauthorizedResult) {
          return unauthorizedResult;
        }
        
        let errorMessage = 'Erro ao cadastrar passeio';
        const clonedResponse = response.clone();
        try {
          const errorData = await clonedResponse.json();
          if (errorData.errors) {
            const error = new Error(errorData.message || errorMessage);
            error.response = errorData;
            error.errors = errorData.errors;
            throw error;
          }
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          if (err.errors) {
            throw err;
          }
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            if (response.status === 413) {
              errorMessage = 'O arquivo é muito grande. Tamanho máximo permitido: 50 MB. Por favor, escolha um arquivo menor.';
            }
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message.includes('NetworkError')) {
        throw new Error('Erro ao enviar arquivo. Verifique sua conexão ou se o arquivo não excede 50 MB.');
      }
      throw error;
    }
  },

  obterImagemPasseioUrl(id) {
    return `${API_BASE_URL}/api/passeios/${id}/imagem`;
  },

  async atualizarPasseio(id, formData) {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/passeios/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const unauthorizedResult = handleUnauthorized(response, `/api/passeios/${id}`);
        if (unauthorizedResult) {
          return unauthorizedResult;
        }
        
        let errorMessage = 'Erro ao atualizar passeio';
        const clonedResponse = response.clone();
        try {
          const errorData = await clonedResponse.json();
          if (errorData.errors) {
            const error = new Error(errorData.message || errorMessage);
            error.response = errorData;
            error.errors = errorData.errors;
            throw error;
          }
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          if (err.errors) {
            throw err;
          }
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            if (response.status === 413) {
              errorMessage = 'O arquivo é muito grande. Tamanho máximo permitido: 50 MB. Por favor, escolha um arquivo menor.';
            }
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message.includes('NetworkError')) {
        throw new Error('Erro ao enviar arquivo. Verifique sua conexão ou se o arquivo não excede 50 MB.');
      }
      throw error;
    }
  },

  async excluirPasseio(id) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/api/passeios/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const unauthorizedResult = handleUnauthorized(response, `/api/passeios/${id}`);
      if (unauthorizedResult) {
        return unauthorizedResult;
      }
      const error = await response.text();
      throw new Error(error || 'Erro ao excluir passeio');
    }
  },

  async listarRestaurantes(categoria = null) {
    const endpoint = categoria && categoria !== 'null' && categoria !== 'undefined'
      ? `/api/restaurantes?categoria=${encodeURIComponent(categoria)}`
      : '/api/restaurantes';
    return this.request(endpoint, {
      method: 'GET',
    });
  },

  async buscarRestaurantePorId(id) {
    return this.request(`/api/restaurantes/${id}`, {
      method: 'GET',
    });
  },

  async cadastrarRestaurante(formData) {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurantes`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const unauthorizedResult = handleUnauthorized(response, '/api/restaurantes');
        if (unauthorizedResult) {
          return unauthorizedResult;
        }
        
        let errorMessage = 'Erro ao cadastrar restaurante';
        const clonedResponse = response.clone();
        try {
          const errorData = await clonedResponse.json();
          if (errorData.errors) {
            const error = new Error(errorData.message || errorMessage);
            error.response = errorData;
            error.errors = errorData.errors;
            throw error;
          }
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          if (err.errors) {
            throw err;
          }
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            if (response.status === 413) {
              errorMessage = 'O arquivo é muito grande. Tamanho máximo permitido: 50 MB. Por favor, escolha um arquivo menor.';
            }
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message.includes('NetworkError')) {
        throw new Error('Erro ao enviar arquivo. Verifique sua conexão ou se o arquivo não excede 50 MB.');
      }
      throw error;
    }
  },

  obterImagemRestauranteUrl(id) {
    return `${API_BASE_URL}/api/restaurantes/${id}/imagem`;
  },

  async atualizarRestaurante(id, formData) {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/restaurantes/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        const unauthorizedResult = handleUnauthorized(response, `/api/restaurantes/${id}`);
        if (unauthorizedResult) {
          return unauthorizedResult;
        }
        
        let errorMessage = 'Erro ao atualizar restaurante';
        const clonedResponse = response.clone();
        try {
          const errorData = await clonedResponse.json();
          if (errorData.errors) {
            const error = new Error(errorData.message || errorMessage);
            error.response = errorData;
            error.errors = errorData.errors;
            throw error;
          }
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          if (err.errors) {
            throw err;
          }
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
            if (response.status === 413) {
              errorMessage = 'O arquivo é muito grande. Tamanho máximo permitido: 50 MB. Por favor, escolha um arquivo menor.';
            }
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError' || error.message.includes('NetworkError')) {
        throw new Error('Erro ao enviar arquivo. Verifique sua conexão ou se o arquivo não excede 50 MB.');
      }
      throw error;
    }
  },

  async excluirRestaurante(id) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_BASE_URL}/api/restaurantes/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const unauthorizedResult = handleUnauthorized(response, `/api/restaurantes/${id}`);
      if (unauthorizedResult) {
        return unauthorizedResult;
      }
      const error = await response.text();
      throw new Error(error || 'Erro ao excluir restaurante');
    }
  },

  async listarPontosInteresse() {
    return this.request('/api/pontos-interesse', {
      method: 'GET',
    });
  },

  async buscarPontoInteressePorId(id) {
    return this.request(`/api/pontos-interesse/${id}`, {
      method: 'GET',
    });
  },

  async cadastrarPontoInteresse(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pontos-interesse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('accessToken') && { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const unauthorizedResult = handleUnauthorized(response, '/api/pontos-interesse');
        if (unauthorizedResult) {
          return unauthorizedResult;
        }
        
        let errorMessage = 'Erro ao cadastrar ponto de interesse';
        const clonedResponse = response.clone();
        try {
          const errorData = await clonedResponse.json();
          if (errorData.errors) {
            const error = new Error(errorData.message || errorMessage);
            error.response = errorData;
            error.errors = errorData.errors;
            throw error;
          }
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          if (err.errors) {
            throw err;
          }
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.errors) {
        throw error;
      }
      throw error;
    }
  },

  async atualizarPontoInteresse(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pontos-interesse/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('accessToken') && { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const unauthorizedResult = handleUnauthorized(response, `/api/pontos-interesse/${id}`);
        if (unauthorizedResult) {
          return unauthorizedResult;
        }
        
        let errorMessage = 'Erro ao atualizar ponto de interesse';
        const clonedResponse = response.clone();
        try {
          const errorData = await clonedResponse.json();
          if (errorData.errors) {
            const error = new Error(errorData.message || errorMessage);
            error.response = errorData;
            error.errors = errorData.errors;
            throw error;
          }
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          if (err.errors) {
            throw err;
          }
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {
          }
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error.errors) {
        throw error;
      }
      throw error;
    }
  },

  async excluirPontoInteresse(id) {
    return this.request(`/api/pontos-interesse/${id}`, {
      method: 'DELETE',
    });
  },

  async listarAeroportos() {
    return this.request('/api/calculadora-viagem/aeroportos', {
      method: 'GET',
    });
  },

  async cadastrarAeroporto(data) {
    return this.request('/api/calculadora-viagem/aeroportos', {
      method: 'POST',
      body: data,
    });
  },

  async atualizarAeroporto(id, data) {
    return this.request(`/api/calculadora-viagem/aeroportos/${id}`, {
      method: 'PUT',
      body: data,
    });
  },

  async excluirAeroporto(id) {
    return this.request(`/api/calculadora-viagem/aeroportos/${id}`, {
      method: 'DELETE',
    });
  },
};

export default api;
