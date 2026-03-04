import React, { useState, useEffect } from "react";
import {
    Avatar,
    ModalSection,
    ModalChip,
    ModalField,
    ChatHistory,
} from "./LeadModalComponents";
import { getEmotionStyle, getChannelInfo } from "../utils/leadHelpers";
import { formatFullDate } from "../utils/dateHelpers";

/**
 * Lead Modal (centered)
 * @param {Object} props - Component props
 * @param {Object} props.lead - Lead data
 * @param {Function} props.onClose - Close handler
 */
const LeadModal = ({ lead, onClose }) => {
    const [isCalling, setIsCalling] = useState(false);
    const [actionResult, setActionResult] = useState(null);

    const handleAction = async () => {
        if (!lead?.user_id && !lead?.id) return;
        setIsCalling(true);
        setActionResult(null);
        try {
            const response = await fetch(
                "https://agentsprod.redtec.ai/webhook/lead-chat",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_id: lead.user_id || lead.id }),
                },
            );
            const data = await response.json();
            setActionResult(data);
        } catch (err) {
            console.error("Error fetching chat:", err);
            setActionResult({ error: err.message });
        } finally {
            setIsCalling(false);
        }
    };

    useEffect(() => {
        if (lead) handleAction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lead?.id, lead?.user_id]);

    if (!lead) return null;

    const em = getEmotionStyle(lead.emocion_detectada);
    const ch = getChannelInfo(lead.input_channel);
    const name = lead.name || lead.whatsapp_name || "Sin nombre";

    // Close on Escape
    const handleKey = (evt) => {
        if (evt.key === "Escape") onClose();
    };

    const selfFocus = (el) => {
        if (el) el.focus();
    };

    return (
        <div
            tabIndex={-1}
            ref={selfFocus}
            onKeyDown={handleKey}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                outline: "none",
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,.65)",
                    backdropFilter: "blur(6px)",
                }}
            />

            {/* Modal box */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    width: "min(1250px, 97vw)",
                    maxHeight: "92vh",
                    background:
                        "linear-gradient(160deg,#0d1628 0%,#080f1e 100%)",
                    border: "1px solid rgba(139,92,246,.2)",
                    borderRadius: "24px",
                    boxShadow:
                        "0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(139,92,246,.08)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {/* ── Header ── */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.25rem",
                        padding: "1.5rem 1.75rem",
                        borderBottom: "1px solid rgba(255,255,255,.05)",
                        background: "rgba(139,92,246,.04)",
                        flexShrink: 0,
                    }}
                >
                    <Avatar name={name} size={46} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "1.35rem",
                                fontWeight: 900,
                                color: "#f8fafc",
                                letterSpacing: "-.03em",
                            }}
                        >
                            {name}
                        </h2>
                    </div>
                    {/* Reserva badge */}
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: ".35rem",
                            padding: "4px 12px",
                            borderRadius: "100px",
                            fontSize: ".7rem",
                            fontWeight: 700,
                            background: lead.has_reservation
                                ? "rgba(16,185,129,.12)"
                                : "rgba(100,116,139,.1)",
                            border: `1px solid ${lead.has_reservation ? "rgba(16,185,129,.3)" : "rgba(100,116,139,.2)"}`,
                            color: lead.has_reservation ? "#34d399" : "#64748b",
                        }}
                    >
                        <i
                            className={`bi ${lead.has_reservation ? "bi-calendar-check" : "bi-calendar-x"}`}
                        />
                        {lead.has_reservation ? "Con reserva" : "Sin reserva"}
                    </span>
                    <div style={{ marginLeft: "auto" }} />
                    <button
                        onClick={onClose}
                        style={{
                            background: "rgba(255,255,255,.06)",
                            border: "1px solid rgba(255,255,255,.1)",
                            borderRadius: "8px",
                            color: "#94a3b8",
                            cursor: "pointer",
                            width: 34,
                            height: 34,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: ".9rem",
                            flexShrink: 0,
                            marginLeft: ".5rem",
                        }}
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                {/* ── Body (scrollable) ── */}
                <div
                    className="sl-custom-scroll"
                    style={{ flex: 1, overflowY: "auto", padding: "1.75rem" }}
                >
                    {/* Action Result Info */}
                    {actionResult && actionResult.error && (
                        <div
                            style={{
                                marginBottom: "1.5rem",
                                padding: "1rem 1.25rem",
                                borderRadius: "14px",
                                background: "rgba(239,68,68,.08)",
                                border: "1px solid rgba(239,68,68,.15)",
                                color: "#fca5a5",
                                fontSize: ".82rem",
                                display: "flex",
                                alignItems: "center",
                                gap: ".75rem",
                                animation: "sl-fade-in .3s ease-out",
                            }}
                        >
                            <i className="bi bi-exclamation-triangle-fill" />
                            <span style={{ fontWeight: 500 }}>
                                Error al sincronizar: {actionResult.error}
                            </span>
                            <button
                                onClick={() => setActionResult(null)}
                                style={{
                                    marginLeft: "auto",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "none",
                                    color: "inherit",
                                    borderRadius: "4px",
                                    padding: "2px 6px",
                                    cursor: "pointer",
                                }}
                            >
                                <i
                                    className="bi bi-x-lg"
                                    style={{ fontSize: "0.7rem" }}
                                />
                            </button>
                        </div>
                    )}

                    <div
                        className="sl-modal-grid"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "350px 1fr",
                            gap: "0",
                            alignItems: "stretch",
                            height: "100%",
                            minHeight: 0,
                        }}
                    >
                        {/* LEFT column: All Data & Summaries */}
                        <div
                            className="sl-custom-scroll"
                            style={{
                                padding: "1.75rem",
                                borderRight: "1px solid rgba(255,255,255,0.05)",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                                overflowY: "auto",
                            }}
                        >
                            <ModalSection label="Clasificación">
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: ".5rem",
                                        marginBottom: ".5rem",
                                    }}
                                >
                                    <ModalChip
                                        label="Canal"
                                        value={lead.input_channel || "—"}
                                        icon={ch.icon}
                                        color={ch.color}
                                    />
                                    <ModalChip
                                        label="Emoción"
                                        value={lead.emocion_detectada || "—"}
                                        icon="bi-emoji-smile"
                                        color={em.text}
                                        bg={em.bg}
                                        border={em.border}
                                    />
                                    <ModalChip
                                        label="Palabra clave"
                                        value={lead.palabra_clave || "—"}
                                        icon="bi-key"
                                        color="#c4b5fd"
                                        bg="rgba(139,92,246,.08)"
                                        border="rgba(139,92,246,.2)"
                                    />
                                    <ModalChip
                                        label="WhatsApp"
                                        value={lead.whatsapp_name || "—"}
                                        icon="bi-whatsapp"
                                        color="#25d366"
                                    />
                                </div>
                            </ModalSection>

                            <ModalSection label="Contacto">
                                <ModalField
                                    icon="bi-person"
                                    label="Nombre"
                                    value={lead.name}
                                />
                                <ModalField
                                    icon="bi-phone"
                                    label="Teléfono"
                                    value={lead.phone}
                                />
                                <ModalField
                                    icon="bi-envelope"
                                    label="Email"
                                    value={lead.email}
                                />
                            </ModalSection>

                            <ModalSection label="Interacciones">
                                <ModalField
                                    icon="bi-clock-history"
                                    label="Primera"
                                    value={formatFullDate(
                                        lead.first_interaction,
                                    )}
                                />
                                <ModalField
                                    icon="bi-clock"
                                    label="Última"
                                    value={formatFullDate(
                                        lead.last_interaction,
                                    )}
                                />
                            </ModalSection>

                            {(lead.last_message ||
                                lead.last_agent_message ||
                                lead.resumen_breve) && (
                                <ModalSection label="Resúmenes Rápidos">
                                    {lead.last_message && (
                                        <div style={{ marginBottom: "1rem" }}>
                                            <p
                                                style={{
                                                    margin: "0 0 4px",
                                                    fontSize: "0.55rem",
                                                    fontWeight: 800,
                                                    color: "#475569",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                Último Lead
                                            </p>
                                            <div
                                                style={{
                                                    background:
                                                        "rgba(255,255,255,.03)",
                                                    border: "1px solid rgba(255,255,255,.07)",
                                                    borderRadius: "10px",
                                                    padding: "0.75rem",
                                                    color: "#cbd5e1",
                                                    fontSize: "0.78rem",
                                                }}
                                            >
                                                {lead.last_message}
                                            </div>
                                        </div>
                                    )}
                                    {lead.last_agent_message && (
                                        <div style={{ marginBottom: "1rem" }}>
                                            <p
                                                style={{
                                                    margin: "0 0 4px",
                                                    fontSize: "0.55rem",
                                                    fontWeight: 800,
                                                    color: "#8b5cf6",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                Última IA
                                            </p>
                                            <div
                                                style={{
                                                    background:
                                                        "rgba(139,92,246,.07)",
                                                    border: "1px solid rgba(139,92,246,.2)",
                                                    borderRadius: "10px",
                                                    padding: "0.75rem",
                                                    color: "#c4b5fd",
                                                    fontSize: "0.78rem",
                                                }}
                                            >
                                                {lead.last_agent_message}
                                            </div>
                                        </div>
                                    )}
                                    {lead.resumen_breve && (
                                        <div>
                                            <p
                                                style={{
                                                    margin: "0 0 4px",
                                                    fontSize: "0.55rem",
                                                    fontWeight: 800,
                                                    color: "#64748b",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                Contexto IA
                                            </p>
                                            <div
                                                style={{
                                                    background:
                                                        "rgba(255,255,255,.03)",
                                                    border: "1px solid rgba(255,255,255,.07)",
                                                    borderRadius: "10px",
                                                    padding: "0.75rem",
                                                    color: "#94a3b8",
                                                    fontSize: "0.78rem",
                                                }}
                                            >
                                                {lead.resumen_breve}
                                            </div>
                                        </div>
                                    )}
                                </ModalSection>
                            )}
                        </div>

                        {/* RIGHT column: Extended Chat History */}
                        <div
                            className="sl-custom-scroll"
                            style={{
                                padding: "1.75rem",
                                overflowY: "auto",
                                background: "rgba(0,0,0,0.08)",
                            }}
                        >
                            {isCalling && (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: "4rem 2rem",
                                    }}
                                >
                                    <div
                                        className="sl-spinner"
                                        style={{
                                            margin: "0 auto 1.25rem",
                                            width: "28px",
                                            height: "28px",
                                            borderWidth: "2px",
                                        }}
                                    />
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: ".85rem",
                                            color: "#475569",
                                        }}
                                    >
                                        Sincronizando conversación...
                                    </p>
                                </div>
                            )}
                            {!isCalling &&
                                actionResult &&
                                actionResult.chat && (
                                    <ChatHistory chatData={actionResult} />
                                )}
                            {!isCalling &&
                                (!actionResult || !actionResult.chat) && (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            padding: "6rem 2rem",
                                            color: "#475569",
                                        }}
                                    >
                                        <i
                                            className="bi bi-chat-left-dots"
                                            style={{
                                                fontSize: "2.5rem",
                                                opacity: 0.15,
                                                display: "block",
                                                marginBottom: "1rem",
                                            }}
                                        />
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: "0.9rem",
                                                fontStyle: "italic",
                                                opacity: 0.5,
                                            }}
                                        >
                                            No hay historial extendido
                                            disponible.
                                        </p>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadModal;
