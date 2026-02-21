import { useState, useEffect } from 'react';

export const useDevAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('avirbhav_dev_auth');
      if (auth === 'Palakh@1902') {
        setIsAuthorized(true);
      }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const login = (password: string) => {
    if (password === 'Palakh@1902') {
      localStorage.setItem('avirbhav_dev_auth', password);
      setIsAuthorized(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('avirbhav_dev_auth');
    setIsAuthorized(false);
  };

  return { isAuthorized, login, logout };
};
