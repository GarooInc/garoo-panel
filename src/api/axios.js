import axios from "axios";

// Configuración común para todas las instancias
const commonConfig = {
    baseURL:
        import.meta.env.VITE_API_URL || "https://garoo-server.onrender.com",
    timeout: 30000, // Aumentado para procesos pesados de IA
};

// Creamos las instancias para cada servicio
const authInstance = axios.create({
    ...commonConfig,
});

const applicationsInstance = axios.create({
    ...commonConfig,
    baseURL: "https://rockanrolla-garoo.koyeb.app",
});

const redtecInstance = axios.create({
    ...commonConfig,
    baseURL: "https://agentsprod.redtec.ai/webhook",
});

const dataAgentInstance = axios.create({
    ...commonConfig,
    baseURL: "https://agents.redtec.ai/webhook",
});

const n8nHostingerInstance = axios.create({
    ...commonConfig,
    baseURL: "https://n8n.srv853599.hstgr.cloud/webhook",
});

// Función para configurar interceptores
const setupInterceptors = (instance) => {
    // Interceptor de solicitudes
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("garooToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Interceptor de respuestas
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                console.log("Token inválido detectado en interceptor");
                localStorage.removeItem("garooToken");

                // Solo redirigir si no estamos ya en login
                if (window.location.pathname !== "/login") {
                    console.log("Redirigiendo a login...");
                    window.location.href = "/login";
                }
            }
            return Promise.reject(error);
        }
    );
};

// Configuramos los interceptores para las instancias que necesitan autenticación
setupInterceptors(authInstance);
setupInterceptors(applicationsInstance);
setupInterceptors(redtecInstance);

// Exportamos las instancias configuradas
export { authInstance, applicationsInstance, redtecInstance, dataAgentInstance, n8nHostingerInstance };
