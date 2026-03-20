import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

const CREDS_KEY = "gabbar_admin_creds";
const SESSION_KEY = "gabbar_admin_session";
const DEFAULT_MOBILE = "8709397378";
const DEFAULT_PASSWORD = "kamal3803c";

function getStoredCreds() {
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { mobile: string; password: string };
      if (parsed.mobile && parsed.password) return parsed;
    }
  } catch {}
  return { mobile: DEFAULT_MOBILE, password: DEFAULT_PASSWORD };
}

type AdminAuthContextType = {
  isAdminAuthenticated: boolean;
  login: (mobile: string, password: string) => boolean;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(
    () => localStorage.getItem(SESSION_KEY) === "1",
  );

  const login = useCallback((mobile: string, password: string): boolean => {
    const inputMobile = mobile.trim();
    const inputPassword = password.trim();

    const isDefaultMatch =
      inputMobile === DEFAULT_MOBILE && inputPassword === DEFAULT_PASSWORD;

    const creds = getStoredCreds();
    const isStoredMatch =
      inputMobile === creds.mobile && inputPassword === creds.password;

    if (isDefaultMatch || isStoredMatch) {
      localStorage.setItem(SESSION_KEY, "1");
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setIsAdminAuthenticated(false);
  }, []);

  const changePassword = useCallback(
    (currentPassword: string, newPassword: string): boolean => {
      const creds = getStoredCreds();
      if (
        currentPassword !== creds.password &&
        currentPassword !== DEFAULT_PASSWORD
      ) {
        return false;
      }
      localStorage.setItem(
        CREDS_KEY,
        JSON.stringify({ mobile: creds.mobile, password: newPassword }),
      );
      return true;
    },
    [],
  );

  return (
    <AdminAuthContext.Provider
      value={{ isAdminAuthenticated, login, logout, changePassword }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextType {
  const ctx = useContext(AdminAuthContext);
  if (!ctx)
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
