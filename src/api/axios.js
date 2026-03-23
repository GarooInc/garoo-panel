import axios from "axios";

// URLs Base (Hasta /webhook)
const REDTEC_BASE = "https://agentsprod.redtec.ai/webhook";
const DATA_AGENT_BASE = "https://agents.redtec.ai/webhook";
const N8N_HOSTINGER_BASE = "https://n8n.srv853599.hstgr.cloud/webhook";

// Configuración común para todas las instancias
const commonConfig = {
    baseURL:
        import.meta.env.VITE_API_URL || "https://garoo-server.onrender.com",
    timeout: 30000,
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
    baseURL: REDTEC_BASE,
});

const dataAgentInstance = axios.create({
    ...commonConfig,
    baseURL: DATA_AGENT_BASE,
});

const n8nHostingerInstance = axios.create({
    ...commonConfig,
    baseURL: N8N_HOSTINGER_BASE,
});

const portalesInstance = axios.create({
    ...commonConfig,
    baseURL: "https://parqueportales.com.gt",
});

// Función para configurar interceptores
const setupInterceptors = (instance) => {
    // Interceptor de solicitudes
    instance.interceptors.request.use(
        async (config) => {
            const token = localStorage.getItem("garooToken");
            
            // Si tiene token y NO es una ruta pública ni la propia verificación, verificamos sesión antes
            // La excepción de Ficohsa se manejará pasando { isPublic: true } en la petición
            const isAuthVerify = config.url === "auth-verify" || config.url?.endsWith("/auth-verify");
            
            if (token && !config.isPublic && !isAuthVerify) {
                try {
                    // Llamada directa con axios para evitar interceptores de esta instancia (recursión)
                    await axios.post(`${REDTEC_BASE}/auth-verify`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch (error) {
                    // Si falla la verificación, el flujo caerá en el interceptor de respuesta con 401
                    console.warn("Pre-flight auth check failed:", error.message);
                }
            }

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
                if (window.location.pathname !== "/login" && !window.location.pathname.includes("/outbound-call-form")) {
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
setupInterceptors(dataAgentInstance);
setupInterceptors(n8nHostingerInstance);
setupInterceptors(portalesInstance);

// Exportamos las instancias configuradas
export { authInstance, applicationsInstance, redtecInstance, dataAgentInstance, n8nHostingerInstance, portalesInstance };
