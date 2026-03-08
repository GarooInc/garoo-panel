import "./sidebar.css";
import garooLogo from "../../assets/img/garoo-logo.png";

import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { useEffect } from "react";

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    useEffect(() => {
        if (window.innerWidth < 992) {
            onClose?.();
        }
    }, [location.pathname, onClose]);

    const generalItems = [
        {
            id: "dashboard",
            path: "/dashboard",
            icon: "bi bi-speedometer2",
            label: "Panel Principal",
        },
        {
            id: "services",
            path: "/services",
            icon: "bi bi-grid-3x3-gap",
            label: "Servicios",
        },
    ];

    const serviceItems = [
        {
            id: "applications",
            path: "/applications",
            icon: "bi bi-person-vcard",
            label: "Gestor de Aplicaciones",
            sublabel: "RocknRolla",
            color: "#3b82f6",
            bgColor: "rgba(59,130,246,0.08)",
            openInNewTab: true,
        },
        {
            id: "form",
            path: "/form",
            icon: "bi bi-receipt-cutoff",
            label: "Facturación",
            sublabel: "Mundo Verde",
            color: "#10b981",
            bgColor: "rgba(16,185,129,0.08)",
            openInNewTab: true,
        },
        {
            id: "outbound-call-form",
            path: "/outbound-call-form",
            icon: "bi bi-telephone-outbound",
            label: "Formulario de Llamadas",
            sublabel: "Banco Ficohsa",
            color: "#f59e0b",
            bgColor: "rgba(245,158,11,0.08)",
            openInNewTab: true,
        },
        {
            id: "spectrum-leads",
            path: "/spectrum-leads",
            icon: "bi bi-graph-up-arrow",
            label: "Panel de Leads",
            sublabel: "Spectrum",
            color: "#8b5cf6",
            bgColor: "rgba(139,92,246,0.08)",
            openInNewTab: true,
        },
        {
            id: "pepsi-video-analysis",
            path: "/video-analysis",
            icon: "bi bi-play-circle",
            label: "Análisis de Video",
            sublabel: "Pepsi",
            color: "#005cb4",
            bgColor: "rgba(0,92,180,0.08)",
            openInNewTab: true,
        },
        {
            id: "agent-onboarding",
            path: "/agent-onboarding",
            icon: "bi bi-robot",
            label: "Configuración de Agente",
            sublabel: "Garoo Agent",
            color: "#e0c800",
            bgColor: "rgba(224,200,0,0.08)",
            openInNewTab: true,
        },
    ];

    const renderGeneralItem = (item) => {
        const isActive = location.pathname === item.path;
        const linkContent = (
            <>
                <i className={`${item.icon} fs-5`}></i>
                <span style={{ fontWeight: isActive ? "600" : "400" }}>
                    {item.label}
                </span>
            </>
        );
        const commonProps = {
            className: `nav-link d-flex align-items-center gap-3 px-3 py-2 sidebar-link ${isActive ? 'active-general' : ''}`,
            style: {
                fontSize: "0.92rem",
                transition: "all 0.2s ease",
                color: isActive
                    ? "var(--primary-color)"
                    : "var(--text-secondary)",
                borderRadius: "10px",
                fontWeight: isActive ? "700" : "500",
            },
        };
        return (
            <Nav.Item key={item.id}>
                <Nav.Link as={Link} to={item.path} {...commonProps}>
                    {linkContent}
                </Nav.Link>
            </Nav.Item>
        );
    };

    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? "show" : ""}`}
                onClick={onClose}
            />

            <div className={`sidebar ${isOpen ? "show" : ""}`}>
                {/* Brand */}
                <div className="sidebar-brand">
                    <div className="sidebar-logo-ring">
                        <img
                            src={garooLogo}
                            alt="Garoo"
                            className="sidebar-logo-img"
                        />
                    </div>
                    <span className="sidebar-brand-name">Garoo</span>
                </div>

                <div className="sidebar-content py-3 px-3">
                    {/* General section */}
                    <div className="sidebar-section">
                        <span className="sidebar-section-label">General</span>
                        <Nav className="flex-column gap-1 mt-1">
                            {generalItems.map(renderGeneralItem)}
                        </Nav>
                    </div>

                    {/* Divider */}
                    <div className="sidebar-divider"></div>

                    {/* Services section */}
                    <div className="sidebar-section">
                        <span className="sidebar-section-label">Servicios</span>
                        <Nav className="flex-column gap-1 mt-1">
                            {serviceItems.map((item) => {
                                const isActive =
                                    location.pathname === item.path;
                                const linkContent = (
                                    <>
                                        <span
                                            className="sidebar-service-icon"
                                            style={{
                                                background: isActive
                                                    ? item.color
                                                    : item.bgColor,
                                                color: isActive
                                                    ? "#fff"
                                                    : item.color,
                                            }}
                                        >
                                            <i className={`${item.icon}`}></i>
                                        </span>
                                        <span className="sidebar-service-text">
                                            <span
                                                className="sidebar-service-name"
                                                style={{
                                                    fontWeight: isActive
                                                        ? "700"
                                                        : "600",
                                                }}
                                            >
                                                {item.label}
                                            </span>
                                            <span className="sidebar-service-client">
                                                {item.sublabel}
                                            </span>
                                        </span>
                                        {isActive && (
                                            <span
                                                className="ms-auto"
                                                style={{
                                                    width: '4px',
                                                    height: '16px',
                                                    background: item.color,
                                                    borderRadius: '4px',
                                                    boxShadow: `0 0 8px ${item.color}60`
                                                }}
                                            />
                                        )}
                                    </>
                                );

                                const commonProps = {
                                    className: `nav-link d-flex align-items-center gap-3 px-2 py-2 sidebar-link`,
                                    style: {
                                        fontSize: "0.88rem",
                                        transition: "all 0.2s ease",
                                        borderRadius: "10px",
                                        color: isActive
                                            ? item.color
                                            : "var(--text-secondary)",
                                        backgroundColor: isActive
                                            ? item.bgColor
                                            : "transparent",
                                        border: `1px solid ${isActive ? item.color + "30" : "transparent"}`,
                                    },
                                };

                                return (
                                    <Nav.Item key={item.id}>
                                        {item.openInNewTab ? (
                                            <a
                                                href={item.path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                {...commonProps}
                                            >
                                                {linkContent}
                                            </a>
                                        ) : (
                                            <Nav.Link
                                                as={Link}
                                                to={item.path}
                                                {...commonProps}
                                            >
                                                {linkContent}
                                            </Nav.Link>
                                        )}
                                    </Nav.Item>
                                );
                            })}
                        </Nav>
                    </div>
                </div>

                {/* Footer */}
                <div className="sidebar-footer">
                    <span className="sidebar-footer-text">
                        Servicios Garoo v2.0
                    </span>
                </div>
            </div>

            <style>{`
                .hover-bg-light:hover {
                    background-color: #f1f5f9 !important;
                    color: var(--text-main) !important;
                }
                .transition-all {
                    transition: all 0.2s ease;
                }
            `}</style>
        </>
    );
};

export default Sidebar;
