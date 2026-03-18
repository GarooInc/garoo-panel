import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { redtecInstance } from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

const STORAGE_KEY = "garooToken";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Decodes the JWT and maps it to the application's user structure
    const getSessionFromToken = useCallback((token) => {
        if (!token) return null;
        
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            
            // Check for token expiration (JWT 'exp' field)
            if (payload.exp) {
                const currentTime = Math.floor(Date.now() / 1000);
                if (payload.exp < currentTime) {
                    console.warn("Session expired based on token timestamp (JWT exp)");
                    return null;
                }
            }

            const userData = payload.user || {};
            const role = userData.role || "user";
            const name = userData.name || payload.name || "Usuario";
            const email = userData.credentials?.user || payload.email || "";
            
            return {
                email: email,
                name: name,
                client: role,
                _id: userData._id || payload._id,
                ...payload
            };
        } catch (e) {
            console.error("Critical error parsing session token:", e);
            return null;
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const verifyToken = useCallback(async () => {
        const token = localStorage.getItem(STORAGE_KEY);
        if (!token) return false;

        try {
            const response = await redtecInstance.post("auth-verify");

            if (response.status === 200) {
                const data = response.data;
                const freshPayload = data.payload || data;
                
                if (freshPayload && freshPayload.user) {
                    const freshUser = getSessionFromToken(token);
                    setUser(prev => JSON.stringify(prev) === JSON.stringify(freshUser) ? prev : freshUser);
                    return true;
                }
            }
            
            logout();
            return false;
        } catch (error) {
            if (error.response?.status === 401) {
                logout();
                return false;
            }
            console.error("Session heartbeat error:", error);
            return true;
        }
    }, [logout, getSessionFromToken]);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem(STORAGE_KEY);
            if (token) {
                const initialUser = getSessionFromToken(token);
                if (initialUser) {
                    setUser(initialUser);
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
            const response = await redtecInstance.post("login", {
                user: email,
                password: password
            });

            const data = response.data;
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
            const errorMessage = error.response?.data?.message || error.message || "Credenciales inválidas";
            throw new Error(errorMessage);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
