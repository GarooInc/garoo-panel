import { useState, useEffect, useMemo } from "react";
import LeadModal from "../../../components/Spectrum/LeadModal";
import { Avatar } from "../../../components/Spectrum/LeadModalComponents";
import { getEmotionStyle, getChannelInfo } from "../../../utils/leadHelpers";
import { formatFullDate } from "../../../utils/dateHelpers";
import garooLogo from "../../../assets/img/garoo-logo.png";

const WEBHOOK_URL = "/spectrum-proxy/webhook/leads";

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

                .sl-logo-ring {
                    width: 38px; height: 38px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(139,92,246,.25), rgba(139,130,246,.1));
                    border: 1.5px solid rgba(139,92,246,.35);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 14px rgba(139,92,246,.25);
                    flex-shrink: 0;
                }

                .sl-logo-ring img {
                    width: 26px; height: 26px;
                    border-radius: 50%; object-fit: cover;
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

                @media (max-width: 768px) {
                    .sl-body { padding: 1rem; }
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

                @media (max-width: 992px) {
                    .sl-filterbar { flex-wrap: wrap; gap: 0.75rem; }
                    .sl-count { margin-left: 0; order: -1; width: 100%; text-align: right; }
                    .sl-search-wrap { max-width: 100%; order: 1; width: 100%; }
                }

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

                /* Responsive Table */
                @media (max-width: 768px) {
                    .sl-table thead { display: none; }
                    .sl-table tbody tr {
                        display: block;
                        padding: 1.25rem;
                        margin-bottom: 0.75rem;
                        background: rgba(255,255,255,.01) !important;
                        border: 1px solid rgba(255,255,255,.05);
                        border-radius: 12px;
                    }
                    .sl-table td {
                        display: flex;
                        justify-content: space-between;
                        padding: 0.4rem 0 !important;
                        border: none;
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                    .sl-table td::before {
                        content: attr(data-label);
                        font-weight: 700;
                        color: #475569;
                        font-size: .65rem;
                        text-transform: uppercase;
                        letter-spacing: .05em;
                        margin-right: 1rem;
                    }
                    .sl-table td:first-child {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.25rem;
                        margin-bottom: 0.75rem;
                        padding-bottom: 0.75rem !important;
                        border-bottom: 1px solid rgba(255,255,255,.05);
                    }
                    .sl-table td:first-child::before { display: none; }
                }

                @media (max-width: 1024px) {
                    .sl-modal-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .sl-modal-grid > div:first-child {
                        max-height: 400px;
                        border-right: none !important;
                        border-bottom: 1px solid rgba(255,255,255,0.05);
                    }
                    .sl-modal-grid > div:last-child {
                        padding-left: 0 !important;
                    }
                }

                @media (max-width: 768px) {
                    .sl-topbar { padding: .5rem 1rem; height: auto; flex-direction: column; gap: .5rem; align-items: center; text-align: center; }
                    .sl-stats  { display: none; }
                    .sl-divider { display: none; }
                    .sl-title { font-size: 1.05rem; }
                    .sl-badge { display: none; }
                    .sl-logo-ring { display: none; }
                    .sl-modulo-label { display: none; }
                }

                @media (max-width: 480px) {
                    .sl-search-wrap { min-width: 100%; }
                    .sl-select { flex: 1; font-size: 0.75rem; padding: 0.4rem 0.6rem; }
                }
            `}</style>

            <div className="sl-glow-1" />
            <div className="sl-glow-2" />

            <div className="sl-root">
                {/* ── Topbar ── */}
                <header className="sl-topbar">
                    <div className="d-flex align-items-center gap-3">
                        <div className="sl-logo-ring">
                            <img src={garooLogo} alt="Garoo" />
                        </div>
                        <div className="d-flex flex-column">
                            <h1 className="sl-title" style={{ fontSize: '1.1rem', marginBottom: '2px' }}>Garoo Portal</h1>
                            <div className="d-flex align-items-center gap-2">
                                <span className="sl-modulo-label" style={{ fontSize: '.6rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.05em' }}>Módulo:</span>
                                <span style={{ fontSize: '.65rem', fontWeight: 800, color: '#f1f5f9' }}>Panel de Leads</span>
                            </div>
                        </div>
                    </div>

                    <div className="sl-divider ms-2 me-2" />

                    <span className="sl-badge">Spectrum</span>

                    <div className="sl-spacer" />

                    {!loading && (
                        <div className="sl-stats" style={{ height: '40px', padding: '0 1rem' }}>
                            <div className="sl-stat" style={{ padding: '0 .5rem' }}>
                                <span className="sl-stat-n" style={{ fontSize: '.95rem' }}>{leads.length}</span>
                                <span className="sl-stat-l" style={{ fontSize: '.55rem' }}>TOTAL</span>
                            </div>
                            <div className="sl-stat-sep" />
                            <div className="sl-stat" style={{ padding: '0 .5rem' }}>
                                <span className="sl-stat-n" style={{ fontSize: '.95rem', color: '#8b5cf6' }}>{withReservation}</span>
                                <span className="sl-stat-l" style={{ fontSize: '.55rem' }}>RESERVAS</span>
                            </div>
                            <div className="sl-stat-sep" />
                            <div className="sl-stat" style={{ padding: '0 .5rem', minWidth: '70px' }}>
                                <span className="sl-stat-n" style={{ fontSize: '.95rem', color: filtered.length < leads.length ? '#a78bfa' : '#f1f5f9' }}>
                                    {filtered.length}
                                </span>
                                <span className="sl-stat-l" style={{ fontSize: '.55rem' }}>FILTRADOS</span>
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
                                contactos
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
                                                    key={lead._id || lead.id}
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
                                                                size={36}
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
                                                        data-label="Teléfono"
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
                                                    <td data-label="Canal">
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
                                                        data-label="Mensaje"
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
                                                    <td data-label="Emoción">
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
                                                    <td data-label="Keyword">
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
                                                    <td data-label="Reserva">
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
                                                        data-label="Última"
                                                        style={{
                                                            color: "#64748b",
                                                            fontSize: ".75rem",
                                                            whiteSpace:
                                                                "nowrap",
                                                        }}
                                                    >
                                                        {formatFullDate(
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
