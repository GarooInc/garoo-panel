const Dashboard = () => {
    const stats = [
        { title: "Personal", value: "24", icon: "bi-people-fill", color: "#2563eb", desc: "Colaboradores activos" },
        { title: "Aplicaciones", value: "156", icon: "bi-file-earmark-person", color: "#8b5cf6", desc: "Recibidas este mes" },
        { title: "Servicios", value: "12", icon: "bi-grid-3x3-gap", color: "#10b981", desc: "Activos en plataforma" },
        { title: "Llamadas", value: "48", icon: "bi-telephone-outbound", color: "#f59e0b", desc: "Pendientes hoy" },
    ];

    return (
        <div className="container-fluid p-0">
            <div className="mb-4">
                <h2 className="fw-bold" style={{ letterSpacing: "-0.5px" }}>Vista General</h2>
                <p className="text-secondary">Bienvenido al panel central de administración.</p>
            </div>

            <div className="row g-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="col-12 col-md-6 col-xl-3">
                        <div
                            className="card border-0 shadow-sm transition-all hover-translate-y h-100"
                            style={{ borderRadius: "16px", background: "#ffffff" }}
                        >
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div
                                        className="rounded-3 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                            backgroundColor: `${stat.color}15`,
                                            color: stat.color
                                        }}
                                    >
                                        <i className={`bi ${stat.icon} fs-4`}></i>
                                    </div>
                                    <span className="badge bg-light text-dark border">Hoy</span>
                                </div>
                                <h3 className="fw-bold mb-1" style={{ fontSize: "1.75rem" }}>{stat.value}</h3>
                                <p className="fw-semibold text-dark mb-1" style={{ fontSize: "0.9rem" }}>{stat.title}</p>
                                <p className="text-secondary small mb-0">{stat.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row mt-4 g-4">
                <div className="col-12 col-lg-8">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: "16px", minHeight: "300px" }}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Actividad Reciente</h5>
                            <div className="text-center py-5">
                                <i className="bi bi-bar-chart-line text-light-emphasis" style={{ fontSize: "3rem" }}></i>
                                <p className="text-muted mt-2">Cargando datos de actividad...</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: "16px", minHeight: "300px" }}>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4">Acciones Rápidas</h5>
                            <div className="d-grid gap-2">
                                <button className="btn btn-primary py-2 rounded-3">Nueva Factura</button>
                                <button className="btn btn-outline-secondary py-2 rounded-3">Ver Reportes</button>
                                <button className="btn btn-outline-secondary py-2 rounded-3">Configuración</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-translate-y:hover {
                    transform: translateY(-5px);
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;