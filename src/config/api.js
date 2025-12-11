const getApiBaseUrl = () => {
  let apiUrl = process.env.REACT_APP_API_URL;
  
  if (!apiUrl) {
    if (process.env.NODE_ENV === 'production') {
      console.error('REACT_APP_API_URL não está definida. Configure a variável de ambiente na Vercel.');
      return '';
    }
    console.warn('REACT_APP_API_URL não está definida. Usando localhost para desenvolvimento.');
    return 'http://localhost:8080';
  }
  
  apiUrl = apiUrl.replace(/\/$/, '');
  
  if (process.env.NODE_ENV === 'production' && apiUrl.startsWith('http://')) {
    console.warn('⚠️ URL da API está usando HTTP. Convertendo para HTTPS para evitar Mixed Content.');
    apiUrl = apiUrl.replace('http://', 'https://');
  }
  
  return apiUrl;
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;

