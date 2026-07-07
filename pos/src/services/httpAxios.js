import axios from 'axios';

const httpAxios = axios.create({
  baseURL: 'http://localhost:8000/api', // URL backend Laravel
});

httpAxios.interceptors.request.use(config => {
  const token = localStorage.getItem('pos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpAxios;
