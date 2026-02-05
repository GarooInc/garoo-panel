import "./sidebar.css";

import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { useEffect } from "react";

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();

    // Cerrar el sidebar cuando cambie la ruta (en móviles)
    useEffect(() => {
        if (window.innerWidth < 992) {
            onClose?.();
        }
    }, [location.pathname, onClose]);

    const menuItems = [
        {
            id: "home",
            path: "/",
            icon: "bi bi-house-door",
            label: "Inicio",
        },
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
        },
        {
            id: "outbound-call-form",
            path: "/outbound-call-form",
            icon: "bi bi-file-earmark-text",
            label: "Formulario de llamadas",
        },
        {
            id: "gallery",
            path: "/gallery",
            icon: "bi bi-images",
            label: "Galería",
        },
        {
            id: "data-agent",
            path: "/data-agent",
            icon: "bi bi-database",
            label: "Data Agent",
        },
        {
            id: "ai-tools",
            path: "/ai-tools",
            icon: "bi bi-robot",
            label: "Herramientas IA",
        },
        {
            id: "bot",
            path: "/bot",
            icon: "bi bi-chat-dots",
            label: "Bot",
        },
    ];

    return (
        <>
            {/* Overlay para cerrar el sidebar en móviles */}
            <div
                className={`sidebar-overlay ${isOpen ? "show" : ""}`}
                onClick={onClose}
            />

            <div
                className={`bg-light border-end h-100 sidebar ${isOpen ? "show" : ""}`}
            >
                <div className="p-3">
                    <Nav className="flex-column">
                        {menuItems.map((item) => (
                            <Nav.Item key={item.id} className="mb-2">
                                <Nav.Link
                                    as={Link}
                                    to={item.path}
                                    className={`d-flex align-items-center gap-2 px-3 py-2 rounded ${
                                        location.pathname === item.path
                                            ? "bg-primary text-white"
                                            : "text-dark"
                                    }`}
                                    style={{
                                        textDecoration: "none",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <i className={item.icon}></i>
                                    <span>{item.label}</span>
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
