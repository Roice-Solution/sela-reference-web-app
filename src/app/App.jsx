import { useEffect, useRef, useState } from "react";
import { DatabaseManager } from "./components/DatabaseManager";
import { LoginPage } from "./components/LoginPage";
import { Toaster, toast } from "sonner";
import { getSession, loginWithPassword, logout } from "./api/supabase";
import { LanguageProvider, useI18n } from "./i18n/i18n";
const SESSION_START_KEY = "session-start";
const MAX_SESSION_AGE_MS = 3 * 60 * 60 * 1000;
const parseJwt = (token) => {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
        const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(payload);
    }
    catch {
        return null;
    }
};
const resolveSessionStart = (session) => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(SESSION_START_KEY);
    if (stored) {
        const parsed = Number(stored);
        return Number.isFinite(parsed) ? parsed : null;
    }
    const payload = parseJwt(session?.access_token);
    if (payload?.iat) {
        return payload.iat * 1000;
    }
    return null;
};
function AppContent() {
    const { t } = useI18n();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const sessionTimerRef = useRef(null);
    const clearSessionTimer = () => {
        if (sessionTimerRef.current) {
            clearTimeout(sessionTimerRef.current);
            sessionTimerRef.current = null;
        }
    };
    const scheduleSessionExpiry = (startTime) => {
        if (!startTime) return;
        const remaining = MAX_SESSION_AGE_MS - (Date.now() - startTime);
        if (remaining <= 0) {
            handleSessionExpiry();
            return;
        }
        clearSessionTimer();
        sessionTimerRef.current = setTimeout(handleSessionExpiry, remaining);
    };
    const handleSessionExpiry = async () => {
        clearSessionTimer();
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(SESSION_START_KEY);
        }
        try {
            await logout();
        }
        catch (error) {
            toast.error(error?.message || t("toasts.logoutFailed"));
        }
        setIsAuthenticated(false);
        setUserEmail("");
        toast.error(t("toasts.sessionExpired"));
    };
    useEffect(() => {
        const loadSession = async () => {
            try {
                const session = await getSession();
                if (session?.user?.email) {
                    const startTime = resolveSessionStart(session) || Date.now();
                    if (typeof window !== "undefined") {
                        window.localStorage.setItem(SESSION_START_KEY, String(startTime));
                    }
                    const age = Date.now() - startTime;
                    if (age >= MAX_SESSION_AGE_MS) {
                        await handleSessionExpiry();
                        return;
                    }
                    scheduleSessionExpiry(startTime);
                    setIsAuthenticated(true);
                    setUserEmail(session.user.email);
                }
            }
            catch (error) {
                toast.error(error?.message || t("toasts.restoreSessionFailed"));
            }
        };
        loadSession();
        return () => clearSessionTimer();
    }, [t]);
    const handleLogin = async (email, password) => {
        setIsAuthLoading(true);
        try {
            const { session, user } = await loginWithPassword(email, password);
            if (!session) {
                throw new Error("No session returned from login.");
            }
            const startTime = Date.now();
            if (typeof window !== "undefined") {
                window.localStorage.setItem(SESSION_START_KEY, String(startTime));
            }
            scheduleSessionExpiry(startTime);
            setIsAuthenticated(true);
            setUserEmail(user?.email || email);
            toast.success(t("toasts.loginSuccess"));
        }
        catch (error) {
            toast.error(error?.message || t("toasts.loginFailed"));
        }
        finally {
            setIsAuthLoading(false);
        }
    };
    const handleLogout = async () => {
        try {
            await logout();
        }
        catch (error) {
            toast.error(error?.message || t("toasts.logoutFailed"));
        }
        finally {
            clearSessionTimer();
            if (typeof window !== "undefined") {
                window.localStorage.removeItem(SESSION_START_KEY);
            }
            setIsAuthenticated(false);
            setUserEmail("");
            toast.success(t("toasts.logoutSuccess"));
        }
    };
    return (<>
      {isAuthenticated ? (<DatabaseManager userEmail={userEmail} onLogout={handleLogout} />) : (<LoginPage onLogin={handleLogin} isLoading={isAuthLoading} />)}
      <Toaster position="top-right" offset={{ top: 24, right: 24 }}/>
    </>);
}
export default function App() {
    return (<LanguageProvider>
      <AppContent />
    </LanguageProvider>);
}
