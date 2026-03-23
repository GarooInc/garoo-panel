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
                    --pep-dark: #001e38;
                    --pep-red: #ef4444;
                    --pep-bg: #f3f7fa;
                    --pep-white: #ffffff;
                    --pep-border: #e2e8f0;
                    --pep-muted: #64748b;
                    --radius-lg: 20px;
                    --radius-md: 12px;
                    --shadow-sm: 0 4px 6px -1px rgba(0,0,0,0.05);
                    --shadow-md: 0 10px 15px -3px rgba(0,0,0,0.08);
                }

                .pepsi-intel-page {
                    height: calc(100vh - 80px); /* Adjust based on App shell header */
                    max-height: calc(100vh - 80px);
                    display: flex;
                    flex-direction: column;
                    padding: 1rem 1.5rem 1.5rem 1.5rem;
                    background: var(--pep-bg);
                    font-family: 'Outfit', 'Inter', sans-serif;
                    overflow: hidden;
                    box-sizing: border-box;
                }

                /* SIDEBAR FEED */
                .sidebar-container {
                    background: var(--pep-white);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--pep-border);
                    display: flex;
                    flex-direction: column;
                    box-shadow: var(--shadow-md);
                    overflow: hidden;
                    height: 100%;
                }
                .sidebar-filters {
                    padding: 1rem;
                    border-bottom: 1px solid var(--pep-border);
                    background: #fbfcfe;
                }
                .feed-header { 
                    padding: 1rem 1.5rem; 
                    background: #fff; 
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .feed-header h5 { font-weight: 900; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--pep-muted); margin: 0; }
                
                .video-scroller { flex: 1; overflow-y: auto; padding: 1rem; }
                .video-card-mini {
                    display: flex; gap: 0.75rem; padding: 0.65rem; border-radius: 12px;
                    background: #fff; cursor: pointer; transition: 0.2s; border: 1px solid transparent;
                    margin-bottom: 0.5rem;
                }
                .video-card-mini:hover { background: #f8fafc; }
                .video-card-mini.active { 
                    background: #fff; 
                    border-color: var(--pep-blue); 
                    box-shadow: 0 4px 12px rgba(0,92,180,0.08);
                }
                .mini-thumb { width: 45px; height: 60px; border-radius: 8px; object-fit: cover; }
                .mini-meta { flex: 1; min-width: 0; }
                .mini-meta h6 { font-size: 0.8rem; font-weight: 800; margin: 0 0 2px 0; color: var(--pep-dark); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .mini-meta p { font-size: 0.65rem; color: var(--pep-muted); margin: 0; font-weight: 600; }

                /* LAYOUT ENGINE */
                .main-grid {
                    flex: 1;
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 1.5rem;
                    overflow: hidden;
                    min-height: 0; /* Critical for flex scroll */
                }

                /* MAIN WORKSPACE */
                .workspace-container {
                    background: var(--pep-white);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--pep-border);
                    box-shadow: var(--shadow-md);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .workspace-header { 
                    padding: 0.75rem 1.5rem; 
                    background: #fff; 
                    border-bottom: 1px solid var(--pep-border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-height: 64px;
                }

                .action-pills { 
                    display: flex; background: #f1f5f9; padding: 4px; border-radius: 100px; gap: 2px;
                    box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);
                }
                .action-tab {
                    padding: 6px 20px; border-radius: 100px; font-weight: 800; font-size: 0.65rem;
                    border: none; background: transparent; color: var(--pep-muted); transition: 0.3s;
                    text-transform: uppercase; letter-spacing: 0.05em;
                }
                .action-tab.active { 
                    background: #fff; 
                    color: var(--pep-blue); 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    font-weight: 950;
                }

                /* DASHBOARD CONTENT */
                .dashboard-body { flex: 1; overflow-y: auto; padding: 2rem; }
                .minimal-section-title {
                    font-size: 0.75rem;
                    font-weight: 950;
                    text-transform: uppercase;
                    letter-spacing: 0.15em;
                    color: var(--pep-muted);
                    margin-bottom: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .minimal-section-title::after {
                    content: "";
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, var(--pep-border) 0%, transparent 100%);
                }

                /* STRATEGIC CARDS */
                .strat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2.5rem; }
                
                .strat-card {
                    background: #fff; 
                    border: 1px solid var(--pep-border); 
                    border-radius: 20px; 
                    padding: 2rem;
                    position: relative;
                    transition: 0.3s;
                }
                .strat-card:hover { border-color: var(--pep-blue); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.05); }
                
                .strat-card.hero { 
                    background: linear-gradient(135deg, var(--pep-blue) 0%, #003a73 100%);
                    color: #fff;
                    border: none;
                }
                .strat-card.hero h4 { color: #fff; font-weight: 900; }
                .strat-card.hero p { color: rgba(255,255,255,0.85); line-height: 1.7; }
                .strat-card.hero .badge-local { background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.2); }

                .card-label { 
                    font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; 
                    color: var(--pep-muted); margin-bottom: 1.25rem; display: block;
                }
                .strat-card.hero .card-label { color: rgba(255,255,255,0.6); }

                .badge-local { padding: 6px 14px; border-radius: 100px; font-weight: 950; font-size: 0.65rem; text-transform: uppercase; display: inline-block; }
                .badge-local.gt { background: #eff6ff; color: var(--pep-blue); margin-top: 1rem; }

                /* ROADMAP ITEMS */
                .roadmap-section { margin-top: 2rem; }
                .roadmap-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
                .roadmap-header h5 { font-weight: 950; color: var(--pep-dark); margin: 0; font-size: 1.1rem; }

                .execution-item-v7 {
                    display: grid; grid-template-columns: auto 1fr auto; gap: 2rem; align-items: center;
                    padding: 1.5rem; background: #fff; border: 1px solid var(--pep-border); 
                    border-radius: 18px; margin-bottom: 1.25rem; transition: 0.2s;
                }
                .execution-item-v7:hover { border-color: var(--pep-blue); transform: translateX(8px); }
                
                .urgency-v7 {
                    width: 50px; height: 50px; border-radius: 14px; 
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    font-weight: 950; line-height: 1;
                }
                .urgency-v7.high { background: #fff1f2; color: var(--pep-red); border: 1px solid #fecdd3; }
                .urgency-v7.mid { background: #fffbeb; color: #d97706; border: 1px solid #fed7aa; }

                /* VIDEO CONTENT VIEW */
                .video-view-grid { display: grid; grid-template-columns: 240px 1fr; gap: 1.5rem; margin-bottom: 1rem; align-items: start; }
                .video-frame { 
                    border-radius: 12px; 
                    overflow: hidden; 
                    background: #000; 
                    box-shadow: var(--shadow-sm);
                    width: 100%;
                }
                .video-frame img { width: 100%; height: auto; display: block; }

                .ai-vision-wide {
                    background: #fffbeb; 
                    border: 1px solid #fed7aa;
                    border-radius: 16px;
                    padding: 1rem 1.5rem;
                    width: 100%;
                }

                .metric-pill {
                    background: #f8fafc; border: 1px solid var(--pep-border); padding: 0.75rem 1rem; border-radius: 12px;
                    display: flex; flex-direction: column; gap: 2px;
                }
                .metric-pill label { font-size: 0.55rem; font-weight: 900; color: var(--pep-muted); text-transform: uppercase; }
                .metric-pill strong { font-size: 1.1rem; font-weight: 950; color: var(--pep-dark); letter-spacing: -0.02em; }

                /* HELPERS */
                .anim-fade { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .sl-custom-scroll::-webkit-scrollbar { width: 5px; }
                .sl-custom-scroll::-webkit-scrollbar-track { background: transparent; }
                .sl-custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

                /* HELPERS */
                .sl-custom-scroll::-webkit-scrollbar { width: 5px; }
                .sl-custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .uppercase { text-transform: uppercase; }
                .tracking-widest { letter-spacing: 0.2em; }
            `}</style>

            <div className="main-grid">
                <aside className="sidebar-container">
                    <div className="sidebar-filters">
                        <div className="d-flex p-1 bg-white border rounded-pill mb-2" style={{ gap: '2px' }}>
                            <button 
                                className={`btn-pill-px flex-fill ${country === 'MX' ? 'btn-active' : 'btn-ghost'}`} 
                                onClick={() => setCountry('MX')}
                                style={{ padding: '4px 0', fontSize: '0.6rem' }}
                            >MÉXICO</button>
                            <button 
                                className={`btn-pill-px flex-fill ${country === 'GT' ? 'btn-active' : 'btn-ghost'}`} 
                                onClick={() => setCountry('GT')}
                                style={{ padding: '4px 0', fontSize: '0.6rem' }}
                            >GUATEMALA</button>
                        </div>

                        <Form.Select 
                            className="rounded-pill px-3 fw-950" 
                            style={{ 
                                height: '30px', 
                                fontSize: '0.65rem', 
                                border: '1px solid #dBEAFE', 
                                background: '#f8fafc',
                                color: 'var(--pep-blue)',
                                cursor: 'pointer'
                            }} 
                            value={selectedDate} 
                            onChange={e => setSelectedDate(e.target.value)}
                        >
                            {availableDates.map(d => <option key={d} value={d}>{d}</option>)}
                        </Form.Select>
                    </div>

                    <div className="feed-header">
                        <h5>VIDEOS VIRALES</h5>
                        <Badge bg="primary" className="rounded-pill px-2 py-1 fw-900 fs-xxxs">{filteredVideos.length}</Badge>
                    </div>
                    <div className="video-scroller sl-custom-scroll">
                        {loading ? (
                            <div className="h-100 d-flex align-items-center justify-content-center">
                                <Spinner animation="border" variant="primary" size="sm" />
                            </div>
                        ) : filteredVideos.map((v, i) => (
                            <div 
                                key={i} 
                                className={`video-card-mini ${selectedId === v._id ? 'active' : ''}`} 
                                onClick={() => setSelectedId(v._id)}
                            >
                                <img src={v.video_data.cover} className="mini-thumb" alt="v" />
                                <div className="mini-meta">
                                    <h6>{v.video_data.title || `Viral ${v.video_data.platform}`}</h6>
                                    <p>@{v.video_data.author_username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <main className="workspace-container">
                    {activeVideo ? (
                        <>
                            <div className="workspace-header">
                                <div className="d-flex align-items-center gap-2">
                                    <img src={activeVideo.video_data.author_avatar} className="rounded-circle border border-2 border-white shadow-sm" width="32" height="32" alt="p" />
                                    <div>
                                        <h6 className="m-0 fw-950 text-dark" style={{ fontSize: '0.85rem' }}>{activeVideo.video_data.author_nickname}</h6>
                                        <p className="m-0 text-muted fw-800" style={{ fontSize: '0.65rem' }}>@{activeVideo.video_data.author_username}</p>
                                    </div>
                                </div>

                                <div className="action-pills">
                                    <button 
                                        className={`action-tab ${activeTab === 'ai' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('ai')}
                                    >Inteligencia Estratégica</button>
                                    <button 
                                        className={`action-tab ${activeTab === 'video' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('video')}
                                    >Métricas de Contenido</button>
                                </div>

                                <div className="d-flex gap-2">
                                    <Badge bg="primary" className="fw-950 rounded-pill px-3 py-1 shadow-sm" style={{ fontSize: '0.55rem', letterSpacing: '0.05em' }}>{activeVideo.video_data.viral_tier.toUpperCase()}</Badge>
                                </div>
                            </div>

                            <div className="dashboard-body sl-custom-scroll">
                                {activeTab === 'video' ? (
                                    <>
                                        <div className="video-view-grid anim-fade">
                                            <div className="video-frame">
                                                <img src={activeVideo.video_data.cover} alt="cover" />
                                            </div>
                                            <div>
                                                <div className="minimal-section-title">Resultados de Performance</div>
                                                <div className="row g-3">
                                                    <div className="col-4"><div className="metric-pill"><label>Vistas</label><strong>{formatValue(activeVideo.video_data.play_count)}</strong></div></div>
                                                    <div className="col-4"><div className="metric-pill"><label>Engagement</label><strong>{(activeVideo.video_data.engagement_rate * 100).toFixed(1)}%</strong></div></div>
                                                    <div className="col-4"><div className="metric-pill"><label>Likes</label><strong>{formatValue(activeVideo.video_data.digg_count)}</strong></div></div>
                                                    <div className="col-4"><div className="metric-pill"><label>Shares</label><strong>{formatValue(activeVideo.video_data.share_count)}</strong></div></div>
                                                    <div className="col-4"><div className="metric-pill"><label>Comments</label><strong>{formatValue(activeVideo.video_data.comment_count)}</strong></div></div>
                                                    <div className="col-4"><div className="metric-pill"><label>Downloads</label><strong>{formatValue(activeVideo.video_data.download_count)}</strong></div></div>
                                                </div>
                                                
                                                {activeVideo.video_data.music_info && (
                                                    <div className="mt-3 p-3 rounded-3 bg-light border">
                                                        <label className="card-label mb-2">Banda Sonora</label>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="p-2 bg-dark text-white rounded-circle" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}><i className="bi bi-music-note-beamed"></i></div>
                                                            <div>
                                                                <h5 className="m-0 fw-950 text-dark" style={{ fontSize: '0.85rem' }}>{activeVideo.video_data.music_info.title}</h5>
                                                                <p className="m-0 text-muted fw-800" style={{ fontSize: '0.7rem' }}>{activeVideo.video_data.music_info.author}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="ai-vision-wide anim-fade mt-2">
                                            <label className="card-label mb-2" style={{ color: '#c2410c' }}>Visión Artificial IA</label>
                                            <p className="m-0 fs-7 fw-700" style={{ color: '#9a3412', lineHeight: '1.5', fontStyle: 'italic', fontSize: '0.75rem' }}>
                                                "{activeVideo.video_data.miniatura_descripcion}"
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="anim-fade">
                                        <div className="minimal-section-title">Foco Estratégico & Insights</div>
                                        <div className="strat-grid">
                                            {(() => {
                                                const analysis = activeVideo.video_analysis || {};
                                                const strategy = analysis.estrategia_pepsi_gt || analysis.estrategia_pepsi_guatemala || {};
                                                const points = analysis.data_points_clave || {};
                                                const creative = analysis.ejecucion_creativa || [];

                                                return (
                                                    <>
                                                        <div className="strat-card hero">
                                                            <span className="card-label">Oportunidad de la Marca</span>
                                                            <h4 className="mb-3">Conexión con la Audiencia</h4>
                                                            <p className="fs-7">{strategy.interes_marca_detallado}</p>
                                                            
                                                            <div className="badge-local gt">Insight Guatemala</div>
                                                            <div className="mt-2 fw-950" style={{ fontSize: '1.1rem' }}>{strategy.insight_chapin || strategy.insight_guatemala}</div>
                                                        </div>

                                                        <div className="strat-card shadow-sm border-0">
                                                            <span className="card-label border-start border-3 border-primary ps-3">Viral Data Points</span>
                                                            <div className="mb-4">
                                                                <h6 className="fw-950 text-dark mb-1">Potencial del Audio</h6>
                                                                <p className="text-muted fs-7 lh-sm">{points.potencial_audio}</p>
                                                            </div>
                                                            <div>
                                                                <h6 className="fw-950 text-dark mb-1">Shareability Factor</h6>
                                                                <p className="text-muted fs-7 lh-sm">{points.shareability_factor}</p>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-2" style={{ gridColumn: '1 / span 2' }}>
                                                            <div className="roadmap-header mt-4">
                                                                <h5 className="border-bottom border-4 border-primary pb-2">HOJA DE RUTA CREATIVA</h5>
                                                                <Badge bg="light" className="text-dark border px-3 py-2 rounded-pill fw-950">{creative.length} PROPUESTAS AI</Badge>
                                                            </div>
                                                            
                                                            <div className="row g-4">
                                                                {creative.map((ex, i) => (
                                                                    <div key={i} className="col-12">
                                                                        <div className="execution-item-v7 shadow-sm border-0">
                                                                            <div className={`urgency-v7 ${ex.urgency_score > 7 ? 'high' : 'mid shadow-sm'}`}>
                                                                                <small style={{ fontSize: '0.45rem', opacity: 0.6 }}>URG</small>
                                                                                <span>{ex.urgency_score}</span>
                                                                            </div>
                                                                            <div>
                                                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                                                    <Badge bg="dark" className="px-2 py-1 fw-950" style={{ fontSize: '0.5rem' }}>{ex.tipo.toUpperCase()}</Badge>
                                                                                    <h6 className="m-0 fw-950 fs-5">{ex.title}</h6>
                                                                                </div>
                                                                                <p className="text-muted m-0 fs-7 lh-sm">{ex.idea_activacion_detallada}</p>
                                                                            </div>
                                                                            <button className="btn btn-primary rounded-pill px-4 fw-950 shadow-sm" style={{ fontSize: '0.65rem' }}>LEER GUION</button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
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
                .btn-pill-px { border: none; background: transparent; padding: 10px 0; border-radius: 100px; font-weight: 950; font-size: 0.75rem; letter-spacing: 0.05em; transition: 0.3s; cursor: pointer; }
                .btn-active { background: var(--pep-blue); color: #fff; box-shadow: 0 4px 12px rgba(0,92,180,0.25); }
                .btn-ghost { color: var(--pep-muted); }
                .fs-xxs { font-size: 0.55rem; }
                .fs-xxxs { font-size: 0.45rem; }
                .fs-7 { font-size: 0.85rem; }
                .tracking-extra { letter-spacing: 0.15em; }
                .lh-sm { line-height: 1.4; }
                .lh-lg { line-height: 1.8; }
            `}</style>
        </div>
    );
};

export default VideoAnalysisPage;
