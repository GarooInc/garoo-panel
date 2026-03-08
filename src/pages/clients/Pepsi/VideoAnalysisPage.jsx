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
        const viral = videoData.filter(v => (v.video_data.viral_tier === 'mega_viral' || v.video_analysis.urgency_score >= 8)).length;

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
            const score = item.video_analysis?.urgency_score || 0;
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
                            {selectedVideo ? (
                                <div className="analysis-layout-grid">
                                    {/* Scan Line Effect Overlay */}
                                    <div className="ai-scan-line"></div>

                                    {/* Top Row: Hook & Viral Factors */}
                                    <div className="analysis-section-main">
                                        <div className="analysis-glass-card hook-card">
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <div className="insight-icon purple">
                                                    <i className="bi bi-magnet-fill"></i>
                                                </div>
                                                <div>
                                                    <span className="insight-label">Gancho Viral (Hook)</span>
                                                    <h5 className="mb-0 fw-bold text-white">{selectedVideo.video_analysis.hook_type}</h5>
                                                </div>
                                            </div>
                                            <p className="insight-text">
                                                {selectedVideo.video_analysis.hook_explanation}
                                            </p>
                                        </div>

                                        <div className="analysis-glass-card factors-card">
                                            <div className="d-flex align-items-center gap-2 mb-3">
                                                <div className="insight-icon yellow">
                                                    <i className="bi bi-lightning-charge-fill"></i>
                                                </div>
                                                <span className="insight-label">Drivers de Viralidad</span>
                                            </div>
                                            <div className="d-flex flex-wrap gap-2">
                                                {selectedVideo.video_analysis.virality_factors.map((f, i) => (
                                                    <div key={i} className="virality-pill">
                                                        {f}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Score Meter & Urgency */}
                                    <div className="analysis-section-side">
                                        <div className="urgency-score-block">
                                            <div className="score-meter">
                                                <svg viewBox="0 0 36 36" className="circular-chart">
                                                    <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                    <path className={`circle ${selectedVideo.video_analysis.urgency_score > 7 ? 'danger' : 'warning'}`}
                                                        strokeDasharray={`${selectedVideo.video_analysis.urgency_score * 10}, 100`}
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                                    <text x="18" y="20.35" className="percentage">{selectedVideo.video_analysis.urgency_score}</text>
                                                    <text x="18" y="26" className="unit">SCORE</text>
                                                </svg>
                                            </div>
                                            <div className="urgency-details">
                                                <h6 className="urgency-title">Prioridad de Respuesta</h6>
                                                <p className="urgency-reason">
                                                    {selectedVideo.video_analysis.urgency_reason}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom: Replication Strategies */}
                                    <div className="analysis-section-full">
                                        <div className="section-divider">
                                            <span>ESTRATEGIAS COMPETITIVAS</span>
                                        </div>
                                        <div className="row g-3">
                                            {selectedVideo.video_analysis.replication_ideas.map((idea, i) => (
                                                <div key={i} className="col-md-6">
                                                    <div className="strategy-card">
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span className="strategy-tag">IDEA #{i + 1}</span>
                                                            <span className="duration-tag">{idea.duration_seconds}s</span>
                                                        </div>
                                                        <h6 className="strategy-title">{idea.title}</h6>
                                                        <p className="strategy-desc">"{idea.approach}"</p>
                                                        <div className="strategy-footer">
                                                            <i className="bi bi-info-circle me-1"></i> Recomendado para {selectedVideo.video_data.region}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
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
