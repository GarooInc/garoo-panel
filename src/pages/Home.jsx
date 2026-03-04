import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container-fluid p-0 d-flex align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
            <div className="text-center max-w-md">
                <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-subtle text-primary mb-4 shadow-sm"
                    style={{ width: "80px", height: "80px", backgroundColor: "var(--primary-light)" }}
                >
                    <i className="bi bi-shield-lock fs-1"></i>
                </div>
                <h1 className="display-5 fw-bold mb-3" style={{ letterSpacing: "-1px" }}>Bienvenido a Garoo</h1>
                <p className="text-secondary fs-5 mb-5 px-md-5">
                    Sistema integral de administración para gestión documental, aplicaciones y servicios operativos.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                    <Link to="/dashboard" className="btn btn-primary px-4 py-2 fs-6 rounded-3 shadow-sm">
                        Ir al Panel
                    </Link>
                    <Link to="/services" className="btn btn-outline-secondary px-4 py-2 fs-6 rounded-3">
                        Ver Servicios
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;