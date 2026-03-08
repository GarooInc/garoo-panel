import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Services.module.css";

const Services = () => {
    const navigateTo = useNavigate();

    const services = [
        {
            title: "RocknRolla Aplicaciones",
            description:
                "Selección de talento calificado para tu empresa, adaptado a tus necesidades específicas.",
            icon: "bi-person-vcard",
            path: "/applications",
            cardClass: styles.jobCard,
            openInNewTab: true,
        },
        {
            title: "Formulario Mundo Verde",
            description:
                "Envío rápido y seguro de datos de facturas para procesamiento eficiente.",
            icon: "bi-receipt-cutoff",
            path: "/form",
            cardClass: styles.formCard,
            openInNewTab: true,
        },
        {
            title: "Formulario de Llamadas",
            description:
                "Gestiona y registra llamadas outbound de forma rápida y estructurada.",
            icon: "bi-telephone-outbound",
            path: "/outbound-call-form",
            cardClass: styles.callCard,
            openInNewTab: true,
        },
        {
            title: "Spectrum Leads",
            description:
                "Panel de leads en tiempo real conectado al agente de Spectrum vía webhook.",
            icon: "bi-graph-up-arrow",
            path: "/spectrum-leads",
            cardClass: styles.spectrumCard,
            openInNewTab: true,
        },
        {
            title: "Pepsi Video Analysis",
            description:
                "Visualización de métricas, engagement y análisis de sentimiento para contenido en video.",
            icon: "bi-play-circle",
            path: "/video-analysis",
            cardClass: styles.pepsiCard,
            openInNewTab: true,
        },
        {
            title: "Garoo Agent",
            description:
                "Configura y personaliza tu agente conversacional con conocimiento, comportamiento e integraciones para tu negocio.",
            icon: "bi-robot",
            path: "/agent-onboarding",
            cardClass: styles.agentCard,
            openInNewTab: true,
        },
    ];
    const handleButtonClick = (service) => {
        if (service.openInNewTab) {
            window.open(service.path, "_blank", "noopener,noreferrer");
        } else {
            navigateTo(service.path);
        }
    };

    return (
        <div className={styles.servicesContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Nuestros Servicios</h1>
                <p className={styles.subtitle}>
                    Soluciones tecnológicas diseñadas para impulsar el
                    crecimiento, la eficiencia y la automatización en tu
                    empresa.
                </p>
            </div>

            <div className={styles.grid}>
                {services.map((service, index) => (
                    <div
                        key={index}
                        className={`${styles.card} ${service.cardClass}`}
                        onClick={() => handleButtonClick(service)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                handleButtonClick(service);
                            }
                        }}
                    >
                        <div className={styles.iconContainer}>
                            <i className={`bi ${service.icon}`}></i>
                        </div>

                        <h3 className={styles.cardTitle}>{service.title}</h3>

                        <p className={styles.cardDesc}>{service.description}</p>

                        <button
                            className={styles.enterBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleButtonClick(service);
                            }}
                            aria-label={`Entrar a ${service.title}`}
                        >
                            Explorar servicio
                            <i
                                className={`bi bi-arrow-right ${styles.arrowIcon}`}
                            ></i>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;
