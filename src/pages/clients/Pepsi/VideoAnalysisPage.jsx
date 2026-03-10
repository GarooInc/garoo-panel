import React, { useState, useEffect, useMemo } from "react";
import {
    Spinner,
    Badge,
    Form,
    Button,
    Modal,
} from "react-bootstrap";
import axios from "axios";
import garooLogo from "../../../assets/img/garoo-logo.png";
import "./VideoAnalysis.css";

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
    const [platformFilter, setPlatformFilter] = useState("all");
    const [scoreFilter, setScoreFilter] = useState("all");
    const [tierFilter, setTierFilter] = useState("all");

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

                if (response.data.status === "success" || response.data.status === "successful") {
                    setVideoData(response.data.data);
                    if (response.data.data.length > 0) {
                        setSelectedVideo(response.data.data[0]);
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

    // Stats calculation
    const stats = useMemo(() => {
        if (!videoData.length) return { totalViews: "0", avgEng: "0%", total: 0, viral: 0 };

        const totalViews = videoData.reduce((acc, curr) => acc + (curr.video_data.play_count || 0), 0);
        const avgEng = videoData.reduce((acc, curr) => acc + (curr.video_data.engagement_rate || 0), 0) / videoData.length;
        const viral = videoData.filter(v => (v.video_data.viral_tier === 'mega_viral' || (v.video_analysis?.estrategia_pepsi_gt?.urgencia_score || v.video_analysis?.urgency_score) >= 8)).length;

        const formatViews = (n) => {
            if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
            if (n >= 1000) return (n / 1000).toFixed(1) + "K";
            return n;
        };

        return {
            totalViews: formatViews(totalViews),
            avgEng: (avgEng * 100).toFixed(1) + "%",
            total: videoData.length,
            viral: viral
        };
    }, [videoData]);

    // Filtered Video Data
    const filteredVideoData = useMemo(() => {
        return videoData.filter((item) => {
            const matchesPlatform = platformFilter === "all" || item.video_data.platform === platformFilter;
            const matchesTier = tierFilter === "all" || item.video_data.viral_tier === tierFilter;

            let matchesScore = true;
            const score = item.video_analysis?.estrategia_pepsi_gt?.urgencia_score || item.video_analysis?.urgency_score || 0;
            if (scoreFilter === "high") matchesScore = score >= 8;
            else if (scoreFilter === "medium") matchesScore = score >= 5 && score < 8;
            else if (scoreFilter === "low") matchesScore = score < 5;

            return matchesPlatform && matchesTier && matchesScore;
        });
    }, [videoData, platformFilter, tierFilter, scoreFilter]);

    // Unique filter options
    const filterOptions = useMemo(() => {
        const platforms = ["all", ...new Set(videoData.map(v => v.video_data.platform))];
        const tiers = ["all", ...new Set(videoData.map(v => v.video_data.viral_tier))];
        return { platforms, tiers };
    }, [videoData]);

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
        if (num >= 1000) return (num / 1000).toFixed(1) + "K";
        return num;
    };

    const formatTechValue = (key, value) => {
        if (!value && value !== 0) return "N/A";

        if (key === 'age_hours') {
            const h = parseFloat(value);
            if (h < 24) return `${h.toFixed(1)}h`;
            const d = Math.floor(h / 24);
            const remainingH = Math.round(h % 24);
            return `${d}d ${remainingH}h`;
        }

        if (key === 'create_time') {
            const date = new Date(value * 1000);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        if (key === 'detected_at') {
            const date = new Date(value);
            return date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        return String(value);
    };

    return (
        <div className="pepsi-root">
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
                        <h1 className="pepsi-topbar-title" style={{ fontSize: '1.1rem', marginBottom: '2px' }}>Garoo Portal</h1>
                        <div className="d-flex align-items-center gap-2">
                            <span className="pepsi-modulo-label" style={{ fontSize: '.6rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.05em' }}>Módulo:</span>
                            <span style={{ fontSize: '.65rem', fontWeight: 800, color: '#f1f5f9' }}>Gestor de Videos</span>
                        </div>
                    </div>
                </div>

                <div className="pepsi-divider ms-2 me-2" />
                <span className="pepsi-pill">Pepsi</span>

                <div className="pepsi-spacer" />

                {/* Date Filter in Header */}
                <div className="d-flex align-items-center gap-2">
                    <span className="pepsi-modulo-label" style={{ marginBottom: 0 }}>Fecha:</span>
                    {loadingDates ? (
                        <Spinner animation="border" size="sm" variant="primary" />
                    ) : (
                        <Form.Select
                            size="sm"
                            className="pepsi-date-select"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{ width: '140px' }}
                        >
                            {availableDates.map(date => (
                                <option key={date} value={date}>{date}</option>
                            ))}
                        </Form.Select>
                    )}
                </div>
            </header>

            <main className="pepsi-body">
                {/* Filters Row - Replaced stats row */}
                <div className="pepsi-filter-bar mb-3">
                    <div className="row g-2">
                        <div className="col-6 col-md-3">
                            <Form.Select
                                size="sm"
                                className="pepsi-select-filter"
                                value={platformFilter}
                                onChange={(e) => setPlatformFilter(e.target.value)}
                            >
                                <option value="all">Plataforma</option>
                                {filterOptions.platforms.filter(p => p !== 'all').map(p => (
                                    <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                ))}
                            </Form.Select>
                        </div>
                        <div className="col-6 col-md-3">
                            <Form.Select
                                size="sm"
                                className="pepsi-select-filter"
                                value={scoreFilter}
                                onChange={(e) => setScoreFilter(e.target.value)}
                            >
                                <option value="all">Score Estratégico</option>
                                <option value="high">Alto (8-10)</option>
                                <option value="medium">Medio (5-7)</option>
                                <option value="low">Bajo (0-4)</option>
                            </Form.Select>
                        </div>
                        <div className="col-6 col-md-3">
                            <Form.Select
                                size="sm"
                                className="pepsi-select-filter"
                                value={tierFilter}
                                onChange={(e) => setTierFilter(e.target.value)}
                            >
                                <option value="all">Tier Viral</option>
                                {filterOptions.tiers.filter(t => t !== 'all').map(t => (
                                    <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
                                ))}
                            </Form.Select>
                        </div>
                        <div className="col-6 col-md-3 d-flex align-items-center justify-content-end">
                            <span className="pepsi-results-count">
                                {filteredVideoData.length} resultados
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Shells */}
                <div className="pepsi-content-wrapper">
                    {/* Left Panel: Video List (Narrowed) */}
                    <div className="pepsi-shell" style={{ maxWidth: '420px' }}>
                        <div className="pepsi-shell-header d-flex align-items-center justify-content-between">
                            <span className="pepsi-shell-title">
                                <i className="bi bi-collection-play text-primary"></i>
                                Feed
                            </span>
                            <div style={{ width: '180px' }}>
                                <span className="pepsi-badge-total-day shadow-sm">
                                    <i className="bi bi-lightning-fill"></i>
                                    {videoData.length} VÍDEOS HOY
                                </span>
                            </div>
                        </div>
                        <div className="pepsi-scroll-area">
                            {loadingVideos ? (
                                <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3 opacity-50">
                                    <div className="pepsi-loader-simple"></div>
                                    <span className="small fw-medium">Sincronizando...</span>
                                </div>
                            ) : filteredVideoData.length > 0 ? (
                                filteredVideoData.map((item) => (
                                    <div
                                        key={item._id?.$oid || item._id}
                                        className={`video-row d-flex align-items-center gap-3 ${selectedVideo?._id === item._id ? 'selected-video' : ''}`}
                                        onClick={() => setSelectedVideo(item)}
                                    >
                                        <div className="video-preview-wrapper shadow">
                                            <img src={item.video_data.cover} alt="thumbnail" />
                                            <div className="platform-tag">
                                                <i className={`bi bi-${item.video_data.platform}`}></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 video-info">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <Badge bg={item.video_data.viral_tier === 'mega_viral' ? 'danger' : 'primary'} className="rounded-pill px-2" style={{ fontSize: '.55rem' }}>
                                                    {item.video_data.viral_tier.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </div>
                                            <h6 className="mb-1 text-truncate" style={{ maxWidth: '240px' }}>{item.video_data.title || 'Contenido viral'}</h6>
                                            <div className="video-info-sub d-flex gap-2">
                                                <span className="text-info fw-bold">@{item.video_data.author_username}</span>
                                                <span>•</span>
                                                <span>{formatNumber(item.video_data.play_count)} vistas</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-5 opacity-25">
                                    <i className="bi bi-camera-video-off fs-1 mb-2"></i>
                                    <p className="small">Sin datos</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Strategic Analysis (Main Focus) */}
                    <div className="pepsi-shell main-focus-shell">
                        <div className="pepsi-shell-header">
                            <span className="pepsi-shell-title">
                                <i className="bi bi-cpu-fill text-info"></i>
                                Inteligencia Estratégica AI
                            </span>
                            {selectedVideo && (
                                <div className="d-flex align-items-center gap-3">
                                    <div className="ai-status">
                                        <span className="ai-dot active"></span>
                                        NÚCLEO ACTIVO
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            className="rounded-pill px-3 py-1"
                                            style={{ fontSize: '.7rem', fontWeight: 700 }}
                                            onClick={() => setShowInfoModal(true)}
                                        >
                                            VER INFO <i className="bi bi-info-circle ms-1"></i>
                                        </Button>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="rounded-pill px-3 py-1"
                                            style={{ fontSize: '.7rem', fontWeight: 700 }}
                                            href={selectedVideo.video_data.url}
                                            target="_blank"
                                        >
                                            VER VÍDEO <i className="bi bi-box-arrow-up-right ms-1"></i>
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="pepsi-scroll-area analysis-stage">
                            {selectedVideo ? (() => {
                                // Priority calculation for UI states
                                const score = selectedVideo.video_analysis?.estrategia_pepsi_gt?.urgencia_score || selectedVideo.video_analysis?.urgencia_score || 0;
                                let priorityClass = "low";
                                let priorityLabel = "Prioridad Baja";
                                let priorityIcon = "bi bi-check-circle-fill";

                                if (score >= 9) {
                                    priorityClass = "critical";
                                    priorityLabel = "PRIORIDAD CRÍTICA / INMEDIATA";
                                    priorityIcon = "bi bi-exclamation-octagon-fill";
                                } else if (score >= 7) {
                                    priorityClass = "high";
                                    priorityLabel = "PRIORIDAD ALTA";
                                    priorityIcon = "bi bi-lightning-fill";
                                } else if (score >= 5) {
                                    priorityClass = "medium";
                                    priorityLabel = "PRIORIDAD MEDIA";
                                    priorityIcon = "bi bi-info-circle-fill";
                                }

                                return (
                                    <div className="analysis-layout-v3">
                                        {/* Priority Banner */}
                                        <div className={`priority-banner ${priorityClass}`}>
                                            <div className="d-flex align-items-center gap-4">
                                                <div className="priority-score-circle" style={{ color: 'inherit' }}>
                                                    <span className="score-num">{score}</span>
                                                    <span className="score-label">SCORE</span>
                                                </div>
                                                <div>
                                                    <span className="priority-badge-large">{priorityLabel}</span>
                                                    <h3 className="priority-title">
                                                        {selectedVideo.video_analysis?.estrategia_pepsi_gt?.urgencia_reason || selectedVideo.video_analysis?.urgencia_reason}
                                                    </h3>
                                                </div>
                                            </div>
                                            <i className={`${priorityIcon} fs-1 opacity-25`}></i>
                                        </div>

                                        {/* Core Insights Grid */}
                                        <div className="insight-grid-v3">
                                            {/* Hook Card */}
                                            <div className="insight-card-v3">
                                                <div className="card-header-v3">
                                                    <div className="icon-box-v3 purple"><i className="bi bi-magnet-fill"></i></div>
                                                    <div>
                                                        <span className="card-label-v3">Gancho Viral (Hook)</span>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className="card-title-v3">{selectedVideo.video_analysis.hook_type}</span>
                                                            {selectedVideo.video_analysis.content_category && (
                                                                <span className="category-badge-v2">{selectedVideo.video_analysis.content_category}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="insight-text m-0">{selectedVideo.video_analysis.hook_explanation}</p>
                                            </div>

                                            {/* Viral Factors Card */}
                                            <div className="insight-card-v3">
                                                <div className="card-header-v3">
                                                    <div className="icon-box-v3 orange"><i className="bi bi-lightning-charge-fill"></i></div>
                                                    <div>
                                                        <span className="card-label-v3">Factores Biométricos / Virales</span>
                                                        <span className="card-title-v3">Drivers de Atención</span>
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-wrap gap-2 mt-2">
                                                    {selectedVideo.video_analysis.virality_factors.map((f, i) => (
                                                        <div key={i} className="virality-pill">{f}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pepsi strategy Section */}
                                        {selectedVideo.video_analysis?.estrategia_pepsi_gt && (
                                            <div className="strategy-block-v3">
                                                <div className="card-label-v3 mb-4 text-info">Análisis Estratégico Local</div>
                                                <div className="row g-4">
                                                    <div className="col-md-6 border-end border-white-5 opacity-75">
                                                        <span className="insight-label text-white-50">Interés de Marca</span>
                                                        <p className="insight-text mt-2 mb-0" style={{ color: '#f1f5f9' }}>
                                                            {selectedVideo.video_analysis.estrategia_pepsi_gt.interes_marca}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <span className="insight-label text-white-50">Idea de Activación Pepsi</span>
                                                        <p className="insight-text mt-2 mb-0" style={{ color: '#f1f5f9' }}>
                                                            {selectedVideo.video_analysis.estrategia_pepsi_gt.idea_activacion}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Influencer Profile Card */}
                                        {selectedVideo.video_analysis?.influencer_data && (
                                            <div className="influencer-card-v3">
                                                <div className="d-flex justify-content-between align-items-center mb-4">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="icon-box-v3 green"><i className="bi bi-person-check-fill"></i></div>
                                                        <span className="card-title-v3">Perfil de Influenciador</span>
                                                    </div>
                                                    <span className="influencer-badge-v3">POTENCIAL: {selectedVideo.video_analysis.influencer_data.potencial_puntuacion}/10</span>
                                                </div>
                                                <div className="row g-4">
                                                    <div className="col-md-5">
                                                        <span className="influencer-detail-label">Sugerencia de Casting</span>
                                                        <div className="influencer-detail-value">{selectedVideo.video_analysis.influencer_data.perfil_sugerido}</div>
                                                    </div>
                                                    <div className="col-md-7 border-start border-white-5">
                                                        <span className="influencer-detail-label">Estrategia de Colaboración</span>
                                                        <div className="influencer-detail-value">{selectedVideo.video_analysis.influencer_data.estrategia_colaboracion}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Replication Ideas Section */}
                                        <div className="section-divider mt-2">
                                            <span>IDEAS DE REPLICACIÓN</span>
                                        </div>
                                        <div className="replication-grid-v3">
                                            {selectedVideo.video_analysis.replication_ideas.map((idea, i) => (
                                                <div key={i} className="replication-item-v3">
                                                    <div className="item-meta-v3">
                                                        <span>CONCEPTO #{i + 1}</span>
                                                        <span><i className="bi bi-clock"></i> {idea.duration_seconds}s</span>
                                                    </div>
                                                    <h6 className="fw-bold text-white mb-2">{idea.title}</h6>
                                                    <p className="small text-white-50 m-0">"{idea.approach}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })() : (
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center py-5">
                                    <div className="ai-empty-state">
                                        <i className="bi bi-cpu fs-1 mb-4"></i>
                                        <h5>Arquitectura AI Lista</h5>
                                        <p>Selecciona un vídeo del feed para iniciar el despliegue del análisis estratégico.</p>
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
                <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
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
                                        <img src={selectedVideo.video_data.cover} alt="Cover" />
                                    </div>
                                    <div className="identity-info-group">
                                        <h1 className="id-title-fs">{selectedVideo.video_data.title}</h1>
                                        <div className="id-author-row">
                                            <span className="nick">{selectedVideo.video_data.author_nickname}</span>
                                            <span className="user">@{selectedVideo.video_data.author_username}</span>
                                        </div>
                                        <div className="meta-tags-row">
                                            <div className="meta-tag-item">
                                                <i className="bi bi-geo-alt"></i>
                                                <span>Region: {selectedVideo.video_data.region}</span>
                                            </div>
                                            <div className="meta-tag-item">
                                                <i className="bi bi-phone"></i>
                                                <span>Platform: {selectedVideo.video_data.platform.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="action-button-group">
                                        <a href={selectedVideo.video_data.url} target="_blank" rel="noreferrer" className="btn-premium-link">
                                            <i className="bi bi-tiktok"></i>
                                            VER ORIGINAL
                                            <i className="bi bi-box-arrow-up-right"></i>
                                        </a>
                                    </div>
                                </div>

                                {/* MIDDLE BLOCK: Performance Data */}
                                <div className="stats-grid-v2">
                                    {[
                                        { label: 'Vistas', value: formatNumber(selectedVideo.video_data.play_count) },
                                        { label: 'Likes', value: formatNumber(selectedVideo.video_data.digg_count) },
                                        { label: 'Comments', value: formatNumber(selectedVideo.video_data.comment_count) },
                                        { label: 'Shares', value: formatNumber(selectedVideo.video_data.share_count || 0) },
                                        { label: 'Engagement', value: `${(selectedVideo.video_data.engagement_rate * 100).toFixed(2)}%` },
                                        { label: 'Downloads', value: formatNumber(selectedVideo.video_data.download_count || 0) }
                                    ].map((stat, i) => (
                                        <div key={i} className="stat-box-v2">
                                            <span className="stat-v-v2">{stat.value}</span>
                                            <span className="stat-l-v2">{stat.label}</span>
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
                                    {Object.entries(selectedVideo.video_data).map(([key, value]) => {
                                        const skipFields = ['cover', 'title', 'url', 'play_count', 'digg_count', 'comment_count', 'share_count', 'download_count', 'author_nickname', 'author_username', 'engagement_rate', 'region', 'platform'];
                                        if (skipFields.includes(key) || typeof value === 'object') return null;
                                        return (
                                            <div className="tech-pair-v2" key={key}>
                                                <span className="pair-key">{key.replace(/_/g, ' ')}</span>
                                                <span className="pair-val">{formatTechValue(key, value)}</span>
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
