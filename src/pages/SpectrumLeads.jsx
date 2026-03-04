import { useState, useEffect, useMemo } from "react";
import garooLogo from "../assets/img/garoo-logo.png";

const WEBHOOK_URL = "/spectrum-proxy/webhook/leads";

const EMOTION_COLORS = {
    POSITIVO: {
        bg: "rgba(16,185,129,.15)",
        border: "rgba(16,185,129,.3)",
        text: "#34d399",
    },
    NEGATIVO: {
        bg: "rgba(239,68,68,.12)",
        border: "rgba(239,68,68,.3)",
        text: "#f87171",
    },
    NEUTRO: {
        bg: "rgba(148,163,184,.1)",
        border: "rgba(148,163,184,.25)",
        text: "#94a3b8",
    },
    URGENTE: {
        bg: "rgba(245,158,11,.12)",
        border: "rgba(245,158,11,.3)",
        text: "#fbbf24",
    },
};

const CHANNEL_ICONS = {
    WhatsApp: { icon: "bi-whatsapp", color: "#25d366" },
    Telegram: { icon: "bi-telegram", color: "#2aabee" },
    Email: { icon: "bi-envelope", color: "#a78bfa" },
    Web: { icon: "bi-globe", color: "#60a5fa" },
};

function getEmotionStyle(e) {
    return EMOTION_COLORS[e?.toUpperCase()] || EMOTION_COLORS.NEUTRO;
}

function getChannelInfo(ch) {
    return CHANNEL_ICONS[ch] || { icon: "bi-chat-dots", color: "#a78bfa" };
}

