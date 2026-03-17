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
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
                        <div className="brand-circle">
                            <img src={garooLogo} alt="Garoo" />
                        </div>
                        <span className="brand-name">Garoo</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="main-navbar-nav" className="border-0 shadow-none" />

                    <Navbar.Collapse id="main-navbar-nav">
                        <Nav className="mx-auto nav-tabs-pills">
                            <Nav.Link 
                                as={Link} 
                                to="/services" 
                                className={`nav-pill-item ${location.pathname === '/services' ? 'is-active' : ''}`}
                            >
                                <i className="bi bi-grid-fill"></i>
                                <span>Catálogo</span>
                            </Nav.Link>

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
                    background: #1e293b; /* Deep slate / Navy */
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    z-index: 1100;
                    box-shadow: 0 4px 20px -5px rgba(0,0,0,0.2);
                    transition: all 0.3s ease;
                }

                .brand-circle {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1.2px solid white; /* Thinner sophisticated white border */
                    box-shadow: 
                        0 0 15px rgba(255, 255, 255, 0.25), /* Outer halo */
                        0 8px 16px rgba(0,0,0,0.3);
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                    background: #000033;
                }
                .brand-circle:hover {
                    transform: scale(1.15) rotate(8deg);
                    box-shadow: 
                        0 0 25px rgba(255, 255, 255, 0.4), /* Brighter halo on hover */
                        0 12px 24px rgba(0,0,0,0.4);
                    border-color: white;
                }
                .brand-circle img { 
                    width: 100%; 
                    height: 100%; 
                    object-fit: cover; /* Ensures the blue fills the circle */
                }
                .brand-name { 
                    font-weight: 950; 
                    font-size: 1.45rem; 
                    color: white; 
                    letter-spacing: -0.05em;
                    margin-left: -4px;
                    background: linear-gradient(to right, #ffffff, #94a3b8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .nav-tabs-pills {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 100px;
                    padding: 4px;
                    gap: 2px;
                    border: 1px solid rgba(255,255,255,0.08);
                }
                .nav-pill-item {
                    display: flex; align-items: center; gap: 8px;
                    padding: 8px 24px !important; border-radius: 100px;
                    font-weight: 800; font-size: 0.85rem; color: #94a3b8 !important;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .nav-pill-item.is-active {
                    background: white; color: #0f172a !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .nav-pill-item i { font-size: 1rem; opacity: 0.5; }
                .nav-pill-item.is-active i { opacity: 1; }

                .user-profile-pill {
                    display: flex; align-items: center; gap: 12px;
                    padding: 4px 12px 4px 4px; border-radius: 100px;
                    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.08);
                    cursor: pointer; transition: all 0.2s;
                }
                .user-profile-pill:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255,255,255,0.15); }
                .user-avatar {
                    width: 32px; height: 32px;
                    background: white;
                    color: #0f172a; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; font-size: 0.8rem;
                }
                .user-info { flex-direction: column; line-height: 1.1; }
                .user-display-name { font-size: 0.75rem; font-weight: 800; color: white; }
                .user-display-role { font-size: 0.6rem; font-weight: 900; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; }

                .profile-dropdown-custom .dropdown-toggle::after { display: none !important; }
                .profile-dropdown-custom .bi-chevron-down { color: #94a3b8; opacity: 1 !important; }
                .profile-dropdown-custom:hover .bi-chevron-down { color: white; }

                .profile-dropdown-custom .dropdown-menu {
                    border: 1px solid #e2e8f0; border-radius: 20px; padding: 8px;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); margin-top: 10px;
                    background: white;
                }
                .dropdown-header-custom { padding: 12px 16px; }
                .dropdown-header-custom .email { font-size: 0.8rem; font-weight: 700; color: #1e293b; margin: 0; }
                .role-badge { 
                    font-size: 0.55rem; font-weight: 950; background: #3b82f6; color: white;
                    padding: 2px 8px; border-radius: 4px; display: inline-block; margin-top: 4px;
                    letter-spacing: 0.05em;
                }
                .dropdown-item-premium { 
                    padding: 10px 16px; border-radius: 12px; font-size: 0.85rem; font-weight: 700; color: #475569;
                    transition: all 0.2s;
                }
                .dropdown-item-premium:hover { background: #f1f5f9; color: #2563eb; }
                .dropdown-item-logout {
                    padding: 10px 16px; border-radius: 12px; font-size: 0.85rem; font-weight: 800; color: #ef4444;
                }
                .dropdown-item-logout:hover { background: #fef2f2; color: #ef4444; }
                
                .no-caret-dropdown .dropdown-toggle::after { display: none; }
            `}</style>
        </header>
    );
};

export default Header;
