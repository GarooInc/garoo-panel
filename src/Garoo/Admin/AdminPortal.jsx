import React, { useState, useEffect } from "react";
import { redtecInstance } from "../../api/axios";
import { Spinner, Badge, Modal, Button } from "react-bootstrap";

const AdminPortal = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const res = await redtecInstance.get("/clients");
                const rawData = res.data;
                let list = [];
                
                if (Array.isArray(rawData) && rawData.length > 0) {
                    list = rawData[0].clients_list || [];
                } else if (rawData.clients_list) {
                    list = rawData.clients_list;
                }

                // Mapeamos para obtener el objeto client_data directamente
                const data = list.map(item => item.client_data).filter(Boolean);
                
                setClients(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching admin data:", err);
                setError("Error al obtener la lista de clientes administrador.");
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const handleRowClick = (client) => {
        setSelectedClient(client);
        setShowModal(true);
    };

    return (
        <div className="page-container animate-in">
            <style>{`
                .admin-header-v2 {
                    background: #fff;
                    padding: 1.5rem 2rem;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .admin-title-v2 {
                    font-size: 1.5rem;
                    font-weight: 950;
                    color: #0f172a;
                    letter-spacing: -1px;
                    margin: 0;
                }
                .table-shell-v2 {
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                    max-width: 1000px;
                    width: 100%;
                    margin: 0 auto;
                }
                .custom-table-v2 {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                }
                .custom-table-v2 th {
                    background: #f8fafc;
                    padding: 0.75rem 1.25rem;
                    font-size: 0.65rem;
                    font-weight: 850;
                    color: #64748b;
                    text-transform: uppercase;
                    border-bottom: 1px solid #f1f5f9;
                }
                .custom-table-v2 td {
                    padding: 0.6rem 1.25rem;
                    font-size: 0.85rem;
                    color: #475569;
                    border-bottom: 1px solid #f1f5f9;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .custom-table-v2 tr {
                    cursor: pointer;
                }
                .custom-table-v2 tr:last-child td {
                    border-bottom: none;
                }
                .custom-table-v2 tr:hover td {
                    background: #f8faff;
                    color: #2563eb;
                }
                .client-name-v2 {
                    font-weight: 800;
                    color: inherit;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .role-badge-v2 {
                    font-size: 0.6rem;
                    font-weight: 950;
                    padding: 2px 10px;
                    border-radius: 100px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .role-admin { background: #fee2e2; color: #ef4444; border: 1px solid #fecaca; }
                .role-client { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
                
                .pass-wrapper {
                    font-family: 'JetBrains Mono', monospace;
                    background: #f1f5f9;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    color: #64748b;
                }
                
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #f1f5f9;
                }
                .detail-label { font-weight: 800; color: #64748b; font-size: 0.75rem; text-transform: uppercase; }
                .detail-value { font-weight: 700; color: #1e293b; }

                .service-tag {
                    display: inline-block;
                    background: #f1f5f9;
                    color: #475569;
                    padding: 4px 12px;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 800;
                    margin: 2px;
                    border: 1px solid #e2e8f0;
                }

                .empty-state-v2 {
                    padding: 4rem;
                    text-align: center;
                    color: #94a3b8;
                }
            `}</style>

            <div className="admin-header-v2" style={{ maxWidth: '1000px', width: '100%', margin: '0 auto 1.5rem auto' }}>
                <div>
                    <h1 className="admin-title-v2">Control de Accesos</h1>
                    <p className="text-muted small fw-700 mb-0 uppercase tracking-widest mt-1">Gestión de Credenciales</p>
                </div>
                <Badge bg="primary-subtle" className="text-primary border border-primary-subtle rounded-pill px-3 py-2 fw-800">
                    SISTEMA ACTIVO
                </Badge>
            </div>

            <div className="table-shell-v2">
                {loading ? (
                    <div className="empty-state-v2 d-flex flex-column align-items-center gap-3">
                        <Spinner animation="grow" variant="primary" size="sm" />
                        <span className="fw-800 text-xs">Sincronizando...</span>
                    </div>
                ) : error ? (
                    <div className="empty-state-v2">
                        <i className="bi bi-exclamation-triangle-fill text-danger fs-2 mb-3"></i>
                        <h6 className="fw-900 text-dark mb-1">Error de Sincronización</h6>
                        <p className="small">{error}</p>
                    </div>
                ) : clients.length > 0 ? (
                    <div className="table-responsive">
                        <table className="custom-table-v2">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Usuario</th>
                                    <th>Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client, i) => (
                                    <tr key={client._id || i} onClick={() => handleRowClick(client)}>
                                        <td>
                                            <div className="client-name-v2">
                                                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-900 ${client.role === 'admin' ? 'bg-danger text-white' : 'bg-primary-subtle text-primary'}`} style={{ width: 24, height: 24, fontSize: '0.65rem' }}>
                                                    {(client.name || "C").charAt(0).toUpperCase()}
                                                </div>
                                                {client.name}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="fw-700">{client.credentials?.user}</span>
                                        </td>
                                        <td>
                                            <span className={`role-badge-v2 ${client.role === 'admin' ? 'role-admin' : 'role-client'}`}>
                                                {client.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="empty-state-v2">
                        <i className="bi bi-people-fill fs-2 mb-3 opacity-20"></i>
                        <h6 className="fw-900 text-dark mb-1">Sin datos</h6>
                    </div>
                )}
            </div>

            {/* Modal de Detalle */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0 shadow-none">
                    <Modal.Title className="fw-900 fs-5">Detalle del Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedClient && (
                        <div>
                            <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-4">
                                <div className={`rounded-circle d-flex align-items-center justify-content-center fw-900 fs-4 ${selectedClient.role === 'admin' ? 'bg-danger text-white' : 'bg-primary text-white'}`} style={{ width: 60, height: 60 }}>
                                    {selectedClient.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="fw-950 mb-0">{selectedClient.name}</h4>
                                    <span className={`role-badge-v2 ${selectedClient.role === 'admin' ? 'role-admin' : 'role-client'}`}>
                                        {selectedClient.role}
                                    </span>
                                </div>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">ID Sistema</span>
                                <span className="detail-value text-muted small">{selectedClient._id}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Usuario</span>
                                <span className="detail-value">{selectedClient.credentials?.user}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Contraseña</span>
                                <span className="detail-value pass-wrapper px-2 py-1">{selectedClient.credentials?.pass}</span>
                            </div>

                            <div className="mt-4">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <p className="detail-label mb-0">Servicios Asignados</p>
                                    <Badge bg="secondary-subtle" className="text-secondary border border-secondary-subtle rounded-pill px-2 py-1 fw-700" style={{ fontSize: '0.6rem' }}>
                                        {selectedClient.services_list?.length || 0} TOTAL
                                    </Badge>
                                </div>
                                
                                {selectedClient.services_list && selectedClient.services_list.length > 0 && selectedClient.services_list[0].name ? (
                                    <div className="service-table-wrapper rounded-3 border overflow-hidden">
                                        <table className="w-100 small">
                                            <thead>
                                                <tr className="bg-light border-bottom text-muted fw-800" style={{ fontSize: '0.65rem' }}>
                                                    <td className="p-2">SERVICIO</td>
                                                    <td className="p-2">SLUG</td>
                                                    <td className="p-2">ID INTERNO</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedClient.services_list.map((service, idx) => (
                                                    <tr key={idx} className="border-bottom hover-row">
                                                        <td className="p-2 fw-800 text-dark">{service.name}</td>
                                                        <td className="p-2"><span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-700" style={{ fontSize: '0.6rem' }}>{service.slug}</span></td>
                                                        <td className="p-2 text-muted truncate" style={{ fontSize: '0.7rem', maxWidth: '80px' }}>{service._id}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-3 text-center border border-dashed rounded-4 bg-light">
                                        <span className="text-muted small fw-700 italic opacity-50">No hay servicios configurados para este cliente</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" onClick={() => setShowModal(false)} className="rounded-pill fw-800 px-4">
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            <style>{`
                .service-table-wrapper table td { vertical-align: middle; }
                .hover-row:hover { background: #f8fafc; }
                .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .border-dashed { border-style: dashed !important; }
            `}</style>
        </div>
    );
};

export default AdminPortal;
