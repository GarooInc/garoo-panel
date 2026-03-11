import React, { useState, useEffect, useMemo } from "react";
import {
    Spinner,
    Badge,
    Form,
    Button,
    Modal,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import axios from "axios";
import garooLogo from "../../../assets/img/garoo-logo.png";
import "./VideoAnalysis.css";

// Helper for simple info tooltips
const InfoTooltip = ({ text }) => (
    <OverlayTrigger placement="top" overlay={<Tooltip>{text}</Tooltip>}>
        <i
            className="bi bi-info-circle ms-2"
            style={{ cursor: "help", color: "#64748b", fontSize: "0.95em" }}
        ></i>
    </OverlayTrigger>
);

// Helper to soften and simplify complex marketer AI Language into friendly User UI
const simplifyAITerms = (text) => {
    if (!text) return text;
    const str = String(text);

    // Core Banner / Analytics logic
    if (
        str.includes("IMPORTACIÓN ESTRATÉGICA MX -> GT") ||
        str.includes("IMPORTACIÓN MX -> GT")
    )
        return "Tendencia en México Sugerida para Guatemala";
    if (str.includes("DETECCIÓN NATIVA GT"))
        return "Video Viral de Guatemala (Oportunidad Local)";

    // Replication Formats
    if (str.includes("Digital / Trend de Audio"))
        return "Idea para Video de TikTok";
    if (str.includes("Activación BTL / Experiencia"))
        return "Idea para Evento Físico y Calle";
    if (str.includes("Producción Premium"))
        return "Crear un Video Publicitario/Promocional";
    if (str.includes("Challenge o Reacción")) return "Reto para los Seguidores";

    return str;
};

const VideoAnalysisPage = () => {
    // Endpoints
    const DATES_WEBHOOK = "https://agentsprod.redtec.ai/webhook/video-dates";
    const VIDEOS_WEBHOOK = "https://agentsprod.redtec.ai/webhook/videos";

    // States
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [videoData, setVideoData] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [loadingDates, setLoadingDates] = useState(true);
    const [loadingVideos, setLoadingVideos] = useState(false);
    const [error, setError] = useState(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [countryTab, setCountryTab] = useState("GT");
    const [filters, setFilters] = useState({
        GT: { platform: "all", score: "all", tier: "all" },
        MX: { platform: "all", score: "all", tier: "all" },
    });

    // Initial load: Fetch available dates
    useEffect(() => {
        const fetchDates = async () => {
            try {
                setLoadingDates(true);
                const response = await axios.get(DATES_WEBHOOK);
                const rawDates = response.data.dates || [];
                const dates = rawDates.map((d) => d._id).filter(Boolean);

                if (dates.length > 0) {
                    setAvailableDates(dates);
                    setSelectedDate(dates[0]);
                } else {
                    const today = new Date().toISOString().split("T")[0];
                    setAvailableDates([today]);
                    setSelectedDate(today);
                }
            } catch (err) {
                console.error("Error fetching dates:", err);
                const today = new Date().toISOString().split("T")[0];
                setAvailableDates([today]);
                setSelectedDate(today);
            } finally {
                setLoadingDates(false);
            }
        };

        fetchDates();
    }, []);

    // Fetch video data whenever selectedDate changes
    useEffect(() => {
        if (!selectedDate) return;

        const fetchVideos = async () => {
            try {
                setLoadingVideos(true);
                setError(null);
                const response = await axios.post(VIDEOS_WEBHOOK, {
                    fecha: selectedDate,
                });

                if (
                    response.data.status === "success" ||
                    response.data.status === "successful" ||
                    Array.isArray(response.data)
                ) {
                    let data = [];
                    // Extract data from standard success wrapper or direct array
                    const rawData = response.data.data || response.data;

                    if (Array.isArray(rawData)) {
                        // Check if it's [ { video_list: [...] } ] (Common n8n nested format)
                        if (rawData.length > 0 && rawData[0].video_list) {
                            data = rawData[0].video_list;
                        } else {
                            data = rawData;
                        }
                    } else if (
                        rawData &&
                        typeof rawData === "object" &&
                        rawData.video_list
                    ) {
                        // Check if it's { video_list: [...] }
                        data = rawData.video_list;
                    } else {
                        data = Array.isArray(rawData) ? rawData : [];
                    }

                    setVideoData(data);

                    const gtVideos = data.filter((v) => v.pais === "GT");
                    const mxVideos = data.filter((v) => v.pais === "MX");

                    if (gtVideos.length > 0) {
                        setCountryTab("GT");
                        setSelectedVideo(gtVideos[0]);
                    } else if (mxVideos.length > 0) {
                        setCountryTab("MX");
                        setSelectedVideo(mxVideos[0]);
                    } else {
                        setSelectedVideo(null);
                    }
                } else {
                    setVideoData([]);
                    setSelectedVideo(null);
                }
            } catch (err) {
                console.error("Error fetching videos:", err);
                setError("No se pudo conectar con el servidor.");
                setVideoData([]);
                setSelectedVideo(null);
            } finally {
                setLoadingVideos(false);
            }
        };

        fetchVideos();
    }, [selectedDate]);

    // Filtered Video Data
    const filteredVideoData = useMemo(() => {
        const currentFilters = filters[countryTab] || {
            platform: "all",
            score: "all",
            tier: "all",
        };
        return videoData.filter((item) => {
            const matchesCountry = item.pais === countryTab;
            const matchesPlatform =
                currentFilters.platform === "all" ||
                item.video_data?.platform === currentFilters.platform;
            const matchesTier =
                currentFilters.tier === "all" ||
                item.video_data?.viral_tier === currentFilters.tier;

            let matchesScore = true;

            // Robustly extract all possible scores from the AI output and find the max
            const possibleScores = [
                item.video_analysis?.estrategia_pepsi_gt?.urgencia_score,
                item.video_analysis?.estrategia_pepsi_gt?.urgency_score,
                item.video_analysis?.estrategia_pepsi_guatemala?.urgencia_score, // Added this safely
                item.video_analysis?.estrategia_pepsi_guatemala?.urgency_score,
                item.video_analysis?.urgencia_score,
                item.video_analysis?.urgency_score,
                item.video_analysis?.ejecucion_creativa?.[0]?.urgency_score,
                item.video_analysis?.ejecucion_creativa?.[0]?.urgencia_score,
            ]
                .map((s) => parseInt(String(s).split("/")[0].trim()))
                .filter((n) => !isNaN(n));

            const score =
                possibleScores.length > 0 ? Math.max(...possibleScores) : 0;

            if (currentFilters.score === "high") matchesScore = score >= 8;
            else if (currentFilters.score === "medium")
                matchesScore = score >= 5 && score < 8;
            else if (currentFilters.score === "low") matchesScore = score < 5;

            return (
                matchesCountry && matchesPlatform && matchesTier && matchesScore
            );
        });
    }, [videoData, filters, countryTab]);

    // Unique filter options per country tab
    const filterOptions = useMemo(() => {
        const countryVideos = videoData.filter((v) => v.pais === countryTab);
        const platforms = [
            "all",
            ...new Set(
                countryVideos
                    .map((v) => v.video_data?.platform)
                    .filter(Boolean),
            ),
        ];
        const tiers = [
            "all",
            ...new Set(
                countryVideos
                    .map((v) => v.video_data?.viral_tier)
                    .filter(Boolean),
            ),
        ];
        return { platforms, tiers };
    }, [videoData, countryTab]);

    const updateFilter = (filterName, value) => {
        setFilters((prev) => ({
            ...prev,
            [countryTab]: {
                ...prev[countryTab],
                [filterName]: value,
            },
        }));
    };

    const formatNumber = (num) => {
        const n = Number(num);
        if (Number.isNaN(n) || num === "" || num === null || num === undefined)
            return "0";
        if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
        if (n >= 1000) return (n / 1000).toFixed(1) + "K";
        return String(n);
    };

    const formatTechValue = (key, value) => {
        if (!value && value !== 0) return "N/A";

        if (key === "age_hours") {
            const h = parseFloat(value);
            if (h < 24) return `${h.toFixed(1)}h`;
            const d = Math.floor(h / 24);
            const remainingH = Math.round(h % 24);
            return `${d}d ${remainingH}h`;
        }

        if (key === "create_time") {
            const date = new Date(value * 1000);
            return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        if (key === "detected_at") {
            const date = new Date(value);
            return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        return String(value);
    };

    const handleTabChange = (tab) => {
        setCountryTab(tab);
        const tabVideos = videoData.filter((v) => v.pais === tab);
        if (tabVideos.length > 0) {
            setSelectedVideo(tabVideos[0]);
        } else {
            setSelectedVideo(null);
        }
    };

    return (
        <div className="pepsi-root">
            {/* Mobile Portrait Warning Overlay */}
            <div id="pepsi-mobile-portrait-warning">
                <i
                    className="bi bi-phone-landscape"
                    style={{
                        fontSize: "4rem",
                        color: "#60a5fa",
                        marginBottom: "1rem",
                    }}
                ></i>
                <h3 className="fw-bold mb-2">Por favor, gira tu dispositivo</h3>
                <p className="text-white-50 small mb-0 w-75 mx-auto">
                    Para visualizar correctamente el Gestor de Videos y la
                    Inteligencia Estratégica AI, debes colocar tu dispositivo en
                    formato horizontal (Landscape).
                </p>
            </div>

            {/* Ambient Glows */}
            <div className="pepsi-glow-1" />
            <div className="pepsi-glow-2" />

            {/* Top Navigation Bar - Matching Garoo Standard (RocknRolla/Spectrum style) */}
            <header className="pepsi-topbar">
                <div className="d-flex align-items-center gap-3">
                    <div className="pepsi-logo-ring">
                        <img src={garooLogo} alt="Garoo" />
                    </div>
                    <div className="d-flex flex-column">
                        <h1
                            className="pepsi-topbar-title"
                            style={{ fontSize: "1.1rem", marginBottom: "2px" }}
                        >
                            Garoo Portal
                        </h1>
                        <div className="d-flex align-items-center gap-2">
                            <span
                                className="pepsi-modulo-label"
                                style={{
                                    fontSize: ".6rem",
                                    fontWeight: 700,
                                    color: "#475569",
                                    textTransform: "uppercase",
                                    letterSpacing: ".05em",
                                }}
                            >
                                Módulo:
                            </span>
                            <span
                                style={{
                                    fontSize: ".65rem",
                                    fontWeight: 800,
                                    color: "#0f172a",
                                }}
                            >
                                Gestor de Videos
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pepsi-divider ms-2 me-2" />
                <span className="pepsi-pill">Pepsi</span>

                <div className="pepsi-spacer" />

                {/* Main Filters (Platform, Tier, Score) */}
                <div className="d-flex align-items-center gap-2 me-3">
                    <Form.Select
                        size="sm"
                        className="pepsi-date-select text-secondary border-0 fw-semibold shadow-none"
                        style={{
                            fontSize: "0.75rem",
                            width: "auto",
                            paddingRight: "1.2rem",
                            cursor: "pointer",
                        }}
                        value={filters[countryTab]?.platform || "all"}
                        onChange={(e) =>
                            updateFilter("platform", e.target.value)
                        }
                    >
                        <option value="all">Plataforma</option>
                        {filterOptions.platforms
                            .filter((p) => p !== "all")
                            .map((p) => (
                                <option key={p} value={p}>
                                    {p.charAt(0).toUpperCase() + p.slice(1)}
                                </option>
                            ))}
                    </Form.Select>

                    <Form.Select
                        size="sm"
                        className="pepsi-date-select text-secondary border-0 fw-semibold shadow-none"
                        style={{
                            fontSize: "0.75rem",
                            width: "auto",
                            paddingRight: "1.2rem",
                            cursor: "pointer",
                        }}
                        value={filters[countryTab]?.score || "all"}
                        onChange={(e) => updateFilter("score", e.target.value)}
                    >
                        <option value="all">Score IA</option>
                        <option value="high">Alto (8-10)</option>
                        <option value="medium">Medio (5-7)</option>
                        <option value="low">Bajo (0-4)</option>
                    </Form.Select>

                    <Form.Select
                        size="sm"
                        className="pepsi-date-select text-secondary border-0 fw-semibold shadow-none"
                        style={{
                            fontSize: "0.75rem",
                            width: "auto",
                            paddingRight: "1.2rem",
                            cursor: "pointer",
                        }}
                        value={filters[countryTab]?.tier || "all"}
                        onChange={(e) => updateFilter("tier", e.target.value)}
                    >
                        <option value="all">Viralidad</option>
                        {filterOptions.tiers
                            .filter((t) => t !== "all")
                            .map((t) => (
                                <option key={t} value={t}>
                                    {t.replace("_", " ").toUpperCase()}
                                </option>
                            ))}
                    </Form.Select>
                </div>

                <div className="pepsi-divider ms-0 me-3" />

                {/* Date Filter in Header */}
                <div className="d-flex align-items-center gap-2">
                    <span
                        className="pepsi-modulo-label"
                        style={{ marginBottom: 0 }}
                    >
                        Fecha:
                    </span>
                    {loadingDates ? (
                        <Spinner
                            animation="border"
                            size="sm"
                            variant="primary"
                        />
                    ) : (
                        <Form.Select
                            size="sm"
                            className="pepsi-date-select border-0 shadow-sm px-3 fw-bold"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{
                                width: "140px",
                                background: "#e0f2fe",
                                color: "#0369a1",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "0.75rem",
                            }}
                        >
                            {availableDates.map((date) => (
                                <option
                                    key={date}
                                    value={date}
                                    style={{
                                        color: "#0f172a",
                                        background: "#ffffff",
                                    }}
                                >
                                    {date}
                                </option>
                            ))}
                        </Form.Select>
                    )}
                </div>
            </header>

            <main className="pepsi-body">
                {/* Content Shells */}
                <div className="pepsi-content-wrapper mt-2">
                    {/* Left Panel: Video List (Narrowed) */}
                    <div className="pepsi-shell" style={{ maxWidth: "420px" }}>
                        <div className="pepsi-shell-header d-flex flex-column gap-3">
                            <div className="d-flex align-items-center justify-content-between w-100">
                                <span className="pepsi-shell-title">
                                    <i className="bi bi-collection-play text-primary"></i>
                                    Feed
                                    <InfoTooltip text="Lista cronológica de videos virales capturados en las últimas 24 horas." />
                                </span>
                                <div
                                    style={{
                                        width: "180px",
                                        textAlign: "right",
                                    }}
                                >
                                    <span
                                        className="pepsi-badge-total-day shadow-sm"
                                        style={{ padding: "0.3rem 0.6rem" }}
                                    >
                                        <i className="bi bi-funnel-fill opacity-75 me-1"></i>
                                        {filteredVideoData.length} resultados
                                    </span>
                                </div>
                            </div>

                            {/* Country Tabs */}
                            <ul
                                className="nav nav-pills nav-fill w-100 pepsi-country-tabs"
                                style={{
                                    backgroundColor: "rgba(0,0,0,0.05)",
                                    borderRadius: "8px",
                                    padding: "4px",
                                }}
                            >
                                <li className="nav-item">
                                    <button
                                        className={`nav-link py-1 px-2 ${countryTab === "GT" ? "active shadow-sm" : "text-secondary"}`}
                                        style={{
                                            fontSize: "0.8rem",
                                            fontWeight: 600,
                                            borderRadius: "6px",
                                        }}
                                        onClick={() => handleTabChange("GT")}
                                    >
                                        🇬🇹 Guatemala
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link py-1 px-2 ${countryTab === "MX" ? "active shadow-sm" : "text-secondary"}`}
                                        style={{
                                            fontSize: "0.8rem",
                                            fontWeight: 600,
                                            borderRadius: "6px",
                                        }}
                                        onClick={() => handleTabChange("MX")}
                                    >
                                        🇲🇽 México
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="pepsi-scroll-area">
                            {loadingVideos ? (
                                <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 opacity-50">
                                    <div className="pepsi-loader-simple"></div>
                                    <span className="small fw-medium">
                                        Sincronizando...
                                    </span>
                                </div>
                            ) : filteredVideoData.length > 0 ? (
                                filteredVideoData.map((item) => (
                                    <div
                                        key={item._id?.$oid || item._id}
                                        className={`video-row d-flex align-items-center gap-3 ${selectedVideo?._id === item._id ? "selected-video" : ""}`}
                                        onClick={() => setSelectedVideo(item)}
                                    >
                                        <div className="video-preview-wrapper shadow">
                                            <img
                                                src={
                                                    item.video_data?.cover ||
                                                    "https://placehold.co/100x150/111827/38bdf8?text=No+Cover"
                                                }
                                                alt="thumbnail"
                                            />
                                            <div className="platform-tag">
                                                <i
                                                    className={`bi bi-${item.video_data.platform}`}
                                                ></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 video-info">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <Badge
                                                    bg={
                                                        item.video_data
                                                            ?.viral_tier ===
                                                        "mega_viral"
                                                            ? "danger"
                                                            : "primary"
                                                    }
                                                    className="rounded-pill px-2 d-inline-flex align-items-center"
                                                    style={{
                                                        fontSize: ".55rem",
                                                    }}
                                                >
                                                    {(
                                                        item.video_data
                                                            ?.viral_tier ||
                                                        "N/A"
                                                    )
                                                        .replace("_", " ")
                                                        .toUpperCase()}
                                                    <InfoTooltip text="Nivel de viralidad detectado por el algoritmo: desde tendencias locales hasta explosiones mundiales (Mega Viral)." />
                                                </Badge>
                                            </div>
                                            <h6
                                                className="mb-1 text-truncate"
                                                style={{ maxWidth: "240px" }}
                                            >
                                                {item.video_data.title ||
                                                    "Contenido viral"}
                                            </h6>
                                            <div className="video-info-sub d-flex gap-2">
                                                <span className="text-primary opacity-75 fw-bold">
                                                    @
                                                    {item.video_data
                                                        ?.author_username ||
                                                        "unknown"}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {formatNumber(
                                                        item.video_data
                                                            .play_count,
                                                    )}{" "}
                                                    vistas
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5 opacity-50">
                                    <i
                                        className="bi bi-inboxes text-secondary mb-3"
                                        style={{ fontSize: "2.5rem" }}
                                    ></i>
                                    <h6 className="fw-bold text-secondary mb-1">
                                        Sin coincidencias
                                    </h6>
                                    <p className="small text-secondary text-center px-4">
                                        No se encontraron videos para los
                                        filtros seleccionados en este día.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Strategic Analysis (Main Focus) */}
                    <div className="pepsi-shell main-focus-shell">
                        <div className="pepsi-shell-header">
                            <span className="pepsi-shell-title">
                                <i className="bi bi-cpu-fill text-info"></i>
                                Garoo Insights (Potenciado con Inteligencia
                                Artificial)
                                <InfoTooltip text="Motor de IA de Garoo que analiza el video y genera recomendaciones de negocio para Pepsi." />
                            </span>
                            {selectedVideo && (
                                <div className="d-flex align-items-center gap-3">
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="light"
                                            size="sm"
                                            className="rounded-pill px-4 py-1 shadow-sm border"
                                            style={{
                                                fontSize: ".65rem",
                                                fontWeight: 800,
                                                color: "#475569",
                                            }}
                                            onClick={() =>
                                                setShowInfoModal(true)
                                            }
                                        >
                                            Metadata{" "}
                                            <i className="bi bi-hdd-fill ms-1 opacity-50"></i>
                                            <InfoTooltip text="Ver los datos técnicos crudos del video (ID, Engagement exacto, URLs de CDN)." />
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="rounded-pill px-4 py-1 shadow-sm border-0"
                                            style={{
                                                fontSize: ".65rem",
                                                fontWeight: 800,
                                                background:
                                                    "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                                            }}
                                            href={
                                                selectedVideo.video_data?.url ||
                                                "#"
                                            }
                                            target={
                                                selectedVideo.video_data?.url
                                                    ? "_blank"
                                                    : "_self"
                                            }
                                        >
                                            Ver Original{" "}
                                            <i className="bi bi-box-arrow-up-right ms-1"></i>
                                            <InfoTooltip text="Abrir el video directamente en la aplicación de TikTok para ver comentarios y reacciones en tiempo real." />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="pepsi-scroll-area analysis-stage">
                            {selectedVideo ? (
                                (() => {
                                    // Priority calculation for UI states
                                    // Robustly check all possible score locations to prevent "score 0" due to schema changes
                                    const possibleScoresBanner = [
                                        selectedVideo.video_analysis
                                            ?.estrategia_pepsi_gt
                                            ?.urgencia_score,
                                        selectedVideo.video_analysis
                                            ?.estrategia_pepsi_gt
                                            ?.urgency_score,
                                        selectedVideo.video_analysis
                                            ?.urgencia_score,
                                        selectedVideo.video_analysis
                                            ?.urgency_score,
                                        selectedVideo.video_analysis
                                            ?.ejecucion_creativa?.[0]
                                            ?.urgency_score,
                                        selectedVideo.video_analysis
                                            ?.ejecucion_creativa?.[0]
                                            ?.urgencia_score,
                                    ]
                                        .map((s) =>
                                            parseInt(
                                                String(s).split("/")[0].trim(),
                                            ),
                                        )
                                        .filter((n) => !isNaN(n));

                                    const score =
                                        possibleScoresBanner.length > 0
                                            ? Math.max(...possibleScoresBanner)
                                            : 0;

                                    let priorityClass = "low";
                                    let priorityLabel = "Prioridad Baja";
                                    let priorityIcon =
                                        "bi bi-check-circle-fill";

                                    if (score >= 9) {
                                        priorityClass = "critical";
                                        priorityLabel =
                                            "PRIORIDAD CRÍTICA / INMEDIATA";
                                        priorityIcon =
                                            "bi bi-exclamation-octagon-fill";
                                    } else if (score >= 7) {
                                        priorityClass = "high";
                                        priorityLabel = "PRIORIDAD ALTA";
                                        priorityIcon = "bi bi-lightning-fill";
                                    } else if (score >= 5) {
                                        priorityClass = "medium";
                                        priorityLabel = "PRIORIDAD MEDIA";
                                        priorityIcon = "bi bi-info-circle-fill";
                                    }

                                    // Safely assign title to avoid AI leak where it says "MX" when on Guatemala
                                    let priorityTitle =
                                        selectedVideo.video_analysis
                                            ?.estrategia_pepsi_gt
                                            ?.urgencia_reason ||
                                        selectedVideo.video_analysis
                                            ?.urgencia_reason ||
                                        selectedVideo.video_analysis
                                            ?.ejecucion_creativa?.[0]
                                            ?.urgency_reason ||
                                        selectedVideo.video_analysis
                                            ?.origen_analisis ||
                                        selectedVideo.video_analysis?.origen ||
                                        "Oportunidad de Contenido";

                                    if (
                                        selectedVideo.pais === "GT" &&
                                        priorityTitle
                                            .toUpperCase()
                                            .includes("MX")
                                    ) {
                                        priorityTitle =
                                            "DETECCIÓN NATIVA GT (OPORTUNIDAD LOCAL)";
                                    }

                                    priorityTitle =
                                        simplifyAITerms(priorityTitle);

                                    return (
                                        <div className="analysis-layout-v3">
                                            {/* Priority Banner */}
                                            <div
                                                className={`priority-banner ${priorityClass}`}
                                            >
                                                <div className="d-flex align-items-center gap-4">
                                                    <div
                                                        className="priority-score-circle"
                                                        style={{
                                                            color: "inherit",
                                                        }}
                                                    >
                                                        <span className="score-num">
                                                            {score}
                                                        </span>
                                                        <span className="score-label">
                                                            SCORE
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="priority-badge-large">
                                                            {priorityLabel}
                                                            <InfoTooltip text="Puntuación del 1 al 10 generada por IA que mide qué tan urgente y viable es replicar este contenido." />
                                                        </span>
                                                        <h3 className="priority-title">
                                                            {priorityTitle}
                                                        </h3>
                                                    </div>
                                                </div>
                                                <i
                                                    className={`${priorityIcon} fs-1 opacity-25`}
                                                ></i>
                                            </div>

                                            {/* Core Insights Grid */}
                                            {(selectedVideo.video_analysis
                                                ?.diagnostico_viral ||
                                                selectedVideo.video_analysis
                                                    ?.data_points_clave ||
                                                selectedVideo.video_analysis
                                                    ?.hook_type ||
                                                selectedVideo.video_analysis
                                                    ?.hook_explanation ||
                                                selectedVideo.video_analysis
                                                    ?.estrategia_pepsi_gt ||
                                                selectedVideo.video_analysis
                                                    ?.estrategia_pepsi_guatemala) && (
                                                <div className="insight-grid-v3">
                                                    {/* Hook Card */}
                                                    <div className="insight-card-v3">
                                                        <div className="card-header-v3">
                                                            <div className="icon-box-v3 purple">
                                                                <i className="bi bi-magnet-fill"></i>
                                                            </div>
                                                            <div>
                                                                <span className="card-label-v3">
                                                                    Gancho Viral
                                                                    (Hook)
                                                                    <InfoTooltip text="El elemento (visual o sonoro) que atrapa la atención en los primeros 3 segundos del video." />
                                                                </span>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <span className="card-title-v3">
                                                                        {selectedVideo
                                                                            .video_analysis
                                                                            ?.diagnostico_viral
                                                                            ?.hook_type ||
                                                                            (selectedVideo
                                                                                .video_analysis
                                                                                ?.data_points_clave
                                                                                ?.shareability_factor
                                                                                ? "Factor de Compartibilidad"
                                                                                : selectedVideo
                                                                                        .video_analysis
                                                                                        ?.diagnostico_viral
                                                                                        ?.factor_identidad_chapina
                                                                                  ? "Identidad Chapina"
                                                                                  : selectedVideo
                                                                                        .video_analysis
                                                                                        ?.hook_type ||
                                                                                    "Insight Detectado")}
                                                                    </span>
                                                                    {(selectedVideo
                                                                        .video_analysis
                                                                        ?.content_category ||
                                                                        selectedVideo
                                                                            .video_analysis
                                                                            ?.diagnostico_viral
                                                                            ?.factor_identidad_chapina) && (
                                                                        <span
                                                                            className="category-badge-v2"
                                                                            title="Categoría / Identidad Chapina"
                                                                        >
                                                                            {simplifyAITerms(
                                                                                selectedVideo
                                                                                    .video_analysis
                                                                                    ?.content_category ||
                                                                                    (selectedVideo
                                                                                        .video_analysis
                                                                                        ?.diagnostico_viral
                                                                                        ?.factor_identidad_chapina
                                                                                        ? "Orgullo Chapín"
                                                                                        : ""),
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="insight-text m-0">
                                                            {selectedVideo
                                                                .video_analysis
                                                                ?.diagnostico_viral
                                                                ?.explicacion_visual ||
                                                                selectedVideo
                                                                    .video_analysis
                                                                    ?.data_points_clave
                                                                    ?.shareability_factor ||
                                                                selectedVideo
                                                                    .video_analysis
                                                                    ?.diagnostico_viral
                                                                    ?.factor_identidad_chapina ||
                                                                selectedVideo
                                                                    .video_analysis
                                                                    ?.hook_explanation ||
                                                                selectedVideo
                                                                    .video_analysis
                                                                    ?.diagnostico_viral
                                                                    ?.identidad_chapina ||
                                                                selectedVideo
                                                                    .video_analysis
                                                                    ?.estrategia_pepsi_gt
                                                                    ?.interes_marca_detallado ||
                                                                selectedVideo
                                                                    .video_analysis
                                                                    ?.estrategia_pepsi_guatemala
                                                                    ?.interes_marca_detallado ||
                                                                "Analizando impacto visual..."}
                                                        </p>
                                                    </div>

                                                    {/* Viral Factors Card */}
                                                    <div className="insight-card-v3">
                                                        <div className="card-header-v3">
                                                            <div className="icon-box-v3 orange">
                                                                <i className="bi bi-lightning-charge-fill"></i>
                                                            </div>
                                                            <div>
                                                                <span className="card-label-v3">
                                                                    Factores
                                                                    Biométricos
                                                                    / Virales
                                                                    <InfoTooltip text="Estímulos humanos naturales (caras, voces, emociones) que retienen a los usuarios viéndolo." />
                                                                </span>
                                                                <span className="card-title-v3">
                                                                    Drivers de
                                                                    Atención
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {selectedVideo
                                                            .video_analysis
                                                            ?.data_points_clave
                                                            ?.potencial_audio ||
                                                        selectedVideo
                                                            .video_analysis
                                                            ?.diagnostico_viral
                                                            ?.potencial_audio_local ||
                                                        selectedVideo
                                                            .video_analysis
                                                            ?.estrategia_pepsi_gt
                                                            ?.insight_chapin ||
                                                        selectedVideo
                                                            .video_analysis
                                                            ?.estrategia_pepsi_guatemala
                                                            ?.insight_chapin ? (
                                                            <p className="insight-text mt-2 mb-0">
                                                                {selectedVideo
                                                                    .video_analysis
                                                                    ?.data_points_clave
                                                                    ?.potencial_audio ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.diagnostico_viral
                                                                        ?.potencial_audio_local ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.estrategia_pepsi_gt
                                                                        ?.insight_chapin ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.estrategia_pepsi_guatemala
                                                                        ?.insight_chapin ||
                                                                    "Evaluando estímulos de atención..."}
                                                            </p>
                                                        ) : (
                                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                                {(
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.diagnostico_viral
                                                                        ?.factores_exito ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.diagnostico_viral
                                                                        ?.virality_factors ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.virality_factors ||
                                                                    []
                                                                ).map(
                                                                    (f, i) => (
                                                                        <div
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="virality-pill"
                                                                        >
                                                                            {f}
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Pepsi strategy Section */}
                                            {(selectedVideo.video_analysis
                                                ?.estrategia_pepsi_gt ||
                                                selectedVideo.video_analysis
                                                    ?.estrategia_pepsi_guatemala ||
                                                selectedVideo.video_analysis
                                                    ?.diagnostico_viral) && (
                                                <div className="strategy-block-v3">
                                                    <div className="card-label-v3 mb-4 text-info">
                                                        Análisis Estratégico
                                                        Local
                                                        <InfoTooltip text="Evaluación de cómo este video conecta emocional o culturalmente con la audiencia de nuestro país." />
                                                    </div>
                                                    <div className="row g-4">
                                                        <div className="col-md-6 border-end border-secondary-subtle opacity-75">
                                                            <span className="insight-label text-secondary">
                                                                Insight Local /
                                                                Interés
                                                                <InfoTooltip text="La creencia, costumbre o gusto específico de los usuarios locales que el video logró detonar." />
                                                            </span>
                                                            <p
                                                                className="insight-text mt-2 mb-0"
                                                                style={{
                                                                    color: "#334155",
                                                                }}
                                                            >
                                                                {selectedVideo
                                                                    .video_analysis
                                                                    ?.estrategia_pepsi_gt
                                                                    ?.interes_marca_detallado ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.estrategia_pepsi_gt
                                                                        ?.interes_marca ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.estrategia_pepsi_guatemala
                                                                        ?.interes_marca_detallado ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.estrategia_pepsi_guatemala
                                                                        ?.insight_local ||
                                                                    "Insight no explorado"}
                                                            </p>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <span className="insight-label text-secondary">
                                                                Idea de
                                                                Activación
                                                                <InfoTooltip text="Cómo podríamos llevar la esencia de este video a una promoción o campaña publicitaria real para la marca." />
                                                            </span>
                                                            <p
                                                                className="insight-text mt-2 mb-0"
                                                                style={{
                                                                    color: "#334155",
                                                                }}
                                                            >
                                                                {selectedVideo
                                                                    .video_analysis
                                                                    ?.estrategia_pepsi_gt
                                                                    ?.insight_chapin ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.estrategia_pepsi_gt
                                                                        ?.potencial_creador ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.estrategia_pepsi_guatemala
                                                                        ?.insight_chapin ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.estrategia_pepsi_gt
                                                                        ?.idea_activacion ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.estrategia_pepsi_gt
                                                                        ?.idea_activacion_local ||
                                                                    selectedVideo
                                                                        .video_analysis
                                                                        ?.estrategia_pepsi_guatemala
                                                                        ?.idea_táctica ||
                                                                    "Idea de activación no disponible"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Influencer Profile Card */}
                                            {selectedVideo.video_analysis
                                                ?.influencer_data && (
                                                <div className="influencer-card-v3">
                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className="icon-box-v3 green">
                                                                <i className="bi bi-person-check-fill"></i>
                                                            </div>
                                                            <span className="card-title-v3">
                                                                Perfil de
                                                                Influenciador
                                                                <InfoTooltip text="Análisis del perfil del creador si deseamos contratarlo para campañas formales." />
                                                            </span>
                                                        </div>
                                                        <span className="influencer-badge-v3">
                                                            POTENCIAL:{" "}
                                                            {selectedVideo
                                                                .video_analysis
                                                                .influencer_data
                                                                ?.potencial_puntuacion ||
                                                                "N/A"}
                                                            /10
                                                        </span>
                                                    </div>
                                                    <div className="row g-4">
                                                        <div className="col-md-5">
                                                            <span className="influencer-detail-label">
                                                                Sugerencia de
                                                                Casting
                                                                <InfoTooltip text="El tipo de personalidad o características que debe tener el creador para que este contenido funcione." />
                                                            </span>
                                                            <div className="influencer-detail-value">
                                                                {selectedVideo
                                                                    .video_analysis
                                                                    .influencer_data
                                                                    ?.perfil_sugerido ||
                                                                    "Sin perfil sugerido"}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-7 border-start border-secondary-subtle">
                                                            <span className="influencer-detail-label">
                                                                Estrategia de
                                                                Colaboración
                                                                <InfoTooltip text="La forma recomendada de trabajar con este creador: desde menciones directas hasta co-creación de retos." />
                                                            </span>
                                                            <div className="influencer-detail-value">
                                                                {selectedVideo
                                                                    .video_analysis
                                                                    .influencer_data
                                                                    ?.estrategia_colaboracion ||
                                                                    "Sin estrategia descrita"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Replication Ideas Section */}
                                            <div className="section-divider mt-2">
                                                <span>
                                                    IDEAS DE REPLICACIÓN
                                                    <InfoTooltip text="Maneras efectivas de copiar el formato de este trend o video, pero adaptado para nuestras marcas en el país." />
                                                </span>
                                            </div>
                                            <div className="replication-grid-v3">
                                                {(
                                                    selectedVideo.video_analysis
                                                        ?.ejecucion_creativa ||
                                                    selectedVideo.video_analysis
                                                        ?.replication_ideas ||
                                                    []
                                                ).map((idea, i) => (
                                                    <div
                                                        key={i}
                                                        className="replication-item-v3"
                                                    >
                                                        <div className="item-meta-v3">
                                                            <span>
                                                                {simplifyAITerms(
                                                                    idea.tipo ||
                                                                        idea.enfoque ||
                                                                        `CONCEPTO # ${i + 1}`,
                                                                )}
                                                            </span>
                                                            <div className="d-flex align-items-center gap-3">
                                                                <span>
                                                                    <i className="bi bi-clock"></i>{" "}
                                                                    {idea.duration_seconds ||
                                                                        "15"}
                                                                    s
                                                                    <InfoTooltip text="Duración estimada recomendada para la ejecución de este formato de video." />
                                                                </span>
                                                                {idea.urgency_score && (
                                                                    <Badge
                                                                        bg="warning"
                                                                        text="dark"
                                                                        className="rounded-pill px-2 opacity-75"
                                                                        style={{
                                                                            fontSize:
                                                                                "0.6rem",
                                                                            fontWeight: 700,
                                                                        }}
                                                                    >
                                                                        SCORE:{" "}
                                                                        {
                                                                            idea.urgency_score
                                                                        }
                                                                    </Badge>
                                                                )}
                                                                {idea.urgency_score && (
                                                                    <InfoTooltip text="Nivel de urgencia: qué tan rápido deberíamos aprovechar este trend antes de que pierda fuerza." />
                                                                )}
                                                            </div>
                                                        </div>
                                                        <h6 className="fw-bold text-dark mb-2">
                                                            {idea.title}
                                                        </h6>
                                                        <p className="small text-secondary m-0">
                                                            "
                                                            {idea.approach ||
                                                                idea.idea_activacion_detallada}
                                                            "
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center py-5">
                                    <div className="ai-empty-state">
                                        <i className="bi bi-cpu fs-1 mb-4"></i>
                                        <h5>Arquitectura AI Lista</h5>
                                        <p>
                                            Selecciona un vídeo del feed para
                                            iniciar el despliegue del análisis
                                            estratégico.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Modal
                show={showInfoModal}
                onHide={() => setShowInfoModal(false)}
                centered
                fullscreen={true}
                className="pepsi-info-modal"
            >
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="d-flex align-items-center gap-2">
                        <i className="bi bi-info-circle text-info"></i>
                        Detalles del Video
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    {selectedVideo && (
                        <div className="modal-fullscreen-container">
                            {/* LEFT PANEL: MAIN DASHBOARD */}
                            <div className="modal-data-dashboard">
                                {/* TOP BLOCK: Identity + Meta Integration */}
                                <div className="modal-top-identity-block">
                                    <div className="cover-wrapper-compact">
                                        <img
                                            src={
                                                selectedVideo.video_data
                                                    ?.cover ||
                                                "https://placehold.co/150x200/111827/38bdf8?text=No+Cover"
                                            }
                                            alt="Cover"
                                        />
                                    </div>
                                    <div className="identity-info-group">
                                        {(() => {
                                            const rawTitle =
                                                selectedVideo.video_data
                                                    ?.title || "Video original";
                                            // Matches # followed by any word character/letter, including accents
                                            const hashtags =
                                                rawTitle.match(
                                                    /#[\p{L}0-9_]+/gu,
                                                ) || [];
                                            const cleanTitle =
                                                rawTitle
                                                    .replace(
                                                        /#[\p{L}0-9_]+/gu,
                                                        "",
                                                    )
                                                    .trim() || "Video original";

                                            return (
                                                <>
                                                    <h1
                                                        className="id-title-fs"
                                                        title={cleanTitle}
                                                    >
                                                        {cleanTitle}
                                                    </h1>
                                                    {hashtags.length > 0 && (
                                                        <div className="hashtag-ribbon">
                                                            {hashtags
                                                                .slice(0, 10)
                                                                .map(
                                                                    (
                                                                        tag,
                                                                        i,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="hashtag-pill-v2"
                                                                            title={
                                                                                tag
                                                                            }
                                                                        >
                                                                            {
                                                                                tag
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                            {hashtags.length >
                                                                10 && (
                                                                <span
                                                                    className="hashtag-pill-v2 fallback"
                                                                    title={`${hashtags.length - 10} más`}
                                                                >
                                                                    +
                                                                    {hashtags.length -
                                                                        10}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                        <div className="id-author-row">
                                            <span className="nick">
                                                {selectedVideo.video_data
                                                    ?.author_nickname ||
                                                    "Usuario"}
                                            </span>
                                            <span className="user">
                                                @
                                                {selectedVideo.video_data
                                                    ?.author_username ||
                                                    "desconocido"}
                                            </span>
                                        </div>
                                        <div className="meta-tags-row">
                                            <div className="meta-tag-item">
                                                <i className="bi bi-geo-alt"></i>
                                                <span>
                                                    Region:{" "}
                                                    {selectedVideo.video_data
                                                        ?.region || "N/A"}
                                                </span>
                                            </div>
                                            <div className="meta-tag-item">
                                                <i className="bi bi-phone"></i>
                                                <span>
                                                    Platform:{" "}
                                                    {(
                                                        selectedVideo.video_data
                                                            ?.platform ||
                                                        "Desconocida"
                                                    ).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="action-button-group">
                                        {selectedVideo.video_data?.url ? (
                                            <a
                                                href={
                                                    selectedVideo.video_data.url
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn-premium-link"
                                            >
                                                <i className="bi bi-tiktok"></i>
                                                VER ORIGINAL
                                                <i className="bi bi-box-arrow-up-right"></i>
                                            </a>
                                        ) : (
                                            <span
                                                className="btn-premium-link disabled opacity-50"
                                                style={{
                                                    cursor: "not-allowed",
                                                }}
                                            >
                                                <i className="bi bi-tiktok"></i>
                                                NO DISPONIBLE
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* MIDDLE BLOCK: Performance Data */}
                                <div className="stats-grid-v2">
                                    {[
                                        {
                                            label: "Vistas",
                                            value: formatNumber(
                                                selectedVideo.video_data
                                                    ?.play_count,
                                            ),
                                        },
                                        {
                                            label: "Likes",
                                            value: formatNumber(
                                                selectedVideo.video_data
                                                    ?.digg_count ||
                                                    selectedVideo.video_data
                                                        ?.like_count,
                                            ),
                                        },
                                        {
                                            label: "Comments",
                                            value: formatNumber(
                                                selectedVideo.video_data
                                                    ?.comment_count,
                                            ),
                                        },
                                        {
                                            label: "Shares",
                                            value: formatNumber(
                                                selectedVideo.video_data
                                                    ?.share_count,
                                            ),
                                        },
                                        {
                                            label: "Engagement",
                                            value: `${((selectedVideo.video_data?.engagement_rate || 0) * 100).toFixed(2)}%`,
                                        },
                                        {
                                            label: "Downloads",
                                            value: formatNumber(
                                                selectedVideo.video_data
                                                    ?.download_count,
                                            ),
                                        },
                                    ].map((stat, i) => (
                                        <div key={i} className="stat-box-v2">
                                            <span className="stat-v-v2">
                                                {stat.value}
                                            </span>
                                            <span className="stat-l-v2">
                                                {stat.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT PANEL: TECHNICAL CONSOLE */}
                            <div className="tech-spec-panel">
                                <div className="panel-title-v2">
                                    <i className="bi bi-cpu"></i>
                                    <span>TECHNICAL ARCHITECTURE</span>
                                </div>
                                <div className="tech-items-container">
                                    {Object.entries(
                                        selectedVideo.video_data,
                                    ).map(([key, value]) => {
                                        const skipFields = [
                                            "cover",
                                            "title",
                                            "url",
                                            "play_count",
                                            "digg_count",
                                            "comment_count",
                                            "share_count",
                                            "download_count",
                                            "author_nickname",
                                            "author_username",
                                            "region",
                                            "platform",
                                        ];

                                        // Explicitly handle music info object
                                        if (
                                            key === "music_info" &&
                                            value &&
                                            typeof value === "object"
                                        ) {
                                            return (
                                                <div
                                                    className="tech-pair-v2 tech-pair-long"
                                                    key={key}
                                                >
                                                    <span className="pair-key">
                                                        Música Detallada
                                                    </span>
                                                    <span className="pair-val d-flex flex-column gap-1">
                                                        <span className="fw-bold text-dark">
                                                            {value.title ||
                                                                "Desconocida"}
                                                        </span>
                                                        <span className="small text-secondary">
                                                            Autor:{" "}
                                                            {value.author ||
                                                                "N/A"}
                                                        </span>
                                                        <span
                                                            className="text-muted"
                                                            style={{
                                                                fontSize:
                                                                    "0.6rem",
                                                            }}
                                                        >
                                                            ID Audio:{" "}
                                                            {value.id || "N/A"}
                                                        </span>
                                                    </span>
                                                </div>
                                            );
                                        }

                                        if (
                                            skipFields.includes(key) ||
                                            (typeof value === "object" &&
                                                value !== null)
                                        )
                                            return null;

                                        return (
                                            <div
                                                className={`tech-pair-v2 ${String(value).length > 80 ? "tech-pair-long" : ""}`}
                                                key={key}
                                            >
                                                <span className="pair-key">
                                                    {(key &&
                                                    typeof key === "string"
                                                        ? key
                                                        : String(key || "")
                                                    ).replace(/_/g, " ")}
                                                </span>
                                                <span className="pair-val">
                                                    {value === null ||
                                                    value === undefined
                                                        ? "N/A"
                                                        : key ===
                                                            "engagement_rate"
                                                          ? `${(Number(value) * 100).toFixed(2)}%`
                                                          : formatTechValue(
                                                                key,
                                                                value,
                                                            )}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default VideoAnalysisPage;
