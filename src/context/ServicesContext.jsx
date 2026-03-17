import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { redtecInstance } from "../api/axios";
import { useAuth } from "./AuthContext";
import { ALL_SERVICES } from "../constants/services";

const ServicesContext = createContext();

export const useServices = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error("useServices must be used within a ServicesProvider");
    }
    return context;
};

export const ServicesProvider = ({ children }) => {
    const { user } = useAuth();
    const [userServices, setUserServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserServices = useCallback(async () => {
        if (!user || !user._id) {
            setUserServices([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // The request includes the user ID to get specific services
            const response = await redtecInstance.get("get-services", {
                params: { userId: user._id }
            });
            
            const fetchedList = response.data?.services_list || [];
            
            const enrichedServices = fetchedList.map(s => {
                const apiSlug = (s.slug || "").toLowerCase().trim();
                const localService = ALL_SERVICES.find(as => (as.slug || "").toLowerCase().trim() === apiSlug);
                
                if (localService) {
                    return { ...localService, apiName: s.name, apiClient: s.client_name };
                }

                // Dynamic fallback for matching external slugs
                return {
                    id: s.slug || s._id,
                    label: s.name,
                    sublabel: s.client_name,
                    path: `/${s.slug}`,
                    icon: "bi bi-box-seam",
                    color: "#64748b",
                    bgColor: "rgba(100,116,139,0.08)",
                    description: "Herramienta operativa activa sincronizada vía API."
                };
            });

            setUserServices(enrichedServices);
        } catch (error) {
            console.error("Error fetching user services:", error);
            setUserServices([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUserServices();
    }, [fetchUserServices]);

    const hasServicePermission = (serviceId) => {
        if (!user) return false;
        if (user.client === "admin") return true;
        return userServices.some(s => s.id === serviceId);
    };

    return (
        <ServicesContext.Provider value={{ userServices, loading, fetchUserServices, hasServicePermission }}>
            {children}
        </ServicesContext.Provider>
    );
};
