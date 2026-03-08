import { Input, SectionTitle } from "../fields/FormFields";
import styles from "./Phase5Form.module.css";

const CANALES = [
    { id: "whatsapp", label: "WhatsApp Business", icon: "💬", color: "#25D366" },
    { id: "instagram", label: "Instagram DM", icon: "📸", color: "#E1306C" },
    { id: "messenger", label: "Facebook Messenger", icon: "💙", color: "#0084FF" },
];

export default function Phase5Form({ data, onChange }) {
    const set = (k) => (v) => onChange({ ...data, [k]: v });

    const toggleCanal = (canal) => {
        const current = data.canales || [];
        const updated = current.includes(canal)
            ? current.filter(c => c !== canal)
            : [...current, canal];
        onChange({ ...data, canales: updated });
    };

    return (
        <div>
            <SectionTitle>Canales de atención</SectionTitle>
            <p className={styles.intro}>Selecciona los canales donde estará activo el agente</p>

            <div className={styles.canalList}>
                {CANALES.map(c => {
                    const active = (data.canales || []).includes(c.id);
                    return (
                        <button
                            key={c.id}
                            onClick={() => toggleCanal(c.id)}
                            className={styles.canalBtn}
                            style={{
                                background: active ? `${c.color}10` : "#0C0C10",
                                borderColor: active ? `${c.color}50` : "#1A1A22",
                            }}
                        >
                            <div
                                className={styles.canalCheck}
                                style={{ background: active ? c.color : "#1A1A22" }}
                            >
                                {active && "✓"}
                            </div>
                            <span className={styles.canalLabel} style={{ color: active ? "#E0E0D8" : "#666" }}>
                                {c.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {(data.canales || []).includes("whatsapp") && (
                <>
                    <SectionTitle>Credenciales de WhatsApp</SectionTitle>
                    <Input label="Phone Number ID" value={data.whatsapp_phone_id} onChange={set("whatsapp_phone_id")} placeholder="123456789012345" hint="En Meta Business Manager → WhatsApp → Configuración" />
                    <Input label="Access Token de WhatsApp" value={data.whatsapp_token} onChange={set("whatsapp_token")} placeholder="EAABs..." type="password" hint="Token permanente del sistema, no el temporal" />
                </>
            )}
            {(data.canales || []).includes("instagram") && (
                <>
                    <SectionTitle top>Credenciales de Instagram</SectionTitle>
                    <Input label="Access Token de Instagram" value={data.instagram_token} onChange={set("instagram_token")} placeholder="EAABs..." type="password" hint="Requiere cuenta de Instagram Business conectada a Meta" />
                </>
            )}
            {(data.canales || []).includes("messenger") && (
                <>
                    <SectionTitle top>Credenciales de Messenger</SectionTitle>
                    <Input label="Page Access Token de Facebook" value={data.messenger_token} onChange={set("messenger_token")} placeholder="EAABs..." type="password" hint="Token de la Página de Facebook en Meta Business Manager" />
                </>
            )}
        </div>
    );
}
