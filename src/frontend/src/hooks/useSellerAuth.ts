import { useState, useCallback } from 'react';
import type { SellerStatus } from '../backend';

const STORAGE_KEY = 'samparc_seller';

export interface SellerSession {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  status: SellerStatus;
}

function readSession(): SellerSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SellerSession;
  } catch {
    return null;
  }
}

export function useSellerAuth() {
  const [currentSeller, setCurrentSeller] = useState<SellerSession | null>(
    () => readSession()
  );

  const saveSession = useCallback((session: SellerSession) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setCurrentSeller(session);
  }, []);

  const logoutSeller = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentSeller(null);
  }, []);

  const isSellerLoggedIn = currentSeller !== null;

  return {
    currentSeller,
    isSellerLoggedIn,
    saveSession,
    logoutSeller,
  };
}

export function getSellerSession(): SellerSession | null {
  return readSession();
}
