import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import garooLogo from "../../assets/img/garoo-logo.png";

const Header = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    return (
        <header className="fixed-top header-glass">
            <Navbar expand="lg" className="border-bottom py-0" style={{ height: 'var(--header-height)' }}>
                <Container fluid className="px-4 h-100">
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                        <div className="brand-circle">
                            <img src={garooLogo} alt="Garoo" />
                        </div>
                        <div className="brand-text-wrapper">
                            <span className="brand-name">Garoo</span>
                            <span className="brand-subtitle">PORTAL</span>
                        </div>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="main-navbar-nav" className="border-0 shadow-none" />

                    <Navbar.Collapse id="main-navbar-nav">
                        <Nav className="mx-auto nav-tabs-pills">
                            {user?.client === "admin" && (
                                <Nav.Link 
                                    as={Link} 
                                    to="/services" 
                                    className={`nav-pill-item ${location.pathname === '/services' ? 'is-active' : ''}`}
                                >
                                    <i className="bi bi-grid-fill"></i>
                                    <span>Catálogo</span>
                                </Nav.Link>
                            )}

                            <Nav.Link 
                                as={Link} 
                                to="/my-services" 
                                className={`nav-pill-item ${location.pathname === '/my-services' ? 'is-active' : ''}`}
                            >
                                <i className="bi bi-star-fill"></i>
                                <span>Mis Servicios</span>
                            </Nav.Link>

                            {user?.client === "admin" && (
                                <Nav.Link 
                                    as={Link} 
                                    to="/admin-portal" 
                                    className={`nav-pill-item ${location.pathname === '/admin-portal' ? 'is-active' : ''}`}
                                >
                                    <i className="bi bi-shield-lock-fill"></i>
                                    <span>Administración</span>
                                </Nav.Link>
                            )}
                        </Nav>

                        <Nav className="align-items-center gap-2">
                            {user ? (
                                <NavDropdown 
                                    title={
                                        <div className="user-profile-pill">
                                            <div className="user-avatar">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="user-info d-none d-xl-flex">
                                                <span className="user-display-name">{user.name}</span>
                                                <span className="user-display-role">{user.client}</span>
                                            </div>
                                            <i className="bi bi-chevron-down ms-1 opacity-50"></i>
                                        </div>
                                    } 
                                    id="profile-dropdown"
                                    align="end"
                                    className="profile-dropdown-custom"
                                >
                                    <div className="dropdown-header-custom">
                                        <p className="email">{user.email}</p>
                                        <span className="role-badge">{user.client.toUpperCase()}</span>
                                    </div>
                                    <NavDropdown.Divider className="mx-2" />
                                    <NavDropdown.Item as={Link} to="/dashboard" className="dropdown-item-premium">
                                        <i className="bi bi-speedometer2 me-2"></i> Panel Principal
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={logout} className="dropdown-item-logout">
                                        <i className="bi bi-box-arrow-left me-2"></i> Cerrar Sesión
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Link to="/login" className="btn-premium btn-premium-primary py-2 px-4 shadow-none">
                                    Acceder
                                </Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <style>{`
                .header-glass {
                    background: rgba(255, 255, 255, 0.75); /* White glass */
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid rgba(15, 23, 42, 0.08); /* Very subtle dark border */
                    z-index: 1100;
                    box-shadow: 0 4px 15px -10px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                }

                .brand-circle {
                    width: 44px;
                    height: 44px;
                    background: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    border: 2px solid #ffffff;
                    /* Glowing halo effect */
                    box-shadow: 
                        0 0 0 1px rgba(37, 99, 235, 0.08),
                        0 0 15px rgba(37, 99, 235, 0.25);
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    overflow: hidden;
                }
                .brand-circle:hover {
                    transform: scale(1.05);
                    box-shadow: 
                        0 0 0 1px rgba(37, 99, 235, 0.15),
                        0 0 25px rgba(37, 99, 235, 0.4);
                }
                .brand-circle img { 
                    width: 100%; 
                    height: 100%; 
                    object-fit: cover;
                    border-radius: 50%;
                }
                .brand-text-wrapper {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    margin-left: 14px;
                    height: 44px;
                }
                .brand-name { 
                    font-weight: 900; 
                    font-size: 1.3rem; 
                    color: #0f172a;
                    letter-spacing: -0.05em;
                    line-height: 1;
                    margin: 0;
                }
                .brand-subtitle {
                    font-size: 0.6rem;
                    font-weight: 950;
                    color: #3b82f6;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    line-height: 1;
                    margin-top: 4px;
                    opacity: 0.9;
                }

                .nav-tabs-pills {
                    background: rgba(15, 23, 42, 0.04); /* Subtle slate tint */
                    border-radius: 100px;
                    padding: 4px;
                    gap: 1px;
                    border: 1px solid rgba(15, 23, 42, 0.05);
                }
                .nav-pill-item {
                    display: flex; align-items: center; gap: 8px;
                    padding: 6px 18px !important; border-radius: 100px;
                    font-weight: 700; font-size: 0.8rem; color: #64748b !important;
                    transition: all 0.25s ease;
                }
                .nav-pill-item:hover {
                    color: #0f172a !important;
                    background: rgba(255,255,255,0.4);
                }
                .nav-pill-item.is-active {
                    background: white; color: #2563eb !important; /* Indigo Blue focus */
                    box-shadow: 0 4px 10px -2px rgba(0,0,0,0.08);
                }
                .nav-pill-item i { font-size: 0.9rem; opacity: 0.6; }
                .nav-pill-item.is-active i { opacity: 1; }

                .user-profile-pill {
                    display: flex; align-items: center; gap: 12px;
                    padding: 4px 14px 4px 4px; border-radius: 100px;
                    background: rgba(255, 255, 255, 0.5); 
                    border: 1px solid rgba(15, 23, 42, 0.08);
                    cursor: pointer; transition: all 0.3s ease;
                }
                .user-profile-pill:hover { 
                    background: white; 
                    border-color: #2563eb;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
                    transform: translateY(-1px);
                }
                .user-avatar {
                    width: 32px; height: 32px;
                    background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
                    color: white; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 850; font-size: 0.8rem;
                    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
                }
                .user-info { display: flex; flex-direction: column; line-height: 1.1; justify-content: center; }
                .user-display-name { font-size: 0.75rem; font-weight: 850; color: #1e293b; white-space: nowrap; }
                .user-display-role { font-size: 0.55rem; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.02em; opacity: 0.8; }

                .profile-dropdown-custom .dropdown-toggle::after { display: none !important; }
                .profile-dropdown-custom .bi-chevron-down { color: #94a3b8; font-size: 0.8rem; }

                .profile-dropdown-custom .dropdown-menu {
                    border: 1px solid #e2e8f0; border-radius: 16px; padding: 6px;
                    box-shadow: 0 10px 30px -5px rgba(0,0,0,0.1); margin-top: 8px;
                    background: white;
                }
                .dropdown-header-custom { padding: 10px 14px; }
                .dropdown-header-custom .email { font-size: 0.75rem; font-weight: 700; color: #1e293b; margin: 0; }
                .role-badge { 
                    font-size: 0.5rem; font-weight: 950; background: #2563eb; color: white;
                    padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 4px;
                }
                .dropdown-item-premium { 
                    padding: 8px 14px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; color: #64748b;
                    transition: all 0.2s;
                }
                .dropdown-item-premium:hover { background: #f1f5f9; color: #2563eb; }
                .dropdown-item-logout {
                    padding: 8px 14px; border-radius: 10px; font-size: 0.8rem; font-weight: 800; color: #ef4444;
                }
                .no-caret-dropdown .dropdown-toggle::after { display: none; }
            `}</style>
        </header>
    );
};

export default Header;
