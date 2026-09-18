import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('teamsync_token'));
  const [manager, setManager] = useState(null);
  useEffect(() => {
    const signOut = () => { setToken(null); setManager(null); };
    window.addEventListener('teamsync:unauthorized', signOut);
    if (token) api.manager().then(setManager).catch(() => {});
    return () => window.removeEventListener('teamsync:unauthorized', signOut);
  }, [token]);

  async function signIn(credentials) {
    const result = await api.login(credentials);
    localStorage.setItem('teamsync_token', result.token);
    setToken(result.token);
  }

  function signOut() {
    localStorage.removeItem('teamsync_token');
    setToken(null);
    setManager(null);
  }

  const value = useMemo(() => ({ token, manager, signIn, signOut }), [token, manager]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
