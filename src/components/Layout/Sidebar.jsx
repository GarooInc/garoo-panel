import "./sidebar.css";

import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { useEffect } from "react";

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    useEffect(() => {
        if (window.innerWidth < 992) {
            onClose?.();
        }
    }, [location.pathname]);

    const menuItems = [
        {
            id: "dashboard",
            path: "/dashboard",
            icon: "bi bi-speedometer2",
            label: "Dashboard",
        },
        {
            id: "services",
            path: "/services",
            icon: "bi bi-grid-3x3-gap",
            label: "Servicios",
        },
        {
            id: "applications",
            path: "/applications",
            icon: "bi bi-app-indicator",
            label: "Aplicaciones",
        },
        {
            id: "form",
            path: "/form",
            icon: "bi bi-file-earmark-text",
            label: "Formulario",
            openInNewTab: true,
        },
        {
            id: "outbound-call-form",
            path: "/outbound-call-form",
            icon: "bi bi-file-earmark-text",
            label: "Formulario de llamadas",
            openInNewTab: true,
        },
    ];

    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? "show" : ""}`}
                onClick={onClose}
            />

            <div className={`sidebar ${isOpen ? "show" : ""}`}>
                <div className="py-4 px-3">
                    <Nav className="flex-column gap-1">
                        {menuItems.map((item) => {
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
                                className: `nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 transition-all ${isActive ? "bg-primary-subtle text-primary" : "text-secondary hover-bg-light"
                                    }`,
                                style: {
                                    fontSize: "0.95rem",
                                    transition: "all 0.2s ease",
                                    backgroundColor: isActive ? "var(--primary-light)" : "transparent",
                                    color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
                                    borderRadius: "8px",
                                }
                            };

                            return (
                                <Nav.Item key={item.id}>
                                    {item.openInNewTab ? (
                                        <a href={item.path} target="_blank" rel="noopener noreferrer" {...commonProps}>
                                            {linkContent}
                                        </a>
                                    ) : (
                                        <Nav.Link as={Link} to={item.path} {...commonProps}>
                                            {linkContent}
                                        </Nav.Link>
                                    )}
                                </Nav.Item>
                            );
                        })}
                    </Nav>
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
