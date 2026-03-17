import React, { useState, useEffect, useMemo } from "react";
import { Badge, Form, Spinner } from "react-bootstrap";
import { redtecInstance } from "../../../api/axios";

/**
 * PEPSI VIRAL SCOUT - RECONSTRUCTION V5 (ULTRA-PREMIUM FIX)
 * Focused on: Perfect Alignment, High-Contrast Branding, Zero Gaps.
 */

const VideoAnalysisPage = () => {
    const [availableDates, setAvailableDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [videoData, setVideoData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState("MX");
    const [activeTab, setActiveTab] = useState("ai");

    useEffect(() => {
        (async () => {
            try {
                const res = await redtecInstance.get("video-dates");
                const dates = (res.data.dates || []).map(d => d._id).filter(Boolean);
                if (dates.length > 0) {
                    setAvailableDates(dates);
                    setSelectedDate(dates[0]);
                } else {
                    const today = new Date().toISOString().split("T")[0];
                    setAvailableDates([today]);
                    setSelectedDate(today);
                }
            } catch {
                const today = new Date().toISOString().split("T")[0];
                setAvailableDates([today]);
                setSelectedDate(today);
            }
        })();
    }, []);

    useEffect(() => {
        if (!selectedDate) return;
        (async () => {
            try {
                setLoading(true);
                const res = await redtecInstance.post("videos", { fecha: selectedDate });
                let data = res.data.data || res.data;
                if (Array.isArray(data) && data.length > 0 && data[0].video_list) data = data[0].video_list;
                else if (data && typeof data === 'object' && data.video_list) data = data.video_list;
                const list = Array.isArray(data) ? data : [];
                setVideoData(list);
                if (list.length > 0) {
                    const first = list.find(v => v.pais === country) || list[0];
                    setSelectedId(first._id);
                    setCountry(first.pais);
                } else {
                    setSelectedId(null);
                }
            } catch { 
                setVideoData([]); 
                setSelectedId(null); 
            } finally { 
                setLoading(false); 
            }
        })();
    }, [selectedDate, country]);

    const activeVideo = useMemo(() => videoData.find(v => v._id === selectedId), [videoData, selectedId]);
    const filteredVideos = useMemo(() => videoData.filter(v => v.pais === country), [videoData, country]);

    const formatValue = (num) => {
        if (!num) return "0";
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    };

    return (
        <div className="pepsi-intel-page animate-in">
            <style>{`
                :root {
                    --pep-blue: #005cb4;
                    --pep-red: #ef4444;
                    --pep-dark: #001e38;
                    --pep-gray: #f1f5f9;
                    --pep-border: #e2e8f0;
                    --ps-radius: 24px;
                }

                .pepsi-intel-page {
                    height: calc(100vh - 120px);
                    display: flex;
                    flex-direction: column;
                    padding: 0 1.5rem 1.5rem 1.5rem;
                    color: var(--pep-dark);
                    font-family: 'Inter', sans-serif;
                }

                /* HEADER SECTION */
                .top-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 0;
                }
                .brand-meta h2 { font-weight: 900; letter-spacing: -0.05em; margin: 0; font-size: 1.8rem; line-height: 1; }
                .brand-meta p { color: var(--pep-blue); font-weight: 800; font-size: 0.7rem; letter-spacing: 0.15em; margin: 5px 0 0 0; }

                /* MAIN LAYOUT */
                .intel-layout {
                    flex: 1;
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 1.5rem;
                    overflow: hidden;
                }

                /* SIDEBAR */
                .intel-sidebar {
                    background: white;
                    border: 1px solid var(--pep-border);
                    border-radius: var(--ps-radius);
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                    overflow: hidden;
                }
                .sidebar-head { padding: 1.5rem; border-bottom: 2px solid var(--pep-gray); background: #fafbfc; }
                .video-feed { flex: 1; overflow-y: auto; padding: 1rem; }
                
                .feed-item {
                    display: flex; gap: 12px; padding: 12px; border-radius: 20px;
                    cursor: pointer; transition: all 0.2s; border: 2px solid transparent; margin-bottom: 8px;
                }
                .feed-item:hover { background: var(--pep-gray); }
                .feed-item.active { background: #f0f7ff; border-color: var(--pep-blue); shadow: 0 10px 15px -3px rgba(0,92,180,0.1); }
                .item-thumb { width: 55px; height: 75px; border-radius: 12px; object-fit: cover; flex-shrink: 0; }
                .item-info { min-width: 0; display: flex; flex-direction: column; justify-content: center; }
                .item-info h6 { font-size: 0.8rem; font-weight: 900; margin: 0; line-height: 1.2; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .item-info span { font-size: 0.65rem; color: #64748b; font-weight: 700; margin-top: 4px; }

                /* MAIN STAGE */
                .intel-stage {
                    background: white;
                    border: 1px solid var(--pep-border);
                    border-radius: var(--ps-radius);
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.05);
                    overflow: hidden;
                }

                /* STAGE HEADER WITH TABS */
                .stage-top {
                    padding: 1.5rem 2rem;
                    background: white;
                    border-bottom: 1px solid var(--pep-border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .tab-switcher {
                    display: flex;
                    background: var(--pep-gray);
                    padding: 5px;
                    border-radius: 100px;
                    gap: 5px;
                }
                .tab-btn {
                    border: none;
                    background: transparent;
                    padding: 10px 24px;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 950;
                    color: #94a3b8;
                    transition: all 0.3s;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .tab-btn.active {
                    background: white;
                    color: var(--pep-blue);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }

                /* CONTENT AREA */
                .stage-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 2.5rem;
                }

                .content-grid { display: grid; grid-template-columns: 280px 1fr; gap: 3rem; }
                .video-preview-v5 { 
                    width: 100%; aspect-ratio: 9/16; border-radius: 24px; 
                    overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
                    border: 3px solid white; background: #000;
                }
                .video-preview-v5 img { width: 100%; height: 100%; object-fit: cover; }

                .metric-row-v5 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; }
                .metric-box-v5 { background: var(--pep-gray); padding: 1.75rem; border-radius: 20px; border: 1px solid transparent; transition: all 0.2s; }
                .metric-box-v5:hover { background: #fff; border-color: var(--pep-blue); transform: translateY(-5px); }
                .metric-box-v5 label { display: block; font-size: 0.65rem; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
                .metric-box-v5 strong { font-size: 1.8rem; font-weight: 950; color: var(--pep-dark); letter-spacing: -0.04em; }

                /* IA CARDS */
                .ia-cards-v5 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .ia-card-v5 { 
                    background: white; border: 1.5px solid var(--pep-border); 
                    border-radius: 24px; padding: 2rem; position: relative;
                }
                .ia-card-v5 h5 { font-weight: 950; font-size: 1rem; color: var(--pep-blue); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 12px; }
                .ia-card-v5 h5 i { width: 40px; height: 40px; background: rgba(0,92,180,0.05); border-radius: 12px; display: flex; align-items: center; justify-content: center; }

                .ia-detail-v5 { margin-bottom: 1.5rem; }
                .ia-detail-v5 label { display: block; font-size: 0.65rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px; }
                .ia-detail-v5 p { font-size: 0.95rem; line-height: 1.6; margin: 0; }
                .ia-detail-v5.featured-v5 { background: #f8fafc; padding: 1.25rem; border-radius: 16px; border-left: 5px solid var(--pep-blue); }

                /* ROADMAP STYLING */
                .roadmap-v5 { margin-top: 2rem; }
                .exec-bar-v5 { 
                    background: #fff; border: 1px solid var(--pep-border); 
                    padding: 1.5rem; border-radius: 20px; margin-bottom: 1rem;
                    display: flex; align-items: center; gap: 1.5rem; transition: all 0.3s;
                }
                .exec-bar-v5:hover { transform: scale(1.01); border-color: var(--pep-blue); box-shadow: 0 10px 25px rgba(0,0,0,0.04); }
                .exec-score-v5 { 
                    background: var(--pep-red); color: white; width: 60px; height: 60px; 
                    border-radius: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center;
                    flex-shrink: 0; box-shadow: 0 6px 12px rgba(239, 68, 68, 0.2);
                }
                .exec-score-v5 span { font-size: 0.5rem; font-weight: 800; opacity: 0.8; }
                .exec-score-v5 strong { font-size: 1.4rem; font-weight: 900; }
                .exec-info-v5 { flex: 1; }
                .exec-info-v5 h6 { font-weight: 950; font-size: 1.1rem; margin: 0 0 5px 0; }
                .exec-info-v5 p { font-size: 0.8rem; color: #64748b; margin: 0; line-height: 1.5; }

                /* HELPERS */
                .sl-custom-scroll::-webkit-scrollbar { width: 5px; }
                .sl-custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .uppercase { text-transform: uppercase; }
                .tracking-widest { letter-spacing: 0.2em; }
            `}</style>

            <div className="top-bar">
                <div className="brand-meta">
                    <h2 style={{ color: 'var(--pep-dark)' }}>Radar de <span style={{ color: 'var(--pep-blue)' }}>Tendencias</span></h2>
                </div>

                <div className="d-flex gap-3">
                    <Form.Select 
                        className="rounded-pill border-2 px-4 fw-950 fs-7" 
                        style={{ width: '180px', height: '50px' }} 
                        value={selectedDate} 
                        onChange={e => setSelectedDate(e.target.value)}
                    >
                        {availableDates.map(d => <option key={d} value={d}>{d}</option>)}
                    </Form.Select>
                    
                    <div className="d-flex p-1 bg-white border border-2 rounded-pill shadow-sm">
                        <button 
                            className={`btn-pill-px px-4 ${country === 'MX' ? 'btn-active' : 'btn-ghost'}`} 
                            onClick={() => setCountry('MX')}
                        >MÉXICO</button>
                        <button 
                            className={`btn-pill-px px-4 ${country === 'GT' ? 'btn-active' : 'btn-ghost'}`} 
                            onClick={() => setCountry('GT')}
                        >GUATEMALA</button>
                    </div>
                </div>
            </div>

            <div className="intel-layout">
                <aside className="intel-sidebar">
                    <div className="sidebar-head">
                        <span className="fw-950 fs-xs opacity-50 tracking-widest uppercase">Feed Detectado</span>
                        <Badge bg="primary" className="ms-auto rounded-pill px-3 py-1 fw-900 fs-xxs ms-3">{filteredVideos.length}</Badge>
                    </div>
                    <div className="video-feed sl-custom-scroll">
                        {loading ? (
                            <div className="h-100 d-flex align-items-center justify-content-center">
                                <Spinner animation="border" variant="primary" size="sm" />
                            </div>
                        ) : filteredVideos.map((v, i) => (
                            <div 
                                key={i} 
                                className={`feed-item ${selectedId === v._id ? 'active' : ''}`} 
                                onClick={() => setSelectedId(v._id)}
                            >
                                <img src={v.video_data.cover} className="item-thumb" alt="v" />
                                <div className="item-info">
                                    <h6>{v.video_data.title || `Video Viral ${v.video_data.platform}`}</h6>
                                    <span>@{v.video_data.author_username}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="intel-stage">
                    {activeVideo ? (
                        <>
                            <div className="stage-top">
                                <div className="d-flex align-items-center gap-3">
                                    <img src={activeVideo.video_data.author_avatar} className="rounded-circle border-3 border-white shadow-sm" width="55" height="55" />
                                    <div className="d-flex flex-column">
                                        <h4 className="fw-950 m-0">{activeVideo.video_data.author_nickname}</h4>
                                        <div className="d-flex gap-2 align-items-center mt-1">
                                            <Badge bg="primary" className="fw-950 fs-xxs rounded-pill px-2">{activeVideo.video_data.viral_tier.toUpperCase()}</Badge>
                                            {activeVideo.video_analysis.origen_analisis && (
                                                <Badge bg="light" className="text-dark border fw-900 fs-xxs rounded-pill px-2">
                                                    <i className="bi bi-shuffle me-1"></i> {activeVideo.video_analysis.origen_analisis}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-switcher">
                                    <button 
                                        className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('ai')}
                                    >Análisis IA</button>
                                    <button 
                                        className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('video')}
                                    >Contenido</button>
                                </div>
                            </div>

                            <div className="stage-content sl-custom-scroll">
                                {activeTab === 'video' ? (
                                    <div className="content-grid animate-in">
                                        <div className="video-preview-v5">
                                            <img src={activeVideo.video_data.cover} alt="cover" />
                                        </div>
                                        <div className="d-flex flex-column gap-4">
                                            <div className="metric-row-v5" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                                                <div className="metric-box-v5">
                                                    <label>Vistas</label>
                                                    <strong>{formatValue(activeVideo.video_data.play_count)}</strong>
                                                </div>
                                                <div className="metric-box-v5">
                                                    <label>Engagement</label>
                                                    <strong>{(activeVideo.video_data.engagement_rate * 100).toFixed(1)}%</strong>
                                                </div>
                                                <div className="metric-box-v5">
                                                    <label>Likes</label>
                                                    <strong>{formatValue(activeVideo.video_data.digg_count)}</strong>
                                                </div>
                                                <div className="metric-box-v5">
                                                    <label>Shares</label>
                                                    <strong>{formatValue(activeVideo.video_data.share_count)}</strong>
                                                </div>
                                                <div className="metric-box-v5">
                                                    <label>Comments</label>
                                                    <strong>{formatValue(activeVideo.video_data.comment_count)}</strong>
                                                </div>
                                                <div className="metric-box-v5">
                                                    <label>Downloads</label>
                                                    <strong>{formatValue(activeVideo.video_data.download_count)}</strong>
                                                </div>
                                            </div>

                                            {activeVideo.video_data.music_info && (
                                                <div className="ia-card-v5" style={{ padding: '1.25rem' }}>
                                                    <label className="fs-xxs fw-900 opacity-50 uppercase tracking-widest mb-2 d-block">Audio Original</label>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="p-2 bg-dark text-white rounded-circle"><i className="bi bi-music-note-beamed"></i></div>
                                                        <div>
                                                            <h6 className="m-0 fw-950">{activeVideo.video_data.music_info.title}</h6>
                                                            <span className="fs-xs text-muted">{activeVideo.video_data.music_info.author}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="ia-card-v5" style={{ background: '#fffbeb', border: '1px solid #fed7aa' }}>
                                                <h5 style={{ color: '#c2410c' }}><i className="bi bi-eye"></i> Visión Artificial IA</h5>
                                                <p className="m-0 fs-7 italic" style={{ color: '#9a3412', lineHeight: '1.6' }}>
                                                    "{activeVideo.video_data.miniatura_descripcion}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="animate-in">
                                        {(() => {
                                            const analysis = activeVideo.video_analysis || {};
                                            const strategy = analysis.estrategia_pepsi_gt || analysis.estrategia_pepsi_guatemala || analysis;
                                            const points = analysis.data_points_clave || {};
                                            return (
                                                <>
                                                    <div className="ia-cards-v5">
                                                        <div className="ia-card-v5">
                                                            <h5><i className="bi bi-bullseye"></i> Foco Estratégico</h5>
                                                            <div className="ia-detail-v5">
                                                                <label>Interés de Marca</label>
                                                                <p>{strategy.interes_marca_detallado}</p>
                                                            </div>
                                                            <div className="ia-detail-v5 featured-v5">
                                                                <label>Insight Local (Chapín)</label>
                                                                <p>{strategy.insight_chapin}</p>
                                                            </div>
                                                        </div>
                                                        <div className="ia-card-v5">
                                                            <h5><i className="bi bi-lightning-charge"></i> Viral Data Points</h5>
                                                            <div className="ia-detail-v5">
                                                                <label>Potencial del Sonido</label>
                                                                <p>{points.potencial_audio}</p>
                                                            </div>
                                                            <div className="ia-detail-v5">
                                                                <label>Shareability Factor</label>
                                                                <p>{points.shareability_factor}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="roadmap-v5">
                                                        <h5 className="fw-950 fs-7 uppercase tracking-extra mb-4">Ejecuciones Creativas</h5>
                                                        {(activeVideo.video_analysis.ejecucion_creativa || []).map((ex, i) => (
                                                            <div key={i} className="exec-bar-v5">
                                                                <div className="exec-score-v5">
                                                                    <span>URGENCIA</span>
                                                                    <strong>{ex.urgency_score}</strong>
                                                                </div>
                                                                <div className="exec-info-v5">
                                                                    <Badge bg="primary" className="mb-2 fs-xxs fw-900 rounded-pill">{ex.tipo.toUpperCase()}</Badge>
                                                                    <h6>{ex.title}</h6>
                                                                    <p>{ex.idea_activacion_detallada}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted opacity-30">
                            <i className="bi bi-radar mb-3" style={{ fontSize: '4rem' }}></i>
                            <h4 className="fw-900">RADAR EN ESPERA</h4>
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                .btn-pill-px { border: none; background: transparent; padding: 10px 0; border-radius: 100px; font-weight: 950; font-size: 0.72rem; letter-spacing: 0.1em; transition: 0.3s; }
                .btn-active { background: var(--pep-blue); color: white; box-shadow: 0 4px 12px rgba(0,92,180,0.2); }
                .btn-ghost { color: #94a3b8; }
                .fs-xxs { font-size: 0.55rem; }
                .tracking-extra { letter-spacing: 0.15em; }
            `}</style>
        </div>
    );
};

export default VideoAnalysisPage;
