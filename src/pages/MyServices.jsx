import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServices } from "../context/ServicesContext";
import styles from "./Services.module.css";
import { Spinner } from "react-bootstrap";

const MyServices = () => {
    const navigateTo = useNavigate();
    const { userServices, loading } = useServices();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredServices = searchTerm
        ? userServices.filter(s => 
            s.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
            s.sublabel.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : userServices;

    const handleButtonClick = (service) => {
        navigateTo(service.path);
    };

    if (loading) {
        return (
            <div className="page-container animate-in d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <Spinner animation="grow" variant="primary" className="mb-3" />
                <p className="text-muted fw-bold">Sincronizando tus accesos...</p>
            </div>
        );
    }

    return (
        <div className="page-container animate-in">
            <div className={styles.header}>
                <h1 className={styles.title}>Mis Servicios</h1>
                <p className={styles.subtitle}>
                    Accede a las herramientas inteligentes configuradas para tu operación.
                </p>
                
                <div className="mt-4 mx-auto position-relative" style={{ maxWidth: '500px' }}>
                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 opacity-50" style={{ color: 'var(--text-main)' }}></i>
                    <input 
                        type="text" 
                        className="form-control"
                        style={{ 
                            background: '#cbd5e1', 
                            border: '2px solid #94a3b8', 
                            borderRadius: '16px',
                            padding: '12px 16px 12px 48px',
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            color: 'var(--text-main)',
                            boxShadow: 'none'
                        }}
                        placeholder="Filtrar servicios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {filteredServices.length > 0 ? (
                <div className={styles.grid}>
                    {filteredServices.map((service, index) => (
                        <div
                            key={index}
                            className={`${styles.card} ${service.cardClass || styles.defaultCard}`}
                            onClick={() => handleButtonClick(service)}
                            role="button"
                        >
                            <div className={styles.topInfo}>
                                <div className={styles.iconWrapper}>
                                    <i className={service.icon}></i>
                                </div>
                                <span className={styles.badge}>{service.sublabel}</span>
                                <h3 className={styles.cardTitle}>{service.label}</h3>
                                <p className={styles.cardDesc}>
                                    {service.description || "Herramienta operativa configurada para tu acceso exclusivo."}
                                </p>
                            </div>

                            <div className={styles.cardFooter}>
                                <span className={styles.exploreText}>
                                    Abrir servicio
                                    <i className="bi bi-arrow-right-short fs-4"></i>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-5 text-center mt-4">
                    <div className="mb-4">
                        <i className="bi bi-grid-3x3-gap text-light-emphasis" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h5 className="fw-900 mb-2">No se encontraron servicios</h5>
                    <p className="text-muted px-md-5">
                        Si crees que esto es un error, por favor contacta con soporte o verifica tu suscripción a herramientas de Garoo.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MyServices;
