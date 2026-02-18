import garooLogo from "../../assets/img/garoo-logo.png";

const Header = ({ onToggleSidebar }) => {
    return (
        <header
            className="fixed-top d-flex align-items-center gap-3 px-3 px-md-4"
            style={{
                height: "var(--header-height)",
                backgroundColor: "var(--bg-white)",
                borderBottom: "1px solid var(--border-color)",
                zIndex: 1100,
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
            }}
        >
            {/* Botón hamburguesa para móviles */}
            <button
                className="btn btn-link d-lg-none p-0 text-slate-800"
                onClick={onToggleSidebar}
                style={{ fontSize: "1.5rem", color: "#1e293b" }}
                aria-label="Toggle sidebar"
            >
                <i className="bi bi-list"></i>
            </button>

            <div className="d-flex align-items-center gap-2">
                <img
                    src={garooLogo}
                    alt="Logo de Garoo Servicios"
                    className="rounded-circle shadow-sm"
                    width="42"
                    height="42"
                    style={{ objectFit: "cover" }}
                />
                <span
                    className="fw-bold d-none d-sm-block"
                    style={{ fontSize: "1.25rem", color: "var(--text-main)", letterSpacing: "-0.5px" }}
                >
                    Garoo Servicios
                </span>
            </div>

            <div className="ms-auto d-none d-md-block">
                <div
                    className="px-3 py-1 rounded-pill bg-light border"
                    style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
                >
                    Portal de Administración
                </div>
            </div>
        </header>
    );
};

export default Header;
