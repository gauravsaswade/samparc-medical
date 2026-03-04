import { useState, useCallback } from 'react';

const STORAGE_KEY = 'samparc_customer';

export interface CustomerSession {
  id: string;
  name: string;
  email: string;
  phone: string;
}

function readSession(): CustomerSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomerSession;
  } catch {
    return null;
  }
}

export function useCustomerAuth() {
  const [currentCustomer, setCurrentCustomer] = useState<CustomerSession | null>(
    () => readSession()
  );

  const saveSession = useCallback((session: CustomerSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setCurrentCustomer(session);
  }, []);

  const logoutCustomer = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentCustomer(null);
  }, []);

  const isCustomerLoggedIn = currentCustomer !== null;

  return {
    currentCustomer,
    isCustomerLoggedIn,
    saveSession,
    logoutCustomer,
  };
}

export function getCustomerSession(): CustomerSession | null {
  return readSession();
}
