import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { user } = useAuth();
    const userName = user?.name || "Usuario";

    return (
        <div className="page-container animate-in d-flex align-items-center justify-content-center" style={{ minHeight: "75vh" }}>
            <div className="text-center w-100" style={{ maxWidth: '800px' }}>
                <div className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 mb-4 fw-800" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                    PLATAFORMA POTENCIADA CON IA
                </div>
                
                <h1 className="premium-title mb-3" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Bienvenido, <span className="text-primary">{userName}</span>
                </h1>
                
                <p className="fs-5 text-muted mb-5 fw-500 mx-auto" style={{ lineHeight: 1.6, maxWidth: '540px' }}>
                    Tu ecosistema centralizado para la gestión inteligente de servicios y automatización de procesos.
                </p>

                <div className="d-flex flex-wrap justify-content-center gap-3">
                    <Link to="/my-services" className="btn-modern-primary px-4 py-2 shadow-sm">
                        <i className="bi bi-grid-fill me-2"></i>
                        Mis Herramientas
                    </Link>
                    
                    {user?.client === "admin" && (
                        <Link to="/services" className="btn-modern-outline px-4 py-2">
                            <i className="bi bi-plus-circle me-2"></i>
                            Catálogo
                        </Link>
                    )}
                </div>

                <div className="mt-5 pt-4 opacity-40">
                    <p className="small fw-bold text-uppercase tracking-wider text-muted mb-0" style={{ fontSize: '0.6rem' }}>
                        Garoo © 2026 • Inteligencia operativa
                    </p>
                </div>
            </div>

            <style>{`
                .btn-modern-primary {
                    background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                    display: inline-flex;
                    align-items: center;
                    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.15);
                }

                .btn-modern-primary:hover {
                    background: linear-gradient(135deg, #4338ca 0%, #1d4ed8 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.3);
                    color: white;
                }

                .btn-modern-outline {
                    background: transparent;
                    color: #475569;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 12px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                }

                .btn-modern-outline:hover {
                    background: #f8fafc;
                    border-color: #cbd5e1;
                    color: #0f172a;
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default Home;