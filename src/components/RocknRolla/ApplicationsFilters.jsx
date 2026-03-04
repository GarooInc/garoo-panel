import React from 'react';

const ApplicationsFilters = ({
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
    nationalities,
    positions,
    handleResetFilters,
    filteredWorkers
}) => {
    return (
        <div className="app-filters">
            {/* Row 1: Search + Results badge + Reset */}
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ maxWidth: '420px' }}>
                    <div className="position-relative w-100">
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" style={{ fontSize: '0.85rem' }}></i>
                        <input
                            type="text"
                            className="form-control ps-5 border-0 bg-light rounded-pill py-2"
                            placeholder="Buscar por nombre, puesto, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ fontSize: '0.85rem' }}
                        />
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold px-3 py-2" style={{ fontSize: '0.8rem' }}>
                        {filteredWorkers.length} resultados
                    </span>
                    <button
                        onClick={handleResetFilters}
                        className="btn btn-link text-secondary text-decoration-none d-flex align-items-center gap-1 shadow-none p-0"
                        style={{ fontSize: '0.8rem' }}
                    >
                        <i className="bi bi-arrow-counterclockwise"></i>
                        Limpiar
                    </button>
                </div>
            </div>

            {/* Row 2: Filter dropdowns */}
            <div className="row g-2">
                <div className="col-6 col-md-4 col-lg">
                    <label className="filter-label">Ordenar</label>
                    <select
                        className="form-select filter-select"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="">Alfabético</option>
                        <option value="1">A → Z</option>
                        <option value="1-desc">Z → A</option>
                    </select>
                </div>

                <div className="col-6 col-md-4 col-lg">
                    <label className="filter-label">Salario</label>
                    <select
                        className="form-select filter-select"
                        value={salaryFilter}
                        onChange={(e) => setSalaryFilter(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="desc">Mayor a Menor</option>
                        <option value="asc">Menor a Mayor</option>
                    </select>
                </div>

                <div className="col-6 col-md-4 col-lg">
                    <label className="filter-label">Puesto</label>
                    <select
                        className="form-select filter-select"
                        value={positionFilter}
                        onChange={(e) => setPositionFilter(e.target.value)}
                    >
                        <option value="">Todos</option>
                        {positions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div className="col-6 col-md-4 col-lg">
                    <label className="filter-label">Nacionalidad</label>
                    <select
                        className="form-select filter-select"
                        value={nationalityFilter}
                        onChange={(e) => setNationalityFilter(e.target.value)}
                    >
                        <option value="">Todas</option>
                        {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>

                <div className="col-6 col-md-4 col-lg">
                    <label className="filter-label">Fecha</label>
                    <select
                        className="form-select filter-select"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="">Todas</option>
                        <option value="desc">Más Reciente</option>
                        <option value="asc">Más Antiguo</option>
                    </select>
                </div>
            </div>

            <style>{`
                .app-filters .filter-label {
                    display: block;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #8994a7;
                    margin-bottom: 4px;
                }
                .app-filters .filter-select {
                    border: 1px solid #e9ecef;
                    background-color: #f8f9fb;
                    border-radius: 10px;
                    padding: 8px 12px;
                    font-size: 0.82rem;
                    color: #3a4255;
                    font-weight: 500;
                    box-shadow: none !important;
                    transition: border-color 0.2s ease, background-color 0.2s ease;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .app-filters .filter-select:focus {
                    border-color: var(--primary-color, #4f6ef7);
                    background-color: #fff;
                }
                .app-filters .form-control {
                    box-shadow: none !important;
                }
                .app-filters .form-control:focus {
                    background-color: #f1f5f9 !important;
                }
                @media (max-width: 991.98px) {
                    .app-filters .row .col-lg {
                        flex: 0 0 auto;
                    }
                }
            `}</style>
        </div>
    );
};

export default ApplicationsFilters;