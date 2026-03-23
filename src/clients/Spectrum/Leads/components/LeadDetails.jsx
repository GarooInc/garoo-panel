import React, { useState, useEffect } from "react";
import { redtecInstance } from "../../../../api/axios";
import {
    Avatar,
    ModalSection,
    ModalChip,
    ModalField,
    ChatHistory,
} from "./LeadModalComponents";
import { getEmotionStyle, getChannelInfo } from "../utils/leadHelpers";
import { formatFullDate } from "../../../../utils/dateHelpers";

/**
 * Lead Details View (Premium Light Dashboard)
 */
const LeadDetails = ({ lead, onBack }) => {
    const [isCalling, setIsCalling] = useState(false);
    const [actionResult, setActionResult] = useState(null);

    const handleAction = async () => {
        if (!lead?.user_id && !lead?.id) return;
        setIsCalling(true);
        setActionResult(null);
        try {
            const response = await redtecInstance.post("lead-chat", {
                user_id: lead.user_id || lead.id,
            });
            setActionResult(response.data);
        } catch (err) {
            console.error("Error fetching chat:", err);
            setActionResult({ error: err.message });
        } finally {
            setIsCalling(false);
        }
    };

    useEffect(() => {
        if (lead) handleAction();
    }, [lead?.id, lead?.user_id]);

    if (!lead) return null;

    const em = getEmotionStyle(lead.emocion_detectada);
    const ch = getChannelInfo(lead.input_channel);
    const name = lead.name || lead.whatsapp_name || "Sin nombre";

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1500,
            background: "#f8fafc",
            color: "#1e293b",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header */}
            <header style={{
                height: "70px",
                padding: "0 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "white",
                borderBottom: "1px solid #e2e8f0",
                zIndex: 10,
                flexShrink: 0
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            color: "#64748b",
                            padding: "8px 14px",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            transition: "all 0.2s"
                        }}
                    >
                        <i className="bi bi-arrow-left" style={{ fontSize: "0.9rem" }} />
                        LISTADO
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", paddingLeft: "1.5rem", borderLeft: "1px solid #e2e8f0" }}>
                        <Avatar name={name} size={40} />
                        <div>
                            <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a" }}>{name}</h2>
                            <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>ID: {lead.user_id || lead.id}</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                        padding: "6px 12px",
                        borderRadius: "100px",
                        fontSize: "0.6rem",
                        fontWeight: 900,
                        background: lead.has_reservation ? "rgba(34, 197, 94, 0.1)" : "#f1f5f9",
                        border: `1px solid ${lead.has_reservation ? "rgba(34, 197, 94, 0.2)" : "#e2e8f0"}`,
                        color: lead.has_reservation ? "#16a34a" : "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        letterSpacing: "0.05em"
                    }}>
                        <i className={`bi ${lead.has_reservation ? "bi-check-circle-fill" : "bi-dash-circle"}`} />
                        {lead.has_reservation ? "RESERVA ACTIVA" : "SIN RESERVA"}
                    </div>
                </div>
            </header>

            {/* Layout */}
            <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                {/* Sidebar */}
                <aside 
                    className="sl-custom-scroll"
                    style={{
                        width: "350px",
                        background: "white",
                        borderRight: "1px solid #e2e8f0",
                        padding: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.75rem",
                        overflowY: "auto",
                        flexShrink: 0
                    }}
                >
                    <ModalSection label="Contexto Inteligente" light>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                            <ModalChip label="Canal" value={lead.input_channel || "—"} icon={ch.icon} color="#334155" bg="#f8fafc" border="#e2e8f0" light />
                            <ModalChip label="Emoción" value={lead.emocion_detectada || "Neutral"} icon="bi-heart-pulse" color={em.text || "#334155"} bg={em.bg || "#f8fafc"} border={em.border || "#e2e8f0"} light />
                            <ModalChip label="Palabra Clave" value={lead.palabra_clave || "—"} icon="bi-lightning-charge" color="#b45309" bg="#fff9eb" border="#fef3c7" light />
                            <ModalChip label="Alias" value={lead.whatsapp_name || "—"} icon="bi-person-badge" color="#15803d" bg="#f0fdf4" border="#dcfce7" light />
                        </div>
                    </ModalSection>

                    <ModalSection label="Datos de Contacto" light>
                        <ModalField icon="bi-telephone-fill" label="WhatsApp / Tel" value={lead.phone} light />
                        <ModalField icon="bi-envelope-at-fill" label="Correo Electrónico" value={lead.email} light />
                    </ModalSection>

                    <ModalSection label="Cronología" light>
                        <ModalField icon="bi-clock-history" label="Primer Contacto" value={formatFullDate(lead.first_interaction)} light />
                        <ModalField icon="bi-activity" label="Última Actualización" value={formatFullDate(lead.last_interaction)} light />
                    </ModalSection>

                    {lead.resumen_breve && (
                        <ModalSection label="Análisis de Sofía IA" light style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                            <div style={{
                                padding: "1.25rem",
                                borderRadius: "16px",
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                color: "#475569",
                                fontSize: "0.85rem",
                                lineHeight: "1.7",
                                fontStyle: "italic"
                            }}>
                                <i className="bi bi-quote" style={{ fontSize: "1.5rem", color: "#8b5cf6", display: "block", marginBottom: "0.5rem", opacity: 0.3 }} />
                                {lead.resumen_breve}
                            </div>
                        </ModalSection>
                    )}
                </aside>

                {/* Chat */}
                <section 
                    className="sl-custom-scroll"
                    style={{
                        flex: 1,
                        background: "#f1f5f9",
                        padding: "2rem",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <div style={{ width: "100%", maxWidth: "800px" }}>
                        {isCalling ? (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px", gap: "1.5rem" }}>
                                <div className="sl-spinner" style={{ width: "32px", height: "32px", border: "3px solid #e2e8f0", borderTopColor: "#8b5cf6" }} />
                                <span style={{ fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em", fontSize: "0.7rem" }}>SINCRONIZANDO HISTORIAL</span>
                            </div>
                        ) : actionResult?.chat ? (
                            <ChatHistory chatData={actionResult} light />
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "400px", opacity: 0.3 }}>
                                <i className="bi bi-chat-square-dots" style={{ fontSize: "3rem", marginBottom: "1rem" }} />
                                <span style={{ fontWeight: 800, letterSpacing: "0.1em", fontSize: "0.7rem" }}>SIN MENSAJES DISPONIBLES</span>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LeadDetails;
