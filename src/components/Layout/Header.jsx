import { useLocation } from "react-router-dom";

const Header = ({ onToggleSidebar }) => {
    const location = useLocation();

    // Mapping paths to nice titles
    const routeTitles = {
        "/dashboard": "Vista General",
        "/services": "Catálogo de Servicios",
        "/applications": "Gestión de Talento",
        "/form": "Gestión Documental",
        "/spectrum-leads": "Spectrum Hub",
        "/outbound-call-form": "Centro de Llamadas"
    };

    const currentTitle = routeTitles[location.pathname] || "Portal Operativo";

    return (
        <header
            className="fixed-top d-flex align-items-center justify-content-between px-3 px-md-4"
            style={{
                height: "var(--header-height)",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
                zIndex: 1100,
                boxShadow: "0 1px 1px rgba(0,0,0,0.02)",
            }}
        >
            <div className="d-flex align-items-center gap-3">
                {/* Botón hamburguesa para móviles */}
                <button
                    className="btn btn-link d-lg-none p-0 text-slate-800"
                    onClick={onToggleSidebar}
                    style={{ fontSize: "1.5rem", color: "#1e293b" }}
                    aria-label="Toggle sidebar"
                >
                    <i className="bi bi-list"></i>
                </button>

                {/* Context / Breadcrumb style title */}
                <div className="d-flex align-items-center gap-2">
                    <span className="text-secondary d-none d-sm-block" style={{ fontSize: '0.8rem', fontWeight: '500' }}>Garoo</span>
                    <i className="bi bi-chevron-right d-none d-sm-block text-muted" style={{ fontSize: '0.7rem' }}></i>
                    <h2 className="mb-0 fs-6 fw-bold text-dark" style={{ letterSpacing: '-0.01em' }}>{currentTitle}</h2>
                </div>
            </div>

            <div className="d-flex align-items-center gap-3">
                <div
                    className="px-3 py-1 rounded-pill d-none d-md-flex align-items-center gap-2"
                    style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        background: "rgba(0,0,0,0.03)",
                        border: "1px solid rgba(0,0,0,0.02)"
                    }}
                >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                    En línea
                </div>

                <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                        width: '36px',
                        height: '36px',
                        background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer'
                    }}
                >
                    <i className="bi bi-person text-secondary"></i>
                </div>
            </div>
        </header>
    );
};

export default Header;
