import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="page-container animate-in d-flex align-items-center" style={{ minHeight: "80vh" }}>
            <div className="row w-100 g-5 align-items-center">
                <div className="col-12 col-lg-6">
                    <div className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 mb-4 fw-800" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                        GAARO INTELLIGENCE PLATFORM 2026
                    </div>
                    <h1 className="display-2 fw-950 mb-4" style={{ letterSpacing: "-0.05em", color: "#0f172a", lineHeight: 0.95 }}>
                        Impulsa tu <span className="text-primary">Operación</span> con IA
                    </h1>
                    <p className="fs-5 text-muted mb-5 pe-lg-5 fw-500" style={{ lineHeight: 1.6 }}>
                        La plataforma centralizada más potente para la gestión inteligente de datos, optimización de flujos de trabajo y automatización de procesos empresariales críticos.
                    </p>
                    <div className="d-flex flex-wrap gap-3">
                        <Link to="/services" className="btn-premium btn-premium-primary px-5 py-3 fs-5">
                            Explorar Servicios
                            <i className="bi bi-arrow-right"></i>
                        </Link>
                        <Link to="/my-services" className="btn-premium btn-premium-secondary px-5 py-3 fs-5">
                            Mis Herramientas
                        </Link>
                    </div>
                    
                    <div className="mt-5 d-flex align-items-center gap-4 border-top pt-5">
                        <div className="d-flex flex-column">
                            <span className="h4 fw-900 mb-0">+10</span>
                            <span className="text-muted small fw-bold text-uppercase opacity-75">Servicios</span>
                        </div>
                        <div className="border-end h-100 mx-2" style={{ borderRight: '2px solid #e2e8f0' }}></div>
                        <div className="d-flex flex-column">
                            <span className="h4 fw-900 mb-0">99.9%</span>
                            <span className="text-muted small fw-bold text-uppercase opacity-75">Uptime AI</span>
                        </div>
                        <div className="border-end h-100 mx-2" style={{ borderRight: '2px solid #e2e8f0' }}></div>
                        <div className="d-flex flex-column">
                            <span className="h4 fw-900 mb-0">24/7</span>
                            <span className="text-muted small fw-bold text-uppercase opacity-75">Soporte</span>
                        </div>
                    </div>
                </div>
                
                <div className="col-12 col-lg-6 d-none d-lg-block">
                    <div className="position-relative">
                        {/* Abstract Premium Visual Element */}
                        <div className="glass-card p-4 rounded-4 shadow-lg animate-in" style={{ transform: 'rotate(-2deg)', zIndex: 2 }}>
                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="rounded-circle bg-primary" style={{ width: 40, height: 40 }}></div>
                                <div className="flex-grow-1">
                                    <div className="bg-light rounded-pill mb-2" style={{ height: 10, width: '40%' }}></div>
                                    <div className="bg-light rounded-pill" style={{ height: 8, width: '70%' }}></div>
                                </div>
                            </div>
                            <div className="rounded-3 bg-light mb-3" style={{ height: 180 }}></div>
                            <div className="d-flex gap-2">
                                <div className="bg-primary-subtle flex-grow-1 rounded-2" style={{ height: 40 }}></div>
                                <div className="bg-light flex-grow-1 rounded-2" style={{ height: 40 }}></div>
                            </div>
                        </div>
                        
                        <div className="position-absolute top-50 start-50 translate-middle" style={{ width: '120%', height: '120%', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', zIndex: 1 }}></div>
                        
                        <div className="glass-card p-3 rounded-4 position-absolute shadow-md" style={{ bottom: -40, right: 0, width: 220, transform: 'rotate(5deg)', zIndex: 3 }}>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <i className="bi bi-robot text-primary fs-5"></i>
                                <span className="small fw-900">Garoo Copilot</span>
                            </div>
                            <p className="small text-muted mb-0">Optimizando procesos en tiempo real...</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .fw-950 { font-weight: 950; }
                .fw-900 { font-weight: 900; }
                .fw-800 { font-weight: 800; }
                .fw-500 { font-weight: 500; }
            `}</style>
        </div>
    );
};

export default Home;