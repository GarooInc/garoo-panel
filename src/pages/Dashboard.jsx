import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const stats = [
        { title: "Personal", value: "24", icon: "bi-people-fill", color: "#2563eb", desc: "Colaboradores activos", trend: "+12%" },
        { title: "Aplicaciones", value: "156", icon: "bi-file-earmark-person", color: "#8b5cf6", desc: "Recibidas este mes", trend: "+5%" },
        { title: "Servicios", value: "12", icon: "bi-grid-3x3-gap", color: "#10b981", desc: "Activos en plataforma", trend: "Estable" },
        { title: "Llamadas", value: "48", icon: "bi-telephone-outbound", color: "#f59e0b", desc: "Pendientes hoy", trend: "-2%" },
    ];

    return (
        <div className="page-container animate-in">
            <div className="row mb-5 align-items-end g-4">
                <div className="col-12 col-md-8">
                    <h1 className="premium-title mb-2">Panel Principal</h1>
                    <p className="premium-subtitle mb-0">Monitorea el rendimiento y las métricas clave de tus operaciones centralizadas.</p>
                </div>
                <div className="col-12 col-md-4 text-md-end">
                    <button className="btn-premium btn-premium-secondary d-inline-flex">
                        <i className="bi bi-download"></i>
                        Exportar Reporte
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="col-12 col-md-6 col-xl-3">
                        <div className="glass-card p-4 h-100 transition-all">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div
                                    className="rounded-4 d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "52px",
                                        height: "52px",
                                        backgroundColor: `${stat.color}15`,
                                        color: stat.color,
                                        border: `1px solid ${stat.color}20`
                                    }}
                                >
                                    <i className={`bi ${stat.icon} fs-4`}></i>
                                </div>
                                <span className={`badge border-0 rounded-pill px-3 py-2 ${stat.trend.includes('+') ? 'bg-success-subtle text-success' : 'bg-light text-muted'}`} style={{ fontSize: '0.7rem', fontWeight: 800 }}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="fw-950 mb-1" style={{ fontSize: "2rem", letterSpacing: '-0.03em' }}>{stat.value}</h3>
                            <p className="fw-800 text-dark mb-1" style={{ fontSize: "0.9rem" }}>{stat.title}</p>
                            <p className="text-muted small mb-0 fw-500">{stat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row mt-4 g-4">
                <div className="col-12 col-lg-8">
                    <div className="glass-card p-4" style={{ minHeight: "400px" }}>
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h5 className="fw-900 mb-0">Actividad del Sistema</h5>
                            <div className="dropdown">
                                <button className="btn btn-sm btn-light rounded-pill px-3" type="button">Esta Semana</button>
                            </div>
                        </div>
                        <div className="text-center py-5">
                            <div className="mb-4 opacity-10">
                                <i className="bi bi-bar-chart-line" style={{ fontSize: "5rem" }}></i>
                            </div>
                            <p className="text-muted fw-800 fs-5 mb-1">Cargando visualización de datos...</p>
                            <p className="text-muted small">Sincronizando con los webhooks de servicios activos.</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-12 col-lg-4">
                    <div className="glass-card p-4 h-100">
                        <h5 className="fw-900 mb-4">Acciones Rápidas</h5>
                        <div className="d-grid gap-3">
                            <Link to="/form" className="btn-premium btn-premium-primary justify-content-center py-3">
                                <i className="bi bi-plus-circle-fill"></i> Nueva Factura
                            </Link>
                            <Link to="/spectrum-leads" className="btn-premium btn-premium-secondary justify-content-center py-3">
                                <i className="bi bi-person-lines-fill"></i> Gestionar Leads
                            </Link>
                            <Link to="/agent-onboarding" className="btn-premium btn-premium-secondary justify-content-center py-3">
                                <i className="bi bi-robot"></i> Configurar Agente
                            </Link>
                            <div className="mt-4 pt-4 border-top">
                                <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light">
                                    <div className="bg-white rounded-circle p-2 shadow-sm">
                                        <i className="bi bi-info-circle-fill text-primary"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="small mb-0 fw-800">Próxima Actualización</p>
                                        <p className="small text-muted mb-0">Mañana a las 09:00 AM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .fw-950 { font-weight: 950; }
                .fw-900 { font-weight: 900; }
                .fw-800 { font-weight: 800; }
                .fw-500 { font-weight: 500; }
                .transition-all:hover { transform: translateY(-5px); }
            `}</style>
        </div>
    );
};

export default Dashboard;