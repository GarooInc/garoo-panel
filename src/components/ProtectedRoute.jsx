import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useServices } from "../context/ServicesContext";

const ProtectedRoute = ({ children, serviceId, requiredRole }) => {
    const { user, loading: authLoading } = useAuth();
    const { hasServicePermission, loading: servicesLoading } = useServices();
    const location = useLocation();

    if (authLoading || servicesLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#64748b' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status"></div>
                    <div>Sincronizando accesos...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role-based check
    if (requiredRole && user.client !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    // Service-based check
    if (serviceId && !hasServicePermission(serviceId)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
