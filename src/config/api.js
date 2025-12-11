const getApiBaseUrl = () => {
  let apiUrl = process.env.REACT_APP_API_URL;

  if (!apiUrl) {
    console.warn('REACT_APP_API_URL não está definida. Usando localhost para desenvolvimento.');
    return 'http://localhost:8080';
  }
  console.log('apiUrl', apiUrl);
  return apiUrl;
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;

