import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use(config => {
  console.debug('→', config.method?.toUpperCase(), config.url);
  const token = typeof window !== 'undefined'
    ? localStorage.getItem('accessToken')
    : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => {
    console.debug('←', res.status, res.config.url);
    return res;
  },
  err => {
    console.error('← ERROR', err.response?.status || err.message);
    return Promise.reject(err);
  }
);

export default api;
