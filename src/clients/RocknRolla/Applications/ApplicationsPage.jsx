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
        } catch (err) { setCopyStatus("Error"); }
    };

    return (
        <div className="page-container animate-in">
            <style>{`
                .apps-container { display: flex; flex-direction: column; gap: 2rem; }
                .view-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 0.5rem; }
                
                .main-shell { 
                    background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px);
                    border-radius: 28px; border: 1px solid rgba(226, 232, 240, 0.8); 
                    overflow: hidden; display: flex; flex-direction: column; 
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.04);
                }
                .filter-strip { padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; background: rgba(248, 250, 252, 0.5); }
                .table-strip { padding: 0.5rem; }
                
                .json-pre { background: #0f172a; color: #94a3b8; padding: 2rem; border-radius: 20px; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; max-height: 600px; overflow: auto; border: 1px solid rgba(255,255,255,0.05); }

                @media (max-width: 768px) { .view-header { flex-direction: column; align-items: flex-start; gap: 1rem; } }
            `}</style>

            <div className="apps-container">
                <div className="view-header">
                    <div className="view-title">
                        <h1 className="premium-title">RocknRolla</h1>
                        <p className="premium-subtitle">Sistema de selección y gestión inteligente de talento humano.</p>
                    </div>
                    
                    <div className="nav-tabs-pills">
                        <button className={`nav-pill-item ${activeTab === 'candidates' ? 'is-active' : ''}`} onClick={() => setActiveTab('candidates')} style={{ border: 'none' }}>
                            <i className="bi bi-people-fill"></i> Candidatos
                        </button>
                        <button className={`nav-pill-item ${activeTab === 'api' ? 'is-active' : ''}`} onClick={() => setActiveTab('api')} style={{ border: 'none' }}>
                            <i className="bi bi-code-slash"></i> API Data
                        </button>
                    </div>
                </div>

                {error && <div className="alert-pill alert-error">{error.message}</div>}

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
