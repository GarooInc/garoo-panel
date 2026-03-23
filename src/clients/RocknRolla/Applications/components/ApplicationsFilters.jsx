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
    nationalities,
    positions,
    handleResetFilters,
    filteredWorkers
}) => {
    return (
        <div className="app-filters">
            <style>{`
                .filters-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .filter-item {
                    flex: 1;
                    min-width: 125px; /* Reducido para dar más aire */
                }
                .filter-select { 
                    border: 1px solid #e2e8f0; 
                    background-color: white; 
                    border-radius: 8px; 
                    padding: 4px 28px 4px 10px; 
                    font-size: 0.7rem; 
                    color: #1e293b; 
                    font-weight: 700;
                    transition: all 0.2s;
                    height: 34px;
                    cursor: pointer;
                    width: 100%;
                    text-overflow: ellipsis;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 8px center;
                    background-size: 12px 12px;
                }
               .filter-select:hover { border-color: #cbd5e1; background-color: #f8fafc; }
               .filter-select:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); outline: none; }
                
                .search-wrapper {
                    position: relative;
                    flex: 2;
                    min-width: 200px;
                }
                .search-input-compact {
                    background: #f1f5f9;
                    border: 1px solid transparent;
                    border-radius: 8px;
                    padding: 4px 12px 4px 30px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #1e293b;
                    transition: all 0.2s;
                    height: 34px;
                    width: 100%;
                }
                .search-input-compact:focus { background: white; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); outline: none; }
                .search-icon {
                    position: absolute;
                    left: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 0.8rem;
                    color: #94a3b8;
                    pointer-events: none;
                }

                .results-badge {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 0 8px;
                    height: 34px;
                    background: #eff6ff;
                    border-radius: 8px;
                    border: 1px solid #dbeafe;
                    min-width: 70px;
                }
                .results-count { font-size: 0.75rem; font-weight: 800; color: #1d4ed8; line-height: 1; }
                .results-label { font-size: 0.55rem; font-weight: 900; color: #60a5fa; text-transform: uppercase; margin-top: 0; letter-spacing: 0.5px; }

                .btn-reset-compact {
                    height: 34px;
                    width: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                    transition: all 0.2s;
                }
                .btn-reset-compact:hover { background: #fee2e2; border-color: #fecaca; color: #ef4444; }

                @media (max-width: 992px) {
                    .filter-item { min-width: calc(33.33% - 8px); }
                }

                @media (max-width: 768px) {
                    .filters-row { gap: 6px; }
                    .search-wrapper { order: -1; flex: 100%; margin-bottom: 4px; }
                    .filter-item { min-width: calc(50% - 6px); flex: 1; }
                    .results-badge { flex: 1; min-width: 80px; }
                    .btn-reset-compact { width: 40px; }
                }

                @media (max-width: 480px) {
                    .filter-item { min-width: 100%; }
                    .results-badge { order: 10; }
                    .btn-reset-compact { order: 11; flex: 1; }
                }
            `}</style>

            <div className="filters-row">
                <div className="search-wrapper">
                    <i className="bi bi-search search-icon"></i>
                    <input
                        type="text"
                        className="search-input-compact"
                        placeholder="Buscar candidatos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-item">
                    <select
                        className="form-select filter-select"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        title="Orden"
                    >
                        <option value="">A → Z (Nombre)</option>
                        <option value="1">A → Z</option>
                        <option value="1-desc">Z → A</option>
                    </select>
                </div>

                <div className="filter-item">
                    <select
                        className="form-select filter-select"
                        value={salaryFilter}
                        onChange={(e) => setSalaryFilter(e.target.value)}
                        title="Salario"
                    >
                        <option value="">Cualquier Salario</option>
                        <option value="desc">Mayor Salario</option>
                        <option value="asc">Menor Salario</option>
                    </select>
                </div>

                <div className="filter-item">
                    <select
                        className="form-select filter-select"
                        value={positionFilter}
                        onChange={(e) => setPositionFilter(e.target.value)}
                        title="Puesto"
                    >
                        <option value="">Todos los Puestos</option>
                        {positions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div className="filter-item d-none d-xl-block">
                    <select
                        className="form-select filter-select"
                        value={nationalityFilter}
                        onChange={(e) => setNationalityFilter(e.target.value)}
                        title="Nacionalidad"
                    >
                        <option value="">Nacionalidades</option>
                        {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>

                <div className="results-badge">
                    <span className="results-count">{filteredWorkers.length}</span>
                    <span className="results-label">registros</span>
                </div>

                <button
                    onClick={handleResetFilters}
                    className="btn-reset-compact"
                    title="Reiniciar Filtros"
                >
                    <i className="bi bi-arrow-counterclockwise"></i>
                </button>
            </div>
        </div>
    );
};

export default ApplicationsFilters;