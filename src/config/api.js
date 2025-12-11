const getApiBaseUrl = () => {
  let apiUrl = process.env.REACT_APP_API_URL;
  
  return apiUrl;
};

const API_BASE_URL = getApiBaseUrl();

export default API_BASE_URL;