function formatDate(iso) {
    if (!iso) return "—";
    try {
        return new Intl.DateTimeFormat("es-GT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}

function Avatar({ name, size = 36 }) {
    const letter = name ? name.trim()[0].toUpperCase() : "?";
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                flexShrink: 0,
                background:
                    "linear-gradient(135deg,rgba(139,92,246,.3),rgba(167,139,250,.2))",
                border: `${size * 0.04}px solid rgba(139,92,246,.35)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: `${size * 0.4}px`,
                fontWeight: 700,
                color: "#c4b5fd",
            }}
        >
            {letter}
        </div>
    );
}

/* ─────────────────────────────────────────────────
   Modal helper components (module-level, not inside render)
───────────────────────────────────────────────── */
function ModalSection({ label, children }) {
    return (
        <div style={{ marginBottom: "1.75rem" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.8rem",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: ".68rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: ".1em",
                        color: "#64748b",
                        whiteSpace: "nowrap",
                    }}
                >
                    {label}
                </p>
                <div
                    style={{
                        flex: 1,
                        height: "1px",
                        background: "rgba(255,255,255,0.05)",
                    }}
                />
            </div>
            {children}
        </div>
    );
}

function ModalField({ icon, label, value, color }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: ".6rem",
                marginBottom: ".5rem",
            }}
        >
            <i
                className={`bi ${icon}`}
                style={{
                    color: color || "#8b5cf6",
                    fontSize: ".85rem",
                    marginTop: "2px",
                    flexShrink: 0,
                    width: "14px",
                }}
            />
            <div style={{ minWidth: 0 }}>
                <span
                    style={{
                        fontSize: ".65rem",
                        color: "#475569",
                        display: "block",
                    }}
                >
                    {label}
                </span>
                <span
                    style={{
                        fontSize: ".84rem",
                        color: "#e2e8f0",
                        fontWeight: 500,
                        wordBreak: "break-word",
                    }}
                >
                    {value || "—"}
                </span>
            </div>
        </div>
    );
}

function ModalChip({ label, value, icon, color, bg, border }) {
    return (
        <div
            style={{
                background: bg || "rgba(255,255,255,.04)",
                border: `1px solid ${border || "rgba(255,255,255,.08)"}`,
                borderRadius: "10px",
                padding: ".65rem .8rem",
            }}
        >
            <p
                style={{
                    margin: "0 0 3px",
                    fontSize: ".58rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    color: "#475569",
                }}
            >
                {label}
            </p>
            <p
                style={{
                    margin: 0,
                    fontWeight: 700,
                    color: color || "#e2e8f0",
                    fontSize: ".82rem",
                    display: "flex",
                    alignItems: "center",
                    gap: ".3rem",
                }}
            >
                {icon && (
                    <i
                        className={`bi ${icon}`}
                        style={{ fontSize: ".75rem" }}
                    />
                )}
                {value}
            </p>
        </div>
    );
}

function ChatBubble({ type, content }) {
    const isAi = type === "ai";

    let text = content;
    if (isAi) {
        try {
            const parsed = JSON.parse(content);
            text = parsed.response || content;
        } catch {
            text = content;
        }
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: isAi ? "flex-start" : "flex-end",
                marginBottom: "0.75rem",
                width: "100%",
            }}
        >
            <div
                style={{
                    maxWidth: "85%",
                    padding: "0.75rem 1rem",
                    borderRadius: isAi
                        ? "16px 16px 16px 4px"
                        : "16px 16px 4px 16px",
                    background: isAi
                        ? "rgba(139,92,246,0.12)"
                        : "rgba(30,41,59,0.7)",
                    border: isAi
                        ? "1px solid rgba(139,92,246,0.2)"
                        : "1px solid rgba(255,255,255,0.08)",
                    color: isAi ? "#c4b5fd" : "#f1f5f9",
                    fontSize: "0.86rem",
                    lineHeight: 1.5,
                }}
            >
                {isAi && (
                    <div
                        style={{
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            color: "#8b5cf6",
                            marginBottom: "0.25rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                        }}
                    >
                        <i className="bi bi-robot" /> AGENTE SOFÍA
                    </div>
                )}
                {!isAi && (
                    <div
                        style={{
                            fontSize: "0.6rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            color: "#94a3b8",
                            marginBottom: "0.25rem",
                            textAlign: "right",
                        }}
                    >
                        LEAD
                    </div>
                )}
                <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>
            </div>
        </div>
    );
}

function ChatHistory({ chatData }) {
    if (!chatData) return null;

    const part1 = chatData.chat?.["1ra_parte"] || [];
    const part2 = chatData.chat?.["2da_parte"] || [];
    const allMessages = [...part1, ...part2];

    if (allMessages.length === 0)
        return (
            <div
                style={{
                    padding: "2.5rem",
                    textAlign: "center",
                    color: "#475569",
                    fontSize: "0.9rem",
                    background: "rgba(0,0,0,0.1)",
                    borderRadius: "16px",
                    border: "1px dashed rgba(255,255,255,0.05)",
                }}
            >
                <i
                    className="bi bi-chat-dots"
                    style={{
                        fontSize: "1.5rem",
                        display: "block",
                        marginBottom: "0.5rem",
                        opacity: 0.3,
                    }}
                />
                No se encontraron mensajes en el historial.
            </div>
        );

    return (
        <ModalSection label="Diálogo Completo">
            <div
                className="sl-custom-scroll"
                style={{
                    background: "rgba(0,0,0,0.15)",
                    borderRadius: "20px",
                    padding: "1.5rem",
                    border: "1px solid rgba(255,255,255,0.03)",
                    maxHeight: "500px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {part1.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            margin: "0.5rem 0 1.5rem",
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                height: "1px",
                                background:
                                    "linear-gradient(to right, transparent, rgba(139,92,246,0.1))",
                            }}
                        />
                        <span
                            style={{
                                fontSize: "0.55rem",
                                fontWeight: 800,
                                color: "#475569",
                                letterSpacing: "0.15em",
                            }}
                        >
                            INICIO DE SESIÓN
                        </span>
                        <div
                            style={{
                                flex: 1,
                                height: "1px",
                                background:
                                    "linear-gradient(to left, transparent, rgba(139,92,246,0.1))",
                            }}
                        />
                    </div>
                )}
                {part1.map((msg, idx) => (
                    <ChatBubble
                        key={`p1-${idx}`}
                        type={msg.type}
                        content={msg.data?.content}
                    />
                ))}

                {part2.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            margin: "2rem 0 1.5rem",
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                height: "1px",
                                background:
                                    "linear-gradient(to right, transparent, rgba(52,211,153,0.1))",
                            }}
                        />
                        <span
                            style={{
                                fontSize: "0.55rem",
                                fontWeight: 800,
                                color: "#475569",
                                letterSpacing: "0.15em",
                            }}
                        >
                            CONTINUACIÓN
                        </span>
                        <div
                            style={{
                                flex: 1,
                                height: "1px",
                                background:
                                    "linear-gradient(to left, transparent, rgba(52,211,153,0.1))",
                            }}
                        />
                    </div>
                )}
                {part2.map((msg, idx) => (
                    <ChatBubble
                        key={`p2-${idx}`}
                        type={msg.type}
                        content={msg.data?.content}
                    />
                ))}
            </div>
        </ModalSection>
    );
}

/* ─────────────────────────────────────────────────
   Lead Modal (centered)
───────────────────────────────────────────────── */
function LeadModal({ lead, onClose }) {
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
    const ref = (el) => {
        if (el) el.focus();
    };

    return (
        <div
            tabIndex={-1}
            ref={ref}
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
                                    value={formatDate(lead.first_interaction)}
                                />
                                <ModalField
                                    icon="bi-clock"
                                    label="Última"
                                    value={formatDate(lead.last_interaction)}
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
}

/* ─────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────── */
export default function SpectrumLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [channelFilter, setChannelFilter] = useState("Todos");
    const [emotionFilter, setEmotionFilter] = useState("Todas");
    const [reservFilter, setReservFilter] = useState("Todos");

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(WEBHOOK_URL, {
                    method: "GET",
                    signal: controller.signal,
                });

                const text = await res.text();

                // Respuesta vacía → sin leads aún
                if (!text || text.trim() === "") {
                    setLeads([]);
                    return;
                }

                let json;
                try {
                    json = JSON.parse(text);
                } catch {
                    throw new Error(
                        `Respuesta inesperada del webhook: ${text.slice(0, 120)}`,
                    );
                }

                if (!res.ok) {
                    throw new Error(
                        `Error ${res.status}: ${json?.message || res.statusText}`,
                    );
                }

                // n8n puede responder array directo o { status, leads: [...] }
                if (Array.isArray(json)) {
                    setLeads(json);
                } else if (Array.isArray(json.leads)) {
                    setLeads(json.leads);
                } else if (json && typeof json === "object") {
                    // Objeto sin leads conocido — mostrar vacío sin error
                    console.warn("Respuesta del webhook:", json);
                    setLeads([]);
                } else {
                    setLeads([]);
                }
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, []);

    const channels = useMemo(() => {
        const set = new Set(leads.map((l) => l.input_channel).filter(Boolean));
        return ["Todos", ...set];
    }, [leads]);

    const emotions = useMemo(() => {
        const set = new Set(
            leads.map((l) => l.emocion_detectada).filter(Boolean),
        );
        return ["Todas", ...set];
    }, [leads]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return leads.filter((l) => {
            const matchSearch =
                !q ||
                (l.name || "").toLowerCase().includes(q) ||
                (l.whatsapp_name || "").toLowerCase().includes(q) ||
                (l.email || "").toLowerCase().includes(q) ||
                (l.phone || "").toLowerCase().includes(q) ||
                (l.last_message || "").toLowerCase().includes(q);

            const matchChannel =
                channelFilter === "Todos" || l.input_channel === channelFilter;
            const matchEmotion =
                emotionFilter === "Todas" ||
                l.emocion_detectada === emotionFilter;
            const matchReserv =
                reservFilter === "Todos" ||
                (reservFilter === "Sí" && l.has_reservation) ||
                (reservFilter === "No" && !l.has_reservation);

            return matchSearch && matchChannel && matchEmotion && matchReserv;
        });
    }, [leads, search, channelFilter, emotionFilter, reservFilter]);

    const withReservation = leads.filter((l) => l.has_reservation).length;

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .sl-root {
                    min-height: 100vh; height: 100vh;
                    display: flex; flex-direction: column;
                    background: #07101f;
                    font-family: 'Inter', system-ui, sans-serif;
                    overflow: hidden; position: relative;
                    color: #e2e8f0;
                }

                .sl-glow-1 {
                    position: fixed; pointer-events: none;
                    top: -100px; right: -100px;
                    width: 560px; height: 560px;
                    background: radial-gradient(circle, rgba(139,92,246,.12) 0%, transparent 68%);
                    filter: blur(70px);
                }
                .sl-glow-2 {
                    position: fixed; pointer-events: none;
                    bottom: -150px; left: -80px;
                    width: 480px; height: 480px;
                    background: radial-gradient(circle, rgba(167,139,250,.07) 0%, transparent 68%);
                    filter: blur(80px);
                }

                /* Topbar */
                .sl-topbar {
                    flex-shrink: 0;
                    display: flex; align-items: center; gap: 1rem;
                    padding: 0 2rem; height: 62px;
                    background: rgba(7,16,31,.9);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255,255,255,.07);
                    position: relative; z-index: 20;
                }

                .sl-logo {
                    width: 34px; height: 34px; border-radius: 50%; object-fit: cover;
                    border: 1.5px solid rgba(139,92,246,.4);
                    box-shadow: 0 0 14px rgba(139,92,246,.2);
                    flex-shrink: 0;
                }

                .sl-title {
                    font-size: 1.35rem; font-weight: 800;
                    color: #f1f5f9; letter-spacing: -.03em; line-height: 1;
                }

                .sl-divider { width: 1px; height: 20px; background: rgba(255,255,255,.1); }
                .sl-spacer  { flex: 1; }

                .sl-badge {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 4px 12px; border-radius: 100px;
                    font-size: .68rem; font-weight: 700;
                    letter-spacing: .07em; text-transform: uppercase;
                    background: rgba(139,92,246,.13);
                    border: 1px solid rgba(139,92,246,.3);
                    color: #c4b5fd;
                }
                .sl-badge::before {
                    content: '';
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #8b5cf6;
                    box-shadow: 0 0 6px #8b5cf6;
                    animation: sl-blink 2s ease-in-out infinite;
                }
                @keyframes sl-blink {
                    0%,100%{ opacity:1; transform:scale(1); }
                    50%    { opacity:.4; transform:scale(.7); }
                }

                /* Stats chip */
                .sl-stats {
                    display: flex; align-items: center; gap: 1.1rem;
                    background: rgba(255,255,255,.03);
                    border: 1px solid rgba(255,255,255,.07);
                    border-radius: 12px; padding: .4rem 1.1rem;
                }
                .sl-stat { display: flex; flex-direction: column; align-items: center; }
                .sl-stat-n { font-size: 1rem; font-weight: 800; color: #f1f5f9; line-height: 1; }
                .sl-stat-l { font-size: .58rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .06em; margin-top: 2px; }
                .sl-stat-sep { width: 1px; height: 24px; background: rgba(255,255,255,.08); }

                /* Body */
                .sl-body {
                    flex: 1; min-height: 0;
                    display: flex; flex-direction: column;
                    padding: 1.5rem 2rem;
                    overflow: hidden; position: relative; z-index: 1;
                    gap: 1rem;
                }

                /* Filter bar */
                .sl-filterbar {
                    display: flex; align-items: center; gap: .75rem; flex-wrap: wrap;
                    flex-shrink: 0;
                }

                .sl-search-wrap {
                    position: relative; flex: 1; min-width: 200px; max-width: 360px;
                }

                .sl-search-wrap i {
                    position: absolute; left: .75rem; top: 50%; transform: translateY(-50%);
                    color: #475569; font-size: .88rem; pointer-events: none;
                }

                .sl-search {
                    width: 100%; padding: .5rem .75rem .5rem 2.25rem;
                    background: rgba(255,255,255,.05);
                    border: 1px solid rgba(255,255,255,.1);
                    border-radius: 10px;
                    color: #f1f5f9; font-size: .83rem; font-family: inherit;
                    outline: none; transition: border-color .15s, background .15s;
                }
                .sl-search::placeholder { color: #334155; }
                .sl-search:focus {
                    border-color: rgba(139,92,246,.45);
                    background: rgba(139,92,246,.05);
                    box-shadow: 0 0 0 3px rgba(139,92,246,.1);
                }

                .sl-select {
                    padding: .5rem .9rem; border-radius: 10px;
                    background: rgba(255,255,255,.05);
                    border: 1px solid rgba(255,255,255,.1);
                    color: #e2e8f0; font-size: .8rem; font-family: inherit;
                    outline: none; cursor: pointer;
                    transition: border-color .15s;
                }
                .sl-select:focus { border-color: rgba(139,92,246,.45); }
                .sl-select option { background: #0d1425; color: #f1f5f9; }

                .sl-count {
                    margin-left: auto;
                    font-size: .75rem; font-weight: 600; color: #475569;
                    background: rgba(255,255,255,.04);
                    border: 1px solid rgba(255,255,255,.07);
                    padding: .35rem .8rem; border-radius: 8px;
                    white-space: nowrap;
                }
                .sl-count span { color: #a78bfa; font-weight: 700; }

                /* Table shell */
                .sl-shell {
                    flex: 1; min-height: 0;
                    background: rgba(255,255,255,.025);
                    border: 1px solid rgba(255,255,255,.07);
                    border-radius: 16px;
                    overflow: hidden;
                    display: flex; flex-direction: column;
                }

                .sl-table-wrap { flex: 1; overflow: auto; }

                table.sl-table {
                    width: 100%; border-collapse: collapse;
                    font-size: .83rem;
                }

                .sl-table thead th {
                    position: sticky; top: 0; z-index: 2;
                    background: rgba(7,16,31,.97);
                    color: #475569;
                    font-size: .67rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: .08em;
                    padding: .7rem 1rem;
                    border-bottom: 1px solid rgba(255,255,255,.07);
                    white-space: nowrap;
                }

                .sl-table tbody tr {
                    border-bottom: 1px solid rgba(255,255,255,.04);
                    cursor: pointer;
                    transition: background .15s;
                }

                .sl-table tbody tr:hover { background: rgba(139,92,246,.06); }

                .sl-table td {
                    padding: .85rem 1rem;
                    vertical-align: middle;
                    color: #e2e8f0;
                }

                /* Loading / empty */
                .sl-center {
                    flex: 1; display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    gap: 1rem; padding: 3rem;
                    color: #475569; font-size: .88rem; font-weight: 500;
                }

                @keyframes sl-spin { to { transform: rotate(360deg); } }
                @keyframes sl-fade-in { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

                /* Custom scrollbar */
                .sl-custom-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .sl-custom-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sl-custom-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .sl-custom-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                @media (max-width: 992px) {
                    .sl-modal-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .sl-modal-grid > div:last-child {
                        border-left: none !important;
                        padding-left: 0 !important;
                        padding-top: 2rem;
                        border-top: 1px solid rgba(255,255,255,0.05);
                    }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .sl-topbar { padding: 0 1rem; }
                    .sl-body   { padding: 1rem; }
                    .sl-stats  { display: none; }
                    .sl-divider { display: none; }
                    .sl-title { font-size: 1.05rem; }
                }
                @media (max-width: 576px) {
                    .sl-filterbar { gap: .5rem; }
                    .sl-badge { display: none; }
                }
            `}</style>

            <div className="sl-glow-1" />
            <div className="sl-glow-2" />

            <div className="sl-root">
                {/* ── Topbar ── */}
                <header className="sl-topbar">
                    <img src={garooLogo} alt="Garoo" className="sl-logo" />
                    <h1 className="sl-title">Leads Dashboard</h1>
                    <div className="sl-divider" />
                    <span className="sl-badge">Spectrum</span>
                    <div className="sl-spacer" />
                    {!loading && (
                        <div className="sl-stats">
                            <div className="sl-stat">
                                <span className="sl-stat-n">
                                    {leads.length}
                                </span>
                                <span className="sl-stat-l">Total</span>
                            </div>
                            <div className="sl-stat-sep" />
                            <div className="sl-stat">
                                <span className="sl-stat-n">
                                    {withReservation}
                                </span>
                                <span className="sl-stat-l">Reservas</span>
                            </div>
                            <div className="sl-stat-sep" />
                            <div className="sl-stat">
                                <span className="sl-stat-n">
                                    {filtered.length}
                                </span>
                                <span className="sl-stat-l">Filtrados</span>
                            </div>
                        </div>
                    )}
                </header>

                {/* ── Body ── */}
                <main className="sl-body">
                    {/* Error */}
                    {error && (
                        <div className="sl-error">
                            <i className="bi bi-exclamation-circle-fill" />
                            {error}
                        </div>
                    )}

                    {/* Filter bar */}
                    {!loading && !error && (
                        <div className="sl-filterbar">
                            <div className="sl-search-wrap">
                                <i className="bi bi-search" />
                                <input
                                    className="sl-search"
                                    type="text"
                                    placeholder="Buscar por nombre, email o mensaje..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "3px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: ".6rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: ".07em",
                                        color: "#475569",
                                        paddingLeft: "2px",
                                    }}
                                >
                                    Canal
                                </span>
                                <select
                                    className="sl-select"
                                    value={channelFilter}
                                    onChange={(e) =>
                                        setChannelFilter(e.target.value)
                                    }
                                >
                                    {channels.map((c) => (
                                        <option key={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "3px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: ".6rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: ".07em",
                                        color: "#475569",
                                        paddingLeft: "2px",
                                    }}
                                >
                                    Emoción
                                </span>
                                <select
                                    className="sl-select"
                                    value={emotionFilter}
                                    onChange={(e) =>
                                        setEmotionFilter(e.target.value)
                                    }
                                >
                                    {emotions.map((e) => (
                                        <option key={e}>{e}</option>
                                    ))}
                                </select>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "3px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: ".6rem",
                                        fontWeight: 700,
                                        textTransform: "uppercase",
                                        letterSpacing: ".07em",
                                        color: "#475569",
                                        paddingLeft: "2px",
                                    }}
                                >
                                    Reserva
                                </span>
                                <select
                                    className="sl-select"
                                    value={reservFilter}
                                    onChange={(e) =>
                                        setReservFilter(e.target.value)
                                    }
                                >
                                    {["Todos", "Sí", "No"].map((r) => (
                                        <option key={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="sl-count">
                                <span>{filtered.length}</span> / {leads.length}{" "}
                                leads
                            </div>
                        </div>
                    )}

                    {/* Shell */}
                    <div className="sl-shell">
                        {loading ? (
                            <div className="sl-center">
                                <div className="sl-spinner" />
                                <span>Cargando leads desde el webhook...</span>
                            </div>
                        ) : error ? (
                            <div className="sl-center">
                                <i
                                    className="bi bi-wifi-off"
                                    style={{
                                        fontSize: "2.5rem",
                                        color: "#4b5563",
                                    }}
                                />
                                <span>No se pudo conectar al webhook</span>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="sl-center">
                                <i
                                    className="bi bi-inbox"
                                    style={{
                                        fontSize: "2.5rem",
                                        color: "#4b5563",
                                    }}
                                />
                                <span>
                                    No hay leads que coincidan con los filtros
                                </span>
                            </div>
                        ) : (
                            <div className="sl-table-wrap">
                                <table className="sl-table">
                                    <thead>
                                        <tr>
                                            <th>Candidato</th>
                                            <th>Teléfono</th>
                                            <th>Canal</th>
                                            <th>Último Mensaje</th>
                                            <th>Emoción</th>
                                            <th>Palabra Clave</th>
                                            <th>Reserva</th>
                                            <th>Última Interacción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((lead) => {
                                            const em = getEmotionStyle(
                                                lead.emocion_detectada,
                                            );
                                            const ch = getChannelInfo(
                                                lead.input_channel,
                                            );
                                            return (
                                                <tr
                                                    key={lead._id}
                                                    onClick={() =>
                                                        setSelected(lead)
                                                    }
                                                >
                                                    {/* Candidato */}
                                                    <td>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: ".65rem",
                                                            }}
                                                        >
                                                            <Avatar
                                                                name={
                                                                    lead.name ||
                                                                    lead.whatsapp_name
                                                                }
                                                            />
                                                            <div>
                                                                <p
                                                                    style={{
                                                                        margin: 0,
                                                                        fontWeight: 600,
                                                                        color: "#f1f5f9",
                                                                        fontSize:
                                                                            ".85rem",
                                                                        lineHeight: 1.2,
                                                                    }}
                                                                >
                                                                    {lead.name ||
                                                                        lead.whatsapp_name ||
                                                                        "—"}
                                                                </p>
                                                                <p
                                                                    style={{
                                                                        margin: 0,
                                                                        fontSize:
                                                                            ".72rem",
                                                                        color: "#475569",
                                                                    }}
                                                                >
                                                                    {lead.email ||
                                                                        "sin email"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Teléfono */}
                                                    <td
                                                        style={{
                                                            color: "#94a3b8",
                                                            fontFamily:
                                                                "monospace",
                                                            fontSize: ".8rem",
                                                        }}
                                                    >
                                                        {lead.phone || "—"}
                                                    </td>

                                                    {/* Canal */}
                                                    <td>
                                                        <span
                                                            style={{
                                                                display:
                                                                    "inline-flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: ".35rem",
                                                                fontSize:
                                                                    ".78rem",
                                                                fontWeight: 600,
                                                                color: ch.color,
                                                            }}
                                                        >
                                                            <i
                                                                className={`bi ${ch.icon}`}
                                                            />
                                                            {lead.input_channel ||
                                                                "—"}
                                                        </span>
                                                    </td>

                                                    {/* Último mensaje */}
                                                    <td
                                                        style={{
                                                            maxWidth: "220px",
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                color: "#94a3b8",
                                                                fontSize:
                                                                    ".78rem",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                        >
                                                            {lead.last_message ||
                                                                "—"}
                                                        </p>
                                                    </td>

                                                    {/* Emoción */}
                                                    <td>
                                                        {lead.emocion_detectada ? (
                                                            <span
                                                                style={{
                                                                    display:
                                                                        "inline-block",
                                                                    padding:
                                                                        "3px 9px",
                                                                    borderRadius:
                                                                        "6px",
                                                                    fontSize:
                                                                        ".7rem",
                                                                    fontWeight: 700,
                                                                    background:
                                                                        em.bg,
                                                                    border: `1px solid ${em.border}`,
                                                                    color: em.text,
                                                                }}
                                                            >
                                                                {
                                                                    lead.emocion_detectada
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span
                                                                style={{
                                                                    color: "#334155",
                                                                }}
                                                            >
                                                                —
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Palabra clave */}
                                                    <td>
                                                        {lead.palabra_clave ? (
                                                            <span
                                                                style={{
                                                                    display:
                                                                        "inline-block",
                                                                    padding:
                                                                        "3px 9px",
                                                                    borderRadius:
                                                                        "6px",
                                                                    fontSize:
                                                                        ".7rem",
                                                                    fontWeight: 700,
                                                                    background:
                                                                        "rgba(139,92,246,.12)",
                                                                    border: "1px solid rgba(139,92,246,.25)",
                                                                    color: "#c4b5fd",
                                                                }}
                                                            >
                                                                {
                                                                    lead.palabra_clave
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span
                                                                style={{
                                                                    color: "#334155",
                                                                }}
                                                            >
                                                                —
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Reserva */}
                                                    <td>
                                                        <span
                                                            style={{
                                                                display:
                                                                    "inline-flex",
                                                                alignItems:
                                                                    "center",
                                                                gap: ".3rem",
                                                                fontSize:
                                                                    ".75rem",
                                                                fontWeight: 700,
                                                                color: lead.has_reservation
                                                                    ? "#34d399"
                                                                    : "#64748b",
                                                            }}
                                                        >
                                                            <i
                                                                className={`bi ${lead.has_reservation ? "bi-check-circle-fill" : "bi-circle"}`}
                                                            />
                                                            {lead.has_reservation
                                                                ? "Sí"
                                                                : "No"}
                                                        </span>
                                                    </td>

                                                    {/* Última interacción */}
                                                    <td
                                                        style={{
                                                            color: "#64748b",
                                                            fontSize: ".75rem",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {formatDate(
                                                            lead.last_interaction,
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Lead modal */}
            <LeadModal lead={selected} onClose={() => setSelected(null)} />
        </>
    );
}
