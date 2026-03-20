import { useCallback, useState } from "react";

const CREDS_KEY = "gabbar_admin_creds";
const SESSION_KEY = "gabbar_admin_session";
// Default credentials -- always work as fallback
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

export function useAdminAuth() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );

  const login = useCallback((mobile: string, password: string): boolean => {
    const inputMobile = mobile.trim();
    const inputPassword = password.trim();

    // Always allow default credentials as master fallback
    const isDefaultMatch =
      inputMobile === DEFAULT_MOBILE && inputPassword === DEFAULT_PASSWORD;

    // Also allow custom stored credentials
    const creds = getStoredCreds();
    const isStoredMatch =
      inputMobile === creds.mobile && inputPassword === creds.password;

    if (isDefaultMatch || isStoredMatch) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdminAuthenticated(false);
  }, []);

  const changePassword = useCallback(
    (currentPassword: string, newPassword: string): boolean => {
      const creds = getStoredCreds();
      // Allow changing password if current matches stored OR default
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

  return { isAdminAuthenticated, login, logout, changePassword };
}
