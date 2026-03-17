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
            <style>{`
                .filter-label { font-size: 0.7rem; font-weight: 850; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; margin-left: 2px; }
                .filter-select { 
                    border: 2px solid #f1f5f9; background-color: #f8fafc; border-radius: 12px; 
                    padding: 10px 14px; font-size: 0.85rem; color: #1e293b; font-weight: 700;
                    transition: all 0.2s; outline: none;
                }
                .filter-select:focus { border-color: #2563eb; background-color: #fff; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.05); }
                .search-input-premium {
                    background: #f1f5f9; border: none; border-radius: 100px; padding: 12px 20px 12px 45px;
                    font-size: 0.9rem; font-weight: 600; color: #1e293b; transition: all 0.3s;
                }
                .search-input-premium:focus { background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            `}</style>

            {/* Row 1: Search + Results badge + Reset */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                <div className="position-relative flex-grow-1" style={{ maxWidth: '480px' }}>
                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-4 text-muted"></i>
                    <input
                        type="text"
                        className="form-control search-input-premium w-100"
                        placeholder="Buscar por nombre, puesto, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="d-flex align-items-center gap-4">
                    <div className="text-end">
                        <span className="d-block fw-900 text-primary" style={{ fontSize: '1.1rem' }}>{filteredWorkers.length}</span>
                        <span className="text-muted small fw-800 text-uppercase tracking-wider" style={{ fontSize: '0.65rem' }}>Resultados</span>
                    </div>
                    <button
                        onClick={handleResetFilters}
                        className="btn btn-sm btn-light rounded-pill px-3 fw-800 text-muted border-0 h-100"
                        style={{ height: '44px' }}
                    >
                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                        Reiniciar
                    </button>
                </div>
            </div>

            {/* Row 2: Filter dropdowns */}
            <div className="row g-3">
                <div className="col-12 col-md-6 col-lg">
                    <label className="filter-label">Orden</label>
                    <select
                        className="form-select filter-select"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="">Alfabético</option>
                        <option value="1">Nombre A → Z</option>
                        <option value="1-desc">Nombre Z → A</option>
                    </select>
                </div>

                <div className="col-12 col-md-6 col-lg">
                    <label className="filter-label">Salario</label>
                    <select
                        className="form-select filter-select"
                        value={salaryFilter}
                        onChange={(e) => setSalaryFilter(e.target.value)}
                    >
                        <option value="">Sin Filtro</option>
                        <option value="desc">Mayor a Menor</option>
                        <option value="asc">Menor a Mayor</option>
                    </select>
                </div>

                <div className="col-12 col-md-6 col-lg">
                    <label className="filter-label">Puesto</label>
                    <select
                        className="form-select filter-select"
                        value={positionFilter}
                        onChange={(e) => setPositionFilter(e.target.value)}
                    >
                        <option value="">Cualquiera</option>
                        {positions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div className="col-12 col-md-6 col-lg">
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

                <div className="col-12 col-md-6 col-lg">
                    <label className="filter-label">Fecha Ant.</label>
                    <select
                        className="form-select filter-select"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="">Recientes</option>
                        <option value="desc">Más Reciente</option>
                        <option value="asc">Más Antiguo</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsFilters;