import { useState, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import { useApplications } from "./context/ApplicationsProvider";
import { useSimpleFilters } from "./hooks/useSimpleFilters";
import { generateWorkerPDF } from "./utils/pdfGenerator";
import WorkerModal from "./components/WorkerModal";
import ApplicationsFilters from "./components/ApplicationsFilters";
import ApplicationsTable from "./components/ApplicationsTable";
import ClientSidePagination from "../../../components/ClientSidePagination";

const RocknRollaApplications = () => {
    const { error, loading, data, nationalities, positions } = useApplications();
    const {
        searchTerm, setSearchTerm, sortOption, setSortOption, nationalityFilter, setNationalityFilter,
        positionFilter, setPositionFilter, salaryFilter, setSalaryFilter, dateFilter, setDateFilter,
        handleResetFilters, filteredWorkers,
    } = useSimpleFilters(data);

    const [showModal, setShowModal] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [activeTab, setActiveTab] = useState("candidates");
    const [copyStatus, setCopyStatus] = useState("Copy All");

    const handleViewDetails = useCallback((worker) => {
        setSelectedWorker(worker);
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedWorker(null);
    }, []);

    const handlePDFGeneration = useCallback(async (worker) => {
        try { generateWorkerPDF(worker); } catch (err) { alert(err.message || "Error al generar el PDF."); }
    }, []);

    const handleCopyJSON = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            setCopyStatus("¡Copiado!");
            setTimeout(() => setCopyStatus("Copy All"), 2000);
        } catch { setCopyStatus("Error"); }
    };

    return (
        <div className="page-container animate-in">
            <style>{`
                .apps-container { 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center;
                    width: 100%;
                    padding: 0 1rem; /* Margen de seguridad lateral */
                }
                
                .main-shell { 
                    background: rgba(255, 255, 255, 0.9); 
                    backdrop-filter: blur(20px);
                    border-radius: 20px; 
                    border: 1px solid #e2e8f0; 
                    overflow: hidden; 
                    display: flex; 
                    flex-direction: column; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                    max-width: 1000px;
                    width: 100%;
                    margin: 0 auto;
                    transition: max-width 0.3s ease;
                }

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
                    max-width: 1000px;
                    width: 100%;
                    margin: 0 auto 1.5rem auto;
                }
                .admin-title-v2 {
                    font-size: 1.15rem;
                    font-weight: 950;
                    color: #0f172a;
                    letter-spacing: -1px;
                    margin: 0;
                }

                .segmented-control {
                    display: flex;
                    background: #f1f5f9;
                    padding: 2px;
                    border-radius: 10px;
                }

                .control-item {
                    padding: 4px 14px;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 0.7rem;
                    color: #64748b;
                    border: none;
                    background: transparent;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                }

                .control-item i {
                    font-size: 0.9rem;
                    opacity: 0.7;
                }

                .control-item.is-active {
                    background: white;
                    color: #2563eb;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                }

                .control-item.is-active i {
                    opacity: 1;
                }

                .control-item:hover:not(.is-active) {
                    background: rgba(255, 255, 255, 0.4);
                }

                .filter-strip { padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; background: white; }
                .table-strip { padding: 0.25rem; }
                
                .json-pre { background: #0f172a; color: #94a3b8; padding: 1.5rem; border-radius: 16px; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; max-height: 500px; overflow: auto; border: 1px solid rgba(255,255,255,0.05); }

                @media (max-width: 768px) {
                    .admin-header-v2 { 
                        flex-direction: column; 
                        align-items: center; 
                        text-align: center;
                        gap: 1.25rem; 
                        padding: 1.25rem 1rem; 
                        margin-bottom: 1rem;
                    }
                    .admin-title-v2 { font-size: 1.1rem; }
                    .segmented-control { width: 100%; }
                    .control-item { flex: 1; justify-content: center; font-size: 0.65rem; }
                    .filter-strip { padding: 0.75rem; }
                }

                @media (max-width: 480px) {
                    .admin-header-v2 { border-radius: 16px; }
                    .main-shell { border-radius: 16px; }
                    .filter-strip { padding: 0.5rem; }
                }
            `}</style>

            <div className="apps-container">
                {error && <div className="alert-pill alert-error mb-3">{error.message}</div>}

                <div className="admin-header-v2">
                    <div>
                        <h1 className="admin-title-v2">Talento RocknRolla</h1>
                        <p className="text-muted small fw-700 mb-0 uppercase tracking-widest mt-1" style={{ fontSize: '0.6rem' }}>Identificación y Selección Inteligente</p>
                    </div>
                    
                    <div className="segmented-control">
                        <button 
                            className={`control-item ${activeTab === 'candidates' ? 'is-active' : ''}`} 
                            onClick={() => setActiveTab('candidates')}
                        >
                            <i className="bi bi-people-fill"></i>
                            Candidatos
                        </button>
                        <button 
                            className={`control-item ${activeTab === 'api' ? 'is-active' : ''}`} 
                            onClick={() => setActiveTab('api')}
                        >
                            <i className="bi bi-code-slash"></i>
                            API Data
                        </button>
                    </div>
                </div>

                <div className="main-shell">
                    {activeTab === "candidates" ? (
                        <>
                            <div className="filter-strip">
                                <ApplicationsFilters
                                    searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                                    sortOption={sortOption} setSortOption={setSortOption}
                                    nationalityFilter={nationalityFilter} setNationalityFilter={setNationalityFilter}
                                    positionFilter={positionFilter} setPositionFilter={setPositionFilter}
                                    salaryFilter={salaryFilter} setSalaryFilter={setSalaryFilter}
                                    dateFilter={dateFilter} setDateFilter={setDateFilter}
                                    nationalities={nationalities} positions={positions}
                                    handleResetFilters={handleResetFilters}
                                    filteredWorkers={filteredWorkers}
                                />
                            </div>
                            
                            {loading ? (
                                <div className="py-5 text-center text-muted"> <Spinner animation="grow" size="sm" variant="primary" className="me-2" /> Sincronizando candidatos... </div>
                            ) : (
                                <ClientSidePagination
                                    data={filteredWorkers} itemsPerPage={10}
                                    renderItems={(currentItems) => (
                                        <div className="table-strip">
                                            <ApplicationsTable
                                                filteredWorkers={currentItems}
                                                handleViewDetails={handleViewDetails}
                                                handlePDFGeneration={handlePDFGeneration}
                                                searchTerm={searchTerm}
                                            />
                                        </div>
                                    )}
                                />
                            )}
                        </>
                    ) : (
                        <div className="p-4 p-md-5">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4 className="fw-900 mb-0">Raw JSON Feed</h4>
                                <button className="btn-premium btn-premium-secondary" onClick={handleCopyJSON}>
                                    <i className={`bi ${copyStatus === '¡Copiado!' ? 'bi-check2' : 'bi-copy'}`}></i>
                                    {copyStatus}
                                </button>
                            </div>
                            <pre className="json-pre">{JSON.stringify(data, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>

            {selectedWorker && (
                <WorkerModal show={showModal} handleClose={handleCloseModal} workerData={selectedWorker} />
            )}
        </div>
    );
};

export default RocknRollaApplications;
