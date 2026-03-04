import { useState, useCallback } from 'react';

const ADMIN_CREDENTIALS = [
  { email: 'gauravsaswade2009@gmail.com', password: 'p1love2g' },
  { email: 'samparc2026@gmail.com', password: 'samparc@2025' },
];
const AUTH_KEY = 'samparc_admin_auth';
const AUTH_EMAIL_KEY = 'samparc_admin_email';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem(AUTH_KEY) === 'true'
  );
  const [adminEmail, setAdminEmail] = useState<string>(
    () => localStorage.getItem(AUTH_EMAIL_KEY) ?? ''
  );

  const login = useCallback((email: string, password: string): boolean => {
    const valid = ADMIN_CREDENTIALS.some(
      (cred) => cred.email === email && cred.password === password
    );
    if (valid) {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(AUTH_EMAIL_KEY, email);
      setIsAuthenticated(true);
      setAdminEmail(email);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(AUTH_EMAIL_KEY);
    setIsAuthenticated(false);
    setAdminEmail('');
  }, []);

  return { isAuthenticated, adminEmail, login, logout };
}
