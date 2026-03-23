import React from "react";

export const Avatar = ({ name, size = 32 }) => {
    const initials = (name || "?").charAt(0).toUpperCase();
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 900,
                fontSize: size * 0.4,
                boxShadow: "0 4px 12px rgba(139,92,246,0.15)",
                flexShrink: 0,
            }}
        >
            {initials}
        </div>
    );
};

export const ModalSection = ({ label, children, style = {}, light }) => (
    <div style={{ ...style }}>
        <h3
            style={{
                margin: "0 0 0.85rem 0",
                fontSize: "0.58rem",
                fontWeight: 950,
                color: light ? "#94a3b8" : "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
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
                    background: light ? "#f1f5f9" : "linear-gradient(to right, rgba(255,255,255,0.05), transparent)",
                }}
            />
        </h3>
        <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
            {children}
        </div>
    </div>
);

export const ModalChip = ({ label, value, icon, color, bg, border, light }) => (
    <div
        style={{
            background: bg || (light ? "#f8fafc" : "rgba(255,255,255,0.02)"),
            border: `1px solid ${border || (light ? "#e2e8f0" : "rgba(255,255,255,0.05)")}`,
            borderRadius: "10px",
            padding: "0.5rem 0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            transition: "all 0.2s"
        }}
    >
        <span
            style={{
                fontSize: "0.5rem",
                fontWeight: 800,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: '0.05em'
            }}
        >
            {label}
        </span>
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.75rem",
                fontWeight: 900,
                color: color || (light ? "#334155" : "#f1f5f9"),
            }}
        >
            {icon && (
                <i className={`bi ${icon}`} style={{ fontSize: "0.85rem", color: color || "#8b5cf6" }} />
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

export const ModalField = ({ icon, label, value, light }) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.35rem 0",
        }}
    >
        <div
            style={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                background: light ? "#f1f5f9" : "rgba(139, 92, 246, 0.04)",
                border: light ? "1px solid #e2e8f0" : "1px solid rgba(139, 92, 246, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#8b5cf6",
                fontSize: "0.85rem",
                flexShrink: 0,
            }}
        >
            <i className={`bi ${icon}`} />
        </div>
        <div style={{ minWidth: 0 }}>
            <p
                style={{
                    margin: 0,
                    fontSize: "0.5rem",
                    fontWeight: 850,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: '0.05em',
                }}
            >
                {label}
            </p>
            <p
                style={{
                    margin: 0,
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: light ? "#334155" : "#f1f5f9",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                }}
            >
                {value || "—"}
            </p>
        </div>
    </div>
);

export const ChatBubble = ({ type, content, timestamp, light }) => {
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
                marginBottom: "1.75rem",
                width: "100%",
            }}
        >
            <div
                style={{
                    maxWidth: "80%",
                    padding: "1rem 1.25rem",
                    borderRadius: isAI
                        ? "2px 20px 20px 20px"
                        : "20px 2px 20px 20px",
                    background: isAI
                        ? (light ? "white" : "rgba(15, 23, 42, 0.6)")
                        : (light ? "#8b5cf6" : "linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)"),
                    border: light ? "1px solid #e2e8f0" : (isAI ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid rgba(139, 92, 246, 0.2)"),
                    color: isAI 
                        ? (light ? "#334155" : "#94a3b8") 
                        : "#ffffff",
                    fontSize: "0.88rem",
                    lineHeight: 1.5,
                    position: "relative",
                    boxShadow: light ? "0 4px 10px -2px rgba(0,0,0,0.05)" : "none",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "-1.35rem",
                        [isAI ? "left" : "right"]: "4px",
                        fontSize: "0.6rem",
                        fontWeight: 900,
                        color: isAI ? "#8b5cf6" : (light ? "#94a3b8" : "#64748b"),
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center'
                    }}
                >
                    <span>{isAI ? "SOFÍA IA" : "CLIENTE"}</span>
                    {timestamp && <span style={{ opacity: 0.5 }}>• {timestamp}</span>}
                </div>
                {text}
            </div>
        </div>
    );
};

export const ChatHistory = ({ chatData, light }) => {
    if (!chatData || !chatData.chat) return null;

    const messages = Array.isArray(chatData.chat) 
        ? chatData.chat 
        : [...(chatData.chat["1ra_parte"] || []), ...(chatData.chat["2da_parte"] || [])];

    return (
        <div style={{ width: "100%", display: 'flex', flexDirection: 'column' }}>
            {messages.map((msg, idx) => (
                <ChatBubble
                    key={idx}
                    type={msg.role === "assistant" || msg.role === "ai" || msg.type === "ai" ? "ai" : "user"}
                    content={msg.content || msg.text || msg.data?.content}
                    timestamp={msg.timestamp}
                    light={light}
                />
            ))}
        </div>
    );
};
