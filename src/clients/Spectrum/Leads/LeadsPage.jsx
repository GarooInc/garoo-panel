import { useState, useEffect, useCallback } from "react";
import { redtecInstance } from "../../../api/axios";
import LeadDetails from "./components/LeadDetails";
import { Avatar } from "./components/LeadModalComponents";
import { getEmotionStyle, getChannelInfo } from "./utils/leadHelpers";
import { formatFullDate } from "../../../utils/dateHelpers";
import { Spinner } from "react-bootstrap";

export default function SpectrumLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [channelFilter, setChannelFilter] = useState("Todos");
    const [emotionFilter, setEmotionFilter] = useState("Todas");
    const [reservFilter, setReservFilter] = useState("Todos");
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLeads, setTotalLeads] = useState(0);

    const fetchLeads = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = {
                page,
                pageSize: 10,
                search: search.trim(),
                channel: channelFilter === "Todos" ? "" : channelFilter,
                emotion: emotionFilter === "Todas" ? "" : emotionFilter,
                reservation: reservFilter === "Todos" ? "" : (reservFilter === "Sí" ? "true" : "false")
            };
            
            const response = await redtecInstance.get("leads", { params });
            const result = response.data;
            
            if (Array.isArray(result)) {
                setLeads(result);
                setTotalPages(1);
                setCurrentPage(1);
                setTotalLeads(result.length);
            } else {
                const leadsList = result.leads || result.data || [];
                const totalCount = result.total || result.meta?.totalCount || leadsList.length;
                const pageSize = 10;
                
                setLeads(leadsList);
                setTotalLeads(totalCount);
                setTotalPages(result.meta?.totalPages || Math.ceil(totalCount / pageSize) || 1);
                setCurrentPage(result.meta?.page || page);
            }
        } catch (err) {
            console.error("Error fetching leads:", err);
        } finally {
            setLoading(false);
        }
    }, [search, channelFilter, emotionFilter, reservFilter]);

    useEffect(() => {
        fetchLeads(1);
    }, [fetchLeads]);

    const channels = ["Todos", "WhatsApp", "Instagram", "Facebook", "Web"];
    const emotions = ["Todas", "Positiva", "Neutral", "Negativa", "Urgente"];

    const handleClearFilters = () => {
        setSearch("");
        setChannelFilter("Todos");
        setEmotionFilter("Todas");
        setReservFilter("Todos");
    };

    if (selected) {
        return <LeadDetails lead={selected} onBack={() => setSelected(null)} />;
    }

    return (
        <div className="page-container animate-in">
            <style>{`
                .header-wrapper-premium { 
                    display: flex; justify-content: space-between; align-items: center; 
                    margin-bottom: 1.5rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 1rem;
                }
                
                .filter-strip-premium { 
                    background: rgba(255,255,255,0.7); backdrop-filter: blur(10px);
                    border-radius: 24px; border: 1px solid rgba(226, 232, 240, 0.8); 
                    padding: 1.5rem; display: flex; gap: 1.25rem; flex-wrap: wrap; align-items: flex-end;
                    margin-bottom: 2rem; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.04);
                }
                .f-group { display: flex; flex-direction: column; gap: 8px; }
                .f-label { font-size: 0.7rem; font-weight: 850; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-left: 4px; }
                .f-input, .f-select { 
                    background: #cbd5e1; border: 2px solid #94a3b8; border-radius: 12px; 
                    padding: 10px 16px; font-size: 0.85rem; font-weight: 700; color: var(--text-main); outline: none; transition: all 0.2s;
                }
                .f-input:focus, .f-select:focus { border-color: #8b5cf6; background: white; box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1); }

                .table-glass-container { 
                    background: white; border-radius: 28px; border: 1px solid #f1f5f9; 
                    overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
                }
                .table-leads-premium { width: 100%; border-collapse: separate; border-spacing: 0; }
                .table-leads-premium th { 
                    background: #fcfdfe; text-align: left; padding: 1.25rem 1.5rem; 
                    font-size: 0.7rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; 
                    border-bottom: 1px solid #f1f5f9; letter-spacing: 0.05em;
                }
                .table-leads-premium td { padding: 1.25rem 1.5rem; font-size: 0.9rem; border-bottom: 1px solid #f1f5f9; color: #475569; font-weight: 500; }
                .table-leads-premium tr:last-child td { border-bottom: none; }
                .table-leads-premium tr:hover td { background: #f9f7ff; cursor: pointer; }
                
                .c-name { font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 12px; }
                .c-pill { font-weight: 800; font-size: 0.75rem; display: flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 100px; background: #f8fafc; }
                
                /* Pagination */
                .pagination-wrapper {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 1rem 1.5rem; background: #fcfdfe; border-top: 1px solid #f1f5f9;
                }
                .pg-info { font-size: 0.75rem; font-weight: 800; color: #94a3b8; }
                .pg-controls { display: flex; gap: 8px; }
                .pg-btn {
                    width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid #e2e8f0;
                    background: white; color: #475569; display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.2s; font-size: 1rem;
                }
                .pg-btn:hover:not(:disabled) { border-color: #8b5cf6; color: #8b5cf6; }
                .pg-btn:disabled { opacity: 0.3; cursor: not-allowed; }

                @media (max-width: 991px) { .spectrum-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; } }
            `}</style>

            <div className="header-wrapper-premium">
                <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-baseline gap-3">
                        <h1 className="fw-950 m-0" style={{ fontSize: '1.75rem', color: '#0f172a', letterSpacing: '-0.7px' }}>Prospectos</h1>
                        <span className="badge rounded-pill fw-900" style={{ background: '#f5f3ff', color: '#8b5cf6', border: '1px solid #ddd6fe', padding: '6px 14px', fontSize: '0.8rem' }}>{totalLeads}</span>
                    </div>
                    <div className="d-flex flex-column" style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: '15px' }}>
                        <span className="fw-900" style={{ fontSize: '0.65rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#64748b' }}>Spectrum</span>
                        <span className="text-muted fw-700" style={{ fontSize: '0.6rem' }}>Seguimiento Inteligente</span>
                    </div>
                </div>
            </div>

            <div className="filter-strip-premium">
                <div className="f-group" style={{ width: '240px' }}>
                    <label className="f-label">Buscar contactos</label>
                    <div className="position-relative">
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input className="f-input ps-5 w-100" placeholder="Nombre, alias o mensaje..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="f-group" style={{ minWidth: '160px' }}>
                    <label className="f-label">Canal de Origen</label>
                    <select className="f-select" value={channelFilter} onChange={e => setChannelFilter(e.target.value)}>
                        {channels.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div className="f-group" style={{ minWidth: '160px' }}>
                    <label className="f-label">Emoción IA</label>
                    <select className="f-select" value={emotionFilter} onChange={e => setEmotionFilter(e.target.value)}>
                        {emotions.map(e => <option key={e}>{e}</option>)}
                    </select>
                </div>
                <div className="f-group" style={{ minWidth: '120px' }}>
                    <label className="f-label">Reserva</label>
                    <select className="f-select" value={reservFilter} onChange={e => setReservFilter(e.target.value)}>
                        <option>Todos</option>
                        <option>Sí</option>
                        <option>No</option>
                    </select>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn-premium btn-premium-primary" style={{ padding: '10px 24px' }} onClick={() => fetchLeads(1)}>
                        <i className="bi bi-funnel"></i> Filtrar
                    </button>
                    <button className="btn-premium btn-premium-secondary" onClick={handleClearFilters}>
                        <i className="bi bi-x-circle"></i>
                    </button>
                </div>

                <div className="ms-auto d-flex align-items-center gap-4 pb-1">
                    <span className="pg-info text-nowrap">Página {currentPage} de {totalPages}</span>
                    <div className="pg-controls">
                        <button className="pg-btn" style={{ width: '32px', height: '32px' }} disabled={currentPage === 1} onClick={() => fetchLeads(1)}>
                            <i className="bi bi-chevron-double-left" style={{ fontSize: '0.8rem' }}></i>
                        </button>
                        <button className="pg-btn" style={{ width: '32px', height: '32px' }} disabled={currentPage === 1} onClick={() => fetchLeads(currentPage - 1)}>
                            <i className="bi bi-chevron-left" style={{ fontSize: '0.8rem' }}></i>
                        </button>
                        <button className="pg-btn" style={{ width: '32px', height: '32px' }} disabled={currentPage === totalPages} onClick={() => fetchLeads(currentPage + 1)}>
                            <i className="bi bi-chevron-right" style={{ fontSize: '0.8rem' }}></i>
                        </button>
                        <button className="pg-btn" style={{ width: '32px', height: '32px' }} disabled={currentPage === totalPages} onClick={() => fetchLeads(totalPages)}>
                            <i className="bi bi-chevron-double-right" style={{ fontSize: '0.8rem' }}></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="table-glass-container">
                {loading ? (
                    <div className="p-5 text-center text-muted flex-column d-flex align-items-center gap-3">
                        <Spinner animation="grow" variant="primary" size="sm" />
                        <span className="fw-800">Sincronizando flujo de leads...</span>
                    </div>
                ) : (
                    <table className="table-leads-premium">
                        <thead>
                            <tr>
                                <th>Contacto Principal</th>
                                <th>Canal</th>
                                <th>Estado/Emoción</th>
                                <th>Reserva</th>
                                <th>Última Actividad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.length > 0 ? leads.map((l, i) => {
                                const ch = getChannelInfo(l.input_channel);
                                const em = getEmotionStyle(l.emocion_detectada);
                                return (
                                    <tr key={i} onClick={() => setSelected(l)}>
                                        <td>
                                            <div className="c-name">
                                                <Avatar name={l.name || l.whatsapp_name} size={36} /> 
                                                <span>{l.name || l.whatsapp_name || 'Prospecto Anónimo'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="c-pill" style={{ color: ch.color }}>
                                                <i className={`bi ${ch.icon}`}></i> 
                                                {l.input_channel}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge rounded-pill px-3 py-2 fw-800" style={{ background: em.bg, color: em.text, border: `1px solid ${em.border}`, fontSize: '0.7rem' }}>
                                                {l.emocion_detectada || 'Neutral'}
                                            </span>
                                        </td>
                                        <td>
                                            {l.has_reservation ? (
                                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3">CONFIRMADA</span>
                                            ) : (
                                                <span className="text-muted small opacity-50 fw-800">PENDIENTE</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className="text-muted small fw-600">{formatFullDate(l.updatedAt || l.created_at)}</span>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted fw-700">
                                        No se encontraron prospectos con los filtros actuales.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
