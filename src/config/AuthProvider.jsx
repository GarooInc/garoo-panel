import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};


export const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAuth, setIsAuth] = useState(false);



    return (
        <AuthContext.Provider
            value={{
                loading,
                error,
                isAuth,
                setLoading,
                setError,
                setIsAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
