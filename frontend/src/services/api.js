import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('wc_token'); // only the JWT is kept locally; all data lives in MongoDB
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
export const errMsg = (e) => e?.response?.data?.message || (e?.code === 'ERR_NETWORK' ? 'Cannot reach server. Please try again.' : e?.message || 'Something went wrong');
export const inr = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');
export default api;
