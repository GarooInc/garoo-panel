import styles from "./ApplicationsPage.module.css";
import { useState, useCallback } from "react";
import { Spinner } from "react-bootstrap";
import garooLogo from "../../assets/img/garoo-logo.png";

import { useApplications } from "../../config/ApplicationsProvider";
import { useSimpleFilters } from "../../hooks/useSimpleFilters";
import { generateWorkerPDF } from "../../utils/pdfGenerator";

import WorkerModal from "../../components/RocknRolla/WorkerModal";
import ApplicationsFilters from "../../components/RocknRolla/ApplicationsFilters";
import ApplicationsTable from "../../components/RocknRolla/ApplicationsTable";
import ClientSidePagination from "../../components/ClientSidePagination";

const RocknRollaApplications = () => {
    const { error, loading, data, nationalities, positions } =
        useApplications();
    const {
        searchTerm,
        setSearchTerm,
        sortOption,
        setSortOption,
        nationalityFilter,
        setNationalityFilter,
        positionFilter,
        setPositionFilter,
        salaryFilter,
        setSalaryFilter,
        dateFilter,
        setDateFilter,
        handleResetFilters,
        filteredWorkers,
    } = useSimpleFilters(data);

    const [showModal, setShowModal] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [activeTab, setActiveTab] = useState("candidates");

    const handleViewDetails = useCallback((worker) => {
        setSelectedWorker(worker);
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedWorker(null);
    }, []);

    const handlePDFGeneration = useCallback(async (worker) => {
        try {
            generateWorkerPDF(worker);
        } catch (err) {
            console.error("Error generating PDF:", err);
            alert(err.message || "Error al generar el PDF.");
        }
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .ap-root {
                    min-height: 100vh;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: #080f20;
                    font-family: 'Inter', system-ui, sans-serif;
                    overflow: hidden;
                    position: relative;
                }

                /* ── Ambient glows ── */
                .ap-glow-1 {
                    position: fixed; pointer-events: none;
                    top: -120px; right: -80px;
                    width: 520px; height: 520px;
                    background: radial-gradient(circle, rgba(59,130,246,.13) 0%, transparent 68%);
                    filter: blur(60px);
                }
                .ap-glow-2 {
                    position: fixed; pointer-events: none;
                    bottom: -160px; left: -80px;
                    width: 480px; height: 480px;
                    background: radial-gradient(circle, rgba(99,102,241,.09) 0%, transparent 68%);
                    filter: blur(70px);
                }

                /* ══════════════════════════════
                   TOPBAR
                ══════════════════════════════ */
                .ap-topbar {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0 2rem;
                    height: 62px;
                    background: rgba(8,15,32,.9);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255,255,255,.07);
                    position: relative; z-index: 20;
                }

                .ap-logo-ring {
                    width: 38px; height: 38px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(59,130,246,.25), rgba(59,130,246,.1));
                    border: 1.5px solid rgba(59,130,246,.35);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 12px rgba(59,130,246,.25);
                    flex-shrink: 0;
                }

                .ap-logo-ring img {
                    width: 26px; height: 26px;
                    border-radius: 50%; object-fit: cover;
                }

                .ap-topbar-title {
                    font-size: 1.35rem; font-weight: 800;
                    color: #f1f5f9; letter-spacing: -.03em;
                    line-height: 1;
                }

                .ap-topbar-divider {
                    width: 1px; height: 20px;
                    background: rgba(255,255,255,.1);
                }

                .ap-pill {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 4px 11px; border-radius: 100px;
                    font-size: .68rem; font-weight: 700;
                    letter-spacing: .07em; text-transform: uppercase;
                }

                .ap-pill-blue {
                    background: rgba(59,130,246,.12);
                    border: 1px solid rgba(59,130,246,.28);
                    color: #93c5fd;
                }

                .ap-pill-blue::before {
                    content: '';
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #3b82f6;
                    box-shadow: 0 0 6px #3b82f6;
                    animation: ap-blink 2.2s ease-in-out infinite;
                }

                @keyframes ap-blink {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%      { opacity:.4; transform:scale(.7); }
                }

                .ap-spacer { flex: 1; }

                /* Stats chip */
                .ap-stat-group {
                    display: flex; align-items: center;
                    gap: 1.1rem;
                    background: rgba(255,255,255,.04);
                    border: 1px solid rgba(255,255,255,.07);
                    border-radius: 12px;
                    padding: .4rem 1.1rem;
                }

                .ap-stat { display: flex; flex-direction: column; align-items: center; }

                .ap-stat-n {
                    font-size: 1.05rem; font-weight: 800;
                    color: #f1f5f9; line-height: 1;
                }

                .ap-stat-l {
                    font-size: .6rem; font-weight: 700;
                    color: #475569; text-transform: uppercase; letter-spacing: .06em;
                    margin-top: 1px;
                }

                .ap-stat-sep {
                    width: 1px; height: 28px;
                    background: rgba(255,255,255,.08);
                }

                /* ══════════════════════════════
                   BODY
                ══════════════════════════════ */
                .ap-body {
                    flex: 1; min-height: 0;
                    display: flex; flex-direction: column;
                    padding: 1.5rem 2rem;
                    overflow: hidden;
                    position: relative; z-index: 1;
                }

                /* Tab switcher */
                .ap-tabs {
                    display: flex; gap: 3px;
                    background: rgba(255,255,255,.04);
                    border: 1px solid rgba(255,255,255,.07);
                    border-radius: 10px;
                    padding: 3px;
                    width: fit-content;
                    flex-shrink: 0;
                }

                .ap-tab {
                    background: transparent; border: none;
                    color: #475569; cursor: pointer;
                    font-family: inherit; font-size: .8rem; font-weight: 600;
                    padding: .42rem 1rem; border-radius: 7px;
                    display: inline-flex; align-items: center; gap: .4rem;
                    transition: color .15s;
                }

                .ap-tab:hover { color: #94a3b8; }

                .ap-tab.on {
                    background: rgba(59,130,246,.14);
                    border: 1px solid rgba(59,130,246,.24);
                    color: #93c5fd;
                }

                /* Content shell */
                .ap-shell {
                    flex: 1; min-height: 0;
                    display: flex; flex-direction: column;
                    background: rgba(255,255,255,.03);
                    border: 1px solid rgba(255,255,255,.07);
                    border-radius: 16px;
                    overflow: hidden;
                }

                /* Filters strip */
                .ap-filters-strip {
                    flex-shrink: 0;
                    padding: 1rem 1.4rem;
                    border-bottom: 1px solid rgba(255,255,255,.06);
                    background: rgba(255,255,255,.02);
                }

                /* Scrollable table area */
                .ap-table-area {
                    flex: 1; overflow-y: auto; overflow-x: auto;
                }

                /* Loading / error */
                .ap-loading {
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    padding: 4rem; gap: .9rem; color: #475569;
                    font-size: .88rem; font-weight: 500;
                }

                .ap-error-bar {
                    display: flex; align-items: center; gap: .5rem;
                    background: rgba(239,68,68,.08);
                    border: 1px solid rgba(239,68,68,.22);
                    color: #fca5a5;
                    font-size: .78rem; font-weight: 500;
                    padding: .6rem 1rem; border-radius: 10px;
                    margin-bottom: 1rem; flex-shrink: 0;
                }

                /* ══════════════════════════════
                   TABLE OVERRIDES (force dark)
                ══════════════════════════════ */
                .ap-table-area *,
                .ap-table-area table,
                .ap-table-area tbody,
                .ap-table-area tr,
                .ap-table-area td {
                    background-color: transparent !important;
                    border-color: rgba(255,255,255,.06) !important;
                }

                .ap-table-area table {
                    --bs-table-bg: transparent !important;
                    --bs-table-striped-bg: transparent !important;
                    --bs-table-hover-bg: transparent !important;
                    --bs-table-color: #e2e8f0 !important;
                    color: #e2e8f0 !important;
                    border-collapse: collapse;
                }

                .ap-table-area thead th {
                    background: rgba(255,255,255,.04) !important;
                    color: #64748b !important;
                    font-size: .7rem !important;
                    font-weight: 700 !important;
                    letter-spacing: .08em !important;
                    text-transform: uppercase !important;
                    border-bottom: 1px solid rgba(255,255,255,.07) !important;
                    padding: .75rem 1rem !important;
                    white-space: nowrap;
                }

                .ap-table-area tbody tr {
                    border-bottom: 1px solid rgba(255,255,255,.04) !important;
                    transition: background .15s;
                }

                .ap-table-area tbody tr:hover {
                    background: rgba(255,255,255,.025) !important;
                }

                .ap-table-area td {
                    color: #e2e8f0 !important;
                    font-size: .84rem !important;
                    padding: .85rem 1rem !important;
                    vertical-align: middle !important;
                }

                /* Every child inside td */
                .ap-table-area td *:not(button):not(i):not(.badge):not([class*="btn"]) {
                    color: #e2e8f0 !important;
                }

                /* Candidate name bold */
                .ap-table-area td strong,
                .ap-table-area td [class*="name"],
                .ap-table-area td .fw-semibold,
                .ap-table-area td .fw-bold {
                    color: #f1f5f9 !important;
                    font-weight: 600 !important;
                }

                /* Secondary / muted text */
                .ap-table-area .text-muted,
                .ap-table-area .text-secondary,
                .ap-table-area small {
                    color: #64748b !important;
                    font-size: .75rem !important;
                }

                /* Avatar circles */
                .ap-table-area .rounded-circle {
                    background: linear-gradient(135deg, rgba(59,130,246,.25), rgba(99,102,241,.25)) !important;
                    color: #93c5fd !important;
                    border: 1.5px solid rgba(59,130,246,.3) !important;
                    font-weight: 700 !important;
                }

                /* Badges */
                .ap-table-area .badge {
                    background: rgba(99,102,241,.15) !important;
                    border: 1px solid rgba(99,102,241,.25) !important;
                    color: #a5b4fc !important;
                    font-size: .7rem !important;
                    font-weight: 600 !important;
                    padding: 3px 8px !important;
                    border-radius: 6px !important;
                }

                /* Expectativa text */
                .ap-table-area td:nth-child(4),
                .ap-table-area td:nth-child(4) * {
                    color: #e2e8f0 !important;
                }

                /* Action icons */
                .ap-table-area button,
                .ap-table-area .btn {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    color: #475569 !important;
                    padding: 5px 8px !important;
                    border-radius: 7px !important;
                    transition: color .15s !important;
                    cursor: pointer;
                }

                .ap-table-area button:hover,
                .ap-table-area .btn:hover {
                    color: #93c5fd !important;
                    background: rgba(59,130,246,.1) !important;
                }

                /* Pagination */
                .ap-table-area .page-link {
                    background: rgba(255,255,255,.05) !important;
                    border-color: rgba(255,255,255,.1) !important;
                    color: #94a3b8 !important;
                    font-size: .8rem !important;
                }

                .ap-table-area .page-item.active .page-link {
                    background: #3b82f6 !important;
                    border-color: #3b82f6 !important;
                    color: #fff !important;
                }

                .ap-table-area .page-item.disabled .page-link {
                    background: transparent !important;
                    color: #334155 !important;
                }

                /* Pagination info */
                .ap-table-area small,
                .ap-table-area [class*="text-"] {
                    color: #64748b !important;
                }

                /* ══════════════════════════════
                   FILTER OVERRIDES
                ══════════════════════════════ */
                .ap-filters-strip label {
                    color: #64748b !important;
                    font-size: .68rem !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    letter-spacing: .06em !important;
                    margin-bottom: 4px !important;
                    display: block;
                }

                .ap-filters-strip .form-control,
                .ap-filters-strip .form-select,
                .ap-filters-strip input {
                    background: rgba(255,255,255,.05) !important;
                    border: 1px solid rgba(255,255,255,.1) !important;
                    color: #e2e8f0 !important;
                    border-radius: 9px !important;
                    font-size: .83rem !important;
                    height: 36px !important;
                    padding: 0 .75rem;
                }

                .ap-filters-strip .form-control::placeholder { color: #334155 !important; }

                .ap-filters-strip .form-control:focus,
                .ap-filters-strip .form-select:focus,
                .ap-filters-strip input:focus {
                    border-color: rgba(59,130,246,.45) !important;
                    box-shadow: 0 0 0 3px rgba(59,130,246,.1) !important;
                    background: rgba(59,130,246,.05) !important;
                    outline: none !important;
                    color: #f1f5f9 !important;
                }

                .ap-filters-strip .form-select option {
                    background: #1e293b; color: #f1f5f9;
                }

                .ap-filters-strip button,
                .ap-filters-strip .btn {
                    font-size: .78rem !important;
                    font-weight: 600 !important;
                    border-radius: 9px !important;
                    height: 36px !important;
                    padding: 0 .9rem !important;
                    cursor: pointer;
                }

                .ap-filters-strip .btn-outline-secondary,
                .ap-filters-strip .btn-secondary {
                    background: rgba(255,255,255,.05) !important;
                    border: 1px solid rgba(255,255,255,.1) !important;
                    color: #94a3b8 !important;
                }

                .ap-filters-strip .btn-outline-secondary:hover {
                    background: rgba(255,255,255,.09) !important;
                    color: #f1f5f9 !important;
                }

                .ap-filters-strip .text-primary,
                .ap-filters-strip a {
                    color: #60a5fa !important;
                    font-size: .78rem !important;
                    text-decoration: none;
                }

                /* ══════════════════════════════
                   JSON TAB
                ══════════════════════════════ */
                .ap-json-wrap { padding: 1.4rem; }

                .ap-json-header {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1rem;
                }

                .ap-json-title {
                    font-size: .82rem; font-weight: 600; color: #94a3b8;
                }

                .ap-json-count {
                    font-size: .68rem; font-weight: 700;
                    background: rgba(59,130,246,.12);
                    border: 1px solid rgba(59,130,246,.24);
                    color: #93c5fd;
                    padding: 3px 10px; border-radius: 100px;
                }

                .ap-json-pre {
                    background: rgba(0,0,0,.35);
                    border: 1px solid rgba(255,255,255,.06);
                    border-radius: 12px;
                    padding: 1.25rem;
                    color: #67e8f9;
                    font-size: .75rem;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    max-height: 65vh;
                    overflow: auto;
                    white-space: pre-wrap;
                    word-break: break-all;
                    line-height: 1.6;
                }

                /* ══════════════════════════════
                   RESPONSIVE
                ══════════════════════════════ */
                @media (max-width: 768px) {
                    .ap-topbar { padding: 0 .75rem; height: auto; min-height: 60px; flex-wrap: wrap; justify-content: center; gap: .5rem; py: .5rem; }
                    .ap-body   { padding: 1rem; }
                    .ap-stat-group { display: none; }
                    .ap-topbar-divider { display: none; }
                    .ap-logo-ring { display: none; }
                    .ap-topbar-title-wrapper { text-align: center; }
                    .ap-modulo-label { display: none; }
                    .ap-tabs-group { order: 3; width: 100%; margin: .25rem 0; justify-content: center; }
                    .ap-spacer { display: none; }
                }

                @media (max-width: 576px) {
                    .ap-topbar-title { font-size: .95rem; }
                    .ap-pill { display: none; }
                }
            `}</style>

            {/* Ambient glows */}
            <div className="ap-glow-1" />
            <div className="ap-glow-2" />

            <div className="ap-root">
                {/* ── Topbar ── */}
                <header className="ap-topbar">
                    <div className="d-flex align-items-center gap-3">
                        <div className="ap-logo-ring">
                            <img src={garooLogo} alt="Garoo" />
                        </div>
                        <div className="d-flex flex-column">
                            <h1 className="ap-topbar-title" style={{ fontSize: '1.1rem', marginBottom: '2px' }}>Garoo Portal</h1>
                            <div className="d-flex align-items-center gap-2">
                                <span className="ap-modulo-label" style={{ fontSize: '.6rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.05em' }}>Módulo:</span>
                                <span style={{ fontSize: '.65rem', fontWeight: 800, color: '#f1f5f9' }}>Gestor de Aplicaciones</span>
                            </div>
                        </div>
                    </div>

                    <div className="ap-topbar-divider ms-2 me-2" />

                    <span className="ap-pill ap-pill-blue">RocknRolla</span>

                    <div className="ap-spacer" />

                    {/* Center Navigation Switcher */}
                    <div className="ap-tabs-group" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: '12px', padding: '3px', display: 'flex', gap: '2px' }}>
                        <button
                            className={`ap-tab ${activeTab === "candidates" ? "on" : ""}`}
                            onClick={() => setActiveTab("candidates")}
                            style={{
                                padding: '.4rem 1.2rem',
                                fontSize: '.75rem',
                                border: 'none',
                                borderRadius: '9px',
                                transition: 'all .25s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: activeTab === "candidates" ? 'rgba(59,130,246,.15)' : 'transparent',
                                color: activeTab === "candidates" ? '#93c5fd' : '#64748b'
                            }}
                        >
                            <i className="bi bi-people-fill me-2" />
                            Candidatos
                        </button>
                        <button
                            className={`ap-tab ${activeTab === "api" ? "on" : ""}`}
                            onClick={() => setActiveTab("api")}
                            style={{
                                padding: '.4rem 1.2rem',
                                fontSize: '.75rem',
                                border: 'none',
                                borderRadius: '9px',
                                transition: 'all .25s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: activeTab === "api" ? 'rgba(59,130,246,.15)' : 'transparent',
                                color: activeTab === "api" ? '#93c5fd' : '#64748b'
                            }}
                        >
                            <i className="bi bi-code-slash me-2" />
                            Datos de la API
                        </button>
                    </div>

                    <div className="ap-spacer" />

                    {!loading && (
                        <div className="ap-stat-group" style={{ height: '40px', padding: '0 1rem' }}>
                            <div className="ap-stat" style={{ padding: '0 .5rem' }}>
                                <span className="ap-stat-n" style={{ fontSize: '.95rem' }}>{data?.length ?? 0}</span>
                                <span className="ap-stat-l" style={{ fontSize: '.55rem' }}>REGISTROS</span>
                            </div>
                            <div className="ap-stat-sep" />
                            <div className="ap-stat" style={{ padding: '0 .5rem', minWidth: '70px' }}>
                                <span className="ap-stat-n" style={{ fontSize: '.95rem', color: filteredWorkers?.length < data?.length ? '#60a5fa' : '#f1f5f9' }}>
                                    {filteredWorkers?.length ?? 0}
                                </span>
                                <span className="ap-stat-l" style={{ fontSize: '.55rem' }}>FILTRADOS</span>
                            </div>
                        </div>
                    )}
                </header>

                {/* ── Body ── */}
                <main className="ap-body">
                    {/* Error bar */}
                    {error && (
                        <div className="ap-error-bar">
                            <i className="bi bi-exclamation-circle-fill" />
                            {error.message}
                        </div>
                    )}



                    {/* Shell */}
                    <div className="ap-shell">
                        {activeTab === "candidates" &&
                            (loading ? (
                                <div className="ap-loading">
                                    <Spinner
                                        animation="border"
                                        style={{
                                            color: "#3b82f6",
                                            width: "2rem",
                                            height: "2rem",
                                        }}
                                    />
                                    <span>Cargando candidatos...</span>
                                </div>
                            ) : (
                                <>
                                    {/* Filters strip */}
                                    <div className="ap-filters-strip">
                                        <ApplicationsFilters
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            sortOption={sortOption}
                                            setSortOption={setSortOption}
                                            nationalityFilter={
                                                nationalityFilter
                                            }
                                            setNationalityFilter={
                                                setNationalityFilter
                                            }
                                            positionFilter={positionFilter}
                                            setPositionFilter={
                                                setPositionFilter
                                            }
                                            salaryFilter={salaryFilter}
                                            setSalaryFilter={setSalaryFilter}
                                            dateFilter={dateFilter}
                                            setDateFilter={setDateFilter}
                                            nationalities={nationalities}
                                            positions={positions}
                                            handleResetFilters={
                                                handleResetFilters
                                            }
                                            filteredWorkers={filteredWorkers}
                                        />
                                    </div>

                                    {/* Scrollable table */}
                                    <div
                                        className="ap-table-area"
                                        style={{ padding: "0 .5rem .5rem" }}
                                    >
                                        <ClientSidePagination
                                            data={filteredWorkers}
                                            itemsPerPage={10}
                                            renderItems={(currentItems) => (
                                                <ApplicationsTable
                                                    filteredWorkers={
                                                        currentItems
                                                    }
                                                    handleViewDetails={
                                                        handleViewDetails
                                                    }
                                                    handlePDFGeneration={
                                                        handlePDFGeneration
                                                    }
                                                    styles={styles}
                                                    searchTerm={searchTerm}
                                                />
                                            )}
                                        />
                                    </div>
                                </>
                            ))}

                        {activeTab === "api" && (
                            <div className="ap-json-wrap">
                                <div className="ap-json-header">
                                    <span className="ap-json-title">
                                        Raw Server JSON
                                    </span>
                                    <span className="ap-json-count">
                                        {data?.length ?? 0} registros
                                    </span>
                                </div>
                                <pre className="ap-json-pre">
                                    {JSON.stringify(data, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {selectedWorker && (
                <WorkerModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    workerData={selectedWorker}
                />
            )}
        </>
    );
};

export default RocknRollaApplications;
