import React from "react";
import { useNavigate } from "react-router-dom";
import { ALL_SERVICES } from "../constants/services";
import styles from "./Services.module.css";

const Services = () => {
    const navigateTo = useNavigate();

    const handleButtonClick = (service) => {
        if (service.external) {
            window.open(service.path, "_blank", "noopener,noreferrer");
            return;
        }
        navigateTo(service.path);
    };

    return (
        <div className="page-container animate-in">
            <div className={styles.header}>
                <h1 className={styles.title}>Catálogo</h1>
                <p className={styles.subtitle}>
                    Explora nuestra suite de herramientas inteligentes diseñadas para transformar y automatizar tu operación diaria.
                </p>
            </div>

            <div className={styles.grid}>
                {ALL_SERVICES.map((service, index) => (
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
                            <span className={styles.badge}>{service.sublabel || 'Garoo Service'}</span>
                            <h3 className={styles.cardTitle}>{service.label}</h3>
                            <p className={styles.cardDesc}>
                                {service.description}
                            </p>
                        </div>

                        <div className={styles.cardFooter}>
                            <span className={styles.exploreText}>
                                Acceder herramienta
                                <i className="bi bi-arrow-right-short fs-4"></i>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
