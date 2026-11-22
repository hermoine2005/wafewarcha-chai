import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('wc_token')) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then((r) => setUser(r.data.user))
      .catch(() => localStorage.removeItem('wc_token'))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, body) => {
    const { data } = await api.post(path, body);
    localStorage.setItem('wc_token', data.token);
    setUser(data.user);
    return data.user;
  };
  const logout = () => {
    localStorage.removeItem('wc_token');
    setUser(null);
  };

  return (
    <Ctx.Provider value={{
      user, loading, logout,
      login: (b) => authenticate('/auth/login', b),
      adminLogin: (b) => authenticate('/auth/admin-login', b),
      register: (b) => authenticate('/auth/register', b),
    }}>
      {children}
    </Ctx.Provider>
  );
}
