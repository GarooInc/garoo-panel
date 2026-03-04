import React from "react";

export const Avatar = ({ name, size = 32 }) => {
    const initials = (name || "?").charAt(0).toUpperCase();
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "14px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: size * 0.45,
                boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
                flexShrink: 0,
            }}
        >
            {initials}
        </div>
    );
};

export const StatusBadge = ({ active }) => (
    <span
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            padding: "2px 8px",
            borderRadius: "100px",
            fontSize: "0.62rem",
            fontWeight: 800,
            background: active ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)",
            border: `1px solid ${active ? "rgba(16,185,129,.3)" : "rgba(239,68,68,.3)"}`,
            color: active ? "#10b981" : "#f87171",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
        }}
    >
        <div
            style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "currentColor",
                boxShadow: "0 0 4px currentColor",
            }}
        />
        {active ? "Activo" : "Inactivo"}
    </span>
);

export const ModalSection = ({ label, children, style = {} }) => (
    <div style={{ marginBottom: "1.5rem", ...style }}>
        <p
            style={{
                margin: "0 0 1rem 0",
                fontSize: "0.65rem",
                fontWeight: 800,
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
            }}
        >
            {label}
            <div
                style={{
                    flex: 1,
                    height: "1px",
                    background:
                        "linear-gradient(to right, rgba(255,255,255,0.08), transparent)",
                }}
            />
        </p>
        <div
            style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
        >
            {children}
        </div>
    </div>
);

export const ModalChip = ({ label, value, icon, color, bg, border }) => (
    <div
        style={{
            background: bg || "rgba(255,255,255,.03)",
            border: `1px solid ${border || "rgba(255,255,255,.07)"}`,
            borderRadius: "12px",
            padding: "0.65rem 0.85rem",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
        }}
    >
        <span
            style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                color: "#475569",
                textTransform: "uppercase",
            }}
        >
            {label}
        </span>
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                color: color || "#f1f5f9",
            }}
        >
            {icon && (
                <i className={`bi ${icon}`} style={{ fontSize: "0.85rem" }} />
            )}
            <span
                style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {value}
            </span>
        </div>
    </div>
);

export const ModalField = ({ icon, label, value }) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.25rem 0",
        }}
    >
        <div
            style={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                background: "rgba(255,255,255,.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                fontSize: "0.9rem",
                flexShrink: 0,
            }}
        >
            <i className={`bi ${icon}`} />
        </div>
        <div style={{ minWidth: 0 }}>
            <p
                style={{
                    margin: 0,
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    color: "#475569",
                    textTransform: "uppercase",
                }}
            >
                {label}
            </p>
            <p
                style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#e2e8f0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {value || "—"}
            </p>
        </div>
    </div>
);

export const ChatBubble = ({ type, content }) => {
    const isAI = type === "ai";
    let text = content || "";
    if (isAI) {
        try {
            const parsed = JSON.parse(text);
            text = parsed.response || text;
        } catch {
            // Not JSON
        }
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isAI ? "flex-start" : "flex-end",
                marginBottom: "1rem",
                width: "100%",
            }}
        >
            <div
                style={{
                    maxWidth: "85%",
                    padding: "0.85rem 1.1rem",
                    borderRadius: isAI
                        ? "0 18px 18px 18px"
                        : "18px 0 18px 18px",
                    background: isAI
                        ? "rgba(139,92,246,0.1)"
                        : "rgba(255,255,255,0.05)",
                    border: `1px solid ${isAI ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.08)"}`,
                    color: isAI ? "#c4b5fd" : "#e2e8f0",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    position: "relative",
                    boxShadow: isAI
                        ? "0 4px 15px rgba(139,92,246,0.05)"
                        : "none",
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        top: "-1.2rem",
                        [isAI ? "left" : "right"]: "4px",
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        color: isAI ? "#8b5cf6" : "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                    }}
                >
                    {isAI ? "Agente Sofía" : "Lead"}
                </span>
                {text}
            </div>
        </div>
    );
};

export const ChatHistory = ({ chatData }) => {
    if (!chatData || !chatData.chat) return null;
    const part1 = chatData.chat["1ra_parte"] || [];
    const part2 = chatData.chat["2da_parte"] || [];

    return (
        <ModalSection label="Historial de Conversación">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                }}
            >
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
                            margin: "1.5rem 0",
                            opacity: 0.6,
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
};
