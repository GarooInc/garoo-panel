import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Mapping of clients to their allowed service IDs
const CLIENT_PERMISSIONS = {
    rocknrolla: ["applications"],
    mundoverde: ["form"],
    ficohsa: ["outbound-call-form"],
    spectrum: ["spectrum-leads"],
    pepsi: ["video-analysis"],
    admin: [
        "dashboard",
        "services",
        "applications",
        "form",
        "outbound-call-form",
        "spectrum-leads",
        "video-analysis",
        "agent-onboarding"
    ]
};

const DUMMY_USERS = {
    "mundo@garoo.ai": { password: "123", client: "mundoverde", name: "Mundo Verde Admin" },
    "spectrum@garoo.ai": { password: "123", client: "spectrum", name: "Spectrum Admin" },
    "ficohsa@garoo.ai": { password: "123", client: "ficohsa", name: "Ficohsa Admin" },
    "pepsi@garoo.ai": { password: "123", client: "pepsi", name: "Pepsi Admin" },
    "rocknrolla@garoo.ai": { password: "123", client: "rocknrolla", name: "RocknRolla Admin" },
    "admin@garoo.ai": { password: "123", client: "admin", name: "Garoo Admin" },
};

const STORAGE_KEY = "garooToken";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Decodes the JWT and maps it to the application's user structure
    const getSessionFromToken = useCallback((token) => {
        if (!token) return null;
        
        try {
            // Decode local JWT for immediate UI state
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);

            // Integrate with project's permission/client logic
            const email = payload.user || payload.email;
            const foundUser = DUMMY_USERS[email] || { client: "mundoverde", name: payload.name || "Usuario Regional" };
            
            return {
                email: email,
                name: foundUser.name,
                client: foundUser.client,
                permissions: CLIENT_PERMISSIONS[foundUser.client] || [],
                ...payload // Include raw claims for extra data
            };
        } catch (e) {
            console.error("Critical error parsing session token:", e);
            return null;
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        // If there were other project-specific keys to clear, add them here
    }, []);

    const verifyToken = useCallback(async () => {
        const token = localStorage.getItem(STORAGE_KEY);
        if (!token) return false;

        try {
            const response = await fetch("https://agentsprod.redtec.ai/webhook/auth-verify", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 401) {
                logout();
                return false;
            }

            if (response.ok) {
                const data = await response.json();
                // We use the fresh data from n8n to ensure state is in sync
                const payload = data.payload || data;
                if (payload && (payload.user || payload.email)) {
                    const freshUser = getSessionFromToken(token);
                    setUser(prev => JSON.stringify(prev) === JSON.stringify(freshUser) ? prev : freshUser);
                    return true;
                }
            }
            
            logout();
            return false;
        } catch (error) {
            console.error("Session heartbeat error:", error);
            return true; // Don't logout on fluke network errors
        }
    }, [logout, getSessionFromToken]);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem(STORAGE_KEY);
            if (token) {
                const initialUser = getSessionFromToken(token);
                if (initialUser) {
                    setUser(initialUser);
                    // Verify in background to confirm validity
                    const isValid = await verifyToken();
                    if (!isValid) logout();
                } else {
                    logout();
                }
            }
            setLoading(false);
        };

        initAuth();

        const interval = setInterval(() => {
            verifyToken();
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, [verifyToken, logout, getSessionFromToken]);

    const login = async (email, password) => {
        try {
            const response = await fetch("https://agentsprod.redtec.ai/webhook/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: email, password: password }),
            });

            if (!response.ok) throw new Error("Credenciales inválidas");

            const data = await response.json();
            if (data.status === "success" && data.garooToken) {
                localStorage.setItem(STORAGE_KEY, data.garooToken);
                const userData = getSessionFromToken(data.garooToken);
                setUser(userData);
                return userData;
            } else {
                throw new Error(data.message || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Login process error:", error);
            throw error;
        }
    };

    const hasPermission = (serviceId) => {
        if (!user) return false;
        if (user.client === "admin") return true;
        return user.permissions.includes(serviceId);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hasPermission, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
