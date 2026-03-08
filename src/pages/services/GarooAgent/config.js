// ─── WEBHOOK CONFIG ───────────────────────────────────────────────────────────
export const WEBHOOK_BASE = "https://tu-n8n.com/webhook"; // reemplazar

export const WEBHOOKS = {
    phase1: `${WEBHOOK_BASE}/agent-negocio`,
    phase2: `${WEBHOOK_BASE}/agent-conocimiento`,
    phase3: `${WEBHOOK_BASE}/agent-comportamiento`,
    phase4: `${WEBHOOK_BASE}/agent-integraciones`,
    phase5: `${WEBHOOK_BASE}/agent-canal`,
    final: `${WEBHOOK_BASE}/agent-final`,
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const generateClientId = () =>
    `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const sendWebhook = async (url, payload) => {
    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            mode: "no-cors",
            body: JSON.stringify(payload),
        });
        return true;
    } catch {
        return false;
    }
};

export const buildFinalPayload = (clientId, allData) => ({
    event: "agent_onboarding_complete",
    client_id: clientId,
    submitted_at: new Date().toISOString(),
    version: "1.0",
    phases: {
        fase_1_negocio: allData.phase1 || {},
        fase_2_conocimiento: allData.phase2 || {},
        fase_3_comportamiento: allData.phase3 || {},
        fase_4_integraciones: allData.phase4 || {},
        fase_5_canal: allData.phase5 || {},
    },
});

// ─── INITIAL STATE ────────────────────────────────────────────────────────────
export const initialData = {
    phase1: {
        nombre_negocio: "", rubro: "", descripcion: "", sitio_web: "",
        nombre_agente: "", tono: "amigable", idioma: "es",
    },
    phase2: {
        faqs: [{ pregunta: "", respuesta: "" }],
        productos: [{ nombre: "", descripcion: "", precio: "" }],
        politicas: { devoluciones: "", envios: "", horarios: "", garantias: "" },
        documentos_urls: "",
    },
    phase3: {
        mensaje_bienvenida: "", mensaje_fallback: "", mensaje_cierre: "",
        escalamiento_triggers: "",
        escalamiento_canal: "whatsapp",
        mensaje_handoff: "",
        temas_prohibidos: "",
        informacion_restringida: "",
    },
    phase4: {
        tiene_crm: "no", crm_tipo: "", crm_api_key: "",
        tiene_calendario: "no", calendario_sistema: "", calendario_api_key: "",
        tiene_ecommerce: "no", ecommerce_plataforma: "", ecommerce_api_key: "",
    },
    phase5: {
        canales: [],
        whatsapp_phone_id: "", whatsapp_token: "",
        instagram_token: "",
        messenger_token: "",
    },
};

// ─── PHASE DEFINITIONS ────────────────────────────────────────────────────────
export const PHASES = [
    {
        id: 1, key: "phase1", label: "Negocio", num: "01", icon: "◈", color: "#F0E040", webhook: "phase1",
        desc: "Cuéntanos sobre tu negocio y cómo debe presentarse el agente."
    },
    {
        id: 2, key: "phase2", label: "Conocimiento", num: "02", icon: "◉", color: "#40C8F0", webhook: "phase2",
        desc: "Agrega la información que el agente usará para responder."
    },
    {
        id: 3, key: "phase3", label: "Comportamiento", num: "03", icon: "◈", color: "#F07840", webhook: "phase3",
        desc: "Define cómo se comporta el agente en distintas situaciones."
    },
    {
        id: 4, key: "phase4", label: "Integraciones", num: "04", icon: "◎", color: "#C040F0", webhook: "phase4",
        desc: "Conecta tus sistemas externos si los necesitas."
    },
    {
        id: 5, key: "phase5", label: "Canal", num: "05", icon: "◉", color: "#40F0A0", webhook: "phase5",
        desc: "Elige los canales donde el agente estará activo."
    },
];
