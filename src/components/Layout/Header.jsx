import garooLogo from "../../assets/img/garoo-logo.png";

const Header = ({ onToggleSidebar }) => {
    return (
        <header className="border-bottom py-2 px-3 px-md-4 d-flex align-items-center gap-2 gap-md-3 bg-light fixed-top">
            {/* Botón hamburguesa para móviles */}
            <button
                className="btn btn-link d-lg-none p-0 text-dark"
                onClick={onToggleSidebar}
                style={{ fontSize: "1.5rem" }}
                aria-label="Toggle sidebar"
            >
                <i className="bi bi-list"></i>
            </button>

            <div>
                <img
                    src={garooLogo}
                    alt="Logo de Garoo Servicios"
                    className="img-fluid rounded-circle"
                    width="50"
                    height="50"
                    style={{ width: "50px", height: "50px" }}
                />
            </div>

            <div className="d-flex flex-column">
                <b className="fs-4 fs-md-3 fs-lg-2">Garoo Servicios</b>
            </div>

            <div className="ms-auto d-none d-md-block">
                <span className="text-muted small">
                    Bienvenido a Garoo Servicios
                </span>
            </div>
        </header>
    );
};

export default Header;
