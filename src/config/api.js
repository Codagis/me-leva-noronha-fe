const getApiBaseUrl = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  
  if (!apiUrl) {
    if (process.env.NODE_ENV === 'production') {
      console.error('REACT_APP_API_URL não está definida. Configure a variável de ambiente na Vercel.');
      return '';
    }
    console.warn('REACT_APP_API_URL não está definida. Usando localhost para desenvolvimento.');
    return 'http://localhost:8080';
  }
  
  return apiUrl;
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;

