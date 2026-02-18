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
        <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ maxWidth: '400px' }}>
                    <div className="position-relative w-100">
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                        <input
                            type="text"
                            className="form-control ps-5 border-0 bg-light rounded-3 py-2"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ fontSize: '0.9rem' }}
                        />
                    </div>
                </div>

                <button
                    onClick={handleResetFilters}
                    className="btn btn-link text-secondary text-decoration-none small d-flex align-items-center gap-2 shadow-none"
                    style={{ fontSize: '0.85rem' }}
                >
                    <i className="bi bi-arrow-counterclockwise"></i>
                    Limpiar Filtros
                </button>
            </div>

            <div className="row g-3">
                <div className="col-12 col-md-6 col-lg-2">
                    <label className="form-label smaller text-secondary fw-bold text-uppercase mb-1">Ordenar</label>
                    <select
                        className="form-select border-0 bg-light rounded-3 py-2 small"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="">Orden Alfabético</option>
                        <option value="1">A → Z</option>
                        <option value="1-desc">Z → A</option>
                    </select>
                </div>

                <div className="col-12 col-md-6 col-lg-2">
                    <label className="form-label smaller text-secondary fw-bold text-uppercase mb-1">Salario</label>
                    <select
                        className="form-select border-0 bg-light rounded-3 py-2 small"
                        value={salaryFilter}
                        onChange={(e) => setSalaryFilter(e.target.value)}
                    >
                        <option value="">Rango Salarial</option>
                        <option value="desc">Mayor a Menor</option>
                        <option value="asc">Menor a Mayor</option>
                    </select>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label smaller text-secondary fw-bold text-uppercase mb-1">Puesto</label>
                    <select
                        className="form-select border-0 bg-light rounded-3 py-2 small"
                        value={positionFilter}
                        onChange={(e) => setPositionFilter(e.target.value)}
                    >
                        <option value="">Todos los Puestos</option>
                        {positions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label smaller text-secondary fw-bold text-uppercase mb-1">Nacionalidad</label>
                    <select
                        className="form-select border-0 bg-light rounded-3 py-2 small"
                        value={nationalityFilter}
                        onChange={(e) => setNationalityFilter(e.target.value)}
                    >
                        <option value="">Todas las Naciones</option>
                        {nationalities.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>

                <div className="col-12 col-md-12 col-lg-2 d-flex align-items-end justify-content-lg-end">
                    <div className="text-secondary small fw-medium mb-2">
                        {filteredWorkers.length} resultados
                    </div>
                </div>
            </div>

            <style>{`
                .smaller {
                    font-size: 0.65rem;
                    letter-spacing: 0.5px;
                }
                .form-select, .form-control {
                    box-shadow: none !important;
                }
                .form-select:focus, .form-control:focus {
                    background-color: #f1f5f9 !important;
                }
            `}</style>
        </div>
    );
};

export default ApplicationsFilters;