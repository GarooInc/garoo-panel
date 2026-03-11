/**
 * Get style object for a given emotion string
 * @param {string} emotion - The detected emotion
 * @returns {Object} Style theme for the emotion
 */
export const getEmotionStyle = (emotion) => {
    const e = (emotion || "").toLowerCase();
    if (e.includes("pos") || e.includes("fel") || e.includes("ent"))
        return {
            bg: "rgba(16,185,129,.12)",
            border: "rgba(16,185,129,.35)",
            text: "#34d399",
            icon: "bi-emoji-smile-fill",
        };
    if (e.includes("neg") || e.includes("enj") || e.includes("mol"))
        return {
            bg: "rgba(239,68,68,.12)",
            border: "rgba(239,68,68,.35)",
            text: "#f87171",
            icon: "bi-emoji-frown-fill",
        };
    if (e.includes("neu") || e.includes("ind"))
        return {
            bg: "rgba(148,163,184,.12)",
            border: "rgba(148,163,184,.35)",
            text: "#94a3b8",
            icon: "bi-emoji-neutral-fill",
        };
    return {
        bg: "rgba(139,92,246,.08)",
        border: "rgba(139,92,246,.2)",
        text: "#c4b5fd",
        icon: "bi-emoji-smile",
    };
};

/**
 * Get info for a given channel name
 * @param {string} channel - The input channel
 * @returns {Object} Icon and color for the channel
 */
export const getChannelInfo = (channel) => {
    const c = (channel || "").toLowerCase();
    if (c.includes("wa")) return { icon: "bi-whatsapp", color: "#22c55e" };
    if (c.includes("fb") || c.includes("mess"))
        return { icon: "bi-messenger", color: "#0084ff" };
    if (c.includes("ig") || c.includes("ins"))
        return { icon: "bi-instagram", color: "#e1306c" };
    return { icon: "bi-chat-right-dots", color: "#94a3b8" };
};
