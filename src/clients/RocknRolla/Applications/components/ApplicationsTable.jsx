import { Table, Button } from 'react-bootstrap';
import {
    getFullName,
    getPosition,
    getNationality,
    getSalaryExpectation,
    getApplicationDate
} from "../utils/workerDataHelpers";

const ApplicationsTable = ({
    filteredWorkers,
    handleViewDetails,
    handlePDFGeneration,
    searchTerm
}) => {
    if (filteredWorkers.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="bg-light d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-person-x fs-1 text-secondary"></i>
                </div>
                <h4 className="fw-bold text-dark">No se encontraron candidatos</h4>
                <p className="text-secondary mx-auto" style={{ maxWidth: '300px' }}>
                    {searchTerm ? `No hay resultados para "${searchTerm}"` : 'Aún no se han recibido aplicaciones para esta vacante.'}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="table-responsive d-none d-md-block">
                <table className="table align-middle custom-table">
                    <thead>
                        <tr>
                            <th className="ps-4" style={{ width: '30%' }}>Candidato</th>
                            <th style={{ width: '35%' }}>Puesto</th>
                            <th className="text-center" style={{ width: '15%' }}>Nacionalidad</th>
                            <th className="text-end" style={{ width: '10%' }}>Expectativa</th>
                            <th className="text-center" style={{ width: '10%' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWorkers.map((worker, index) => {
                            const fullName = getFullName(worker);
                            const position = getPosition(worker);
                            const nationality = getNationality(worker);
                            const salaryExpectation = getSalaryExpectation(worker);
                            const date = getApplicationDate(worker);

                            return (
                        <tr key={worker.id || index}>
                            <td className="ps-4 py-2">
                                        <div className="d-flex align-items-center gap-3">
                                            <div
                                                className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                                style={{ width: '40px', height: '40px', fontSize: '0.9rem', backgroundColor: 'var(--primary-light)' }}
                                            >
                                                {fullName ? fullName.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div className="text-truncate">
                                                <div className="fw-bold text-dark mb-0 line-clamp-1" style={{ fontSize: '0.95rem' }} title={fullName}>
                                                    {fullName || 'N/A'}
                                                </div>
                                                <div className="text-secondary smaller" style={{ whiteSpace: 'nowrap' }}>
                                                    <i className="bi bi-calendar3 me-1"></i>
                                                    {date}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                            <span
                                                className="badge bg-light text-dark border fw-normal py-1 px-2 text-truncate d-inline-block mw-100"
                                                title={position}
                                            >
                                                {position || 'No definido'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-center text-secondary small">{nationality || 'N/A'}</td>
                                    <td className="text-end fw-bold text-dark" style={{ whiteSpace: 'nowrap' }}>
                                        {salaryExpectation ? `Q${Number(salaryExpectation).toLocaleString()}` : '—'}
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button
                                                className="btn btn-icon-light"
                                                onClick={() => handleViewDetails(worker)}
                                                title="Ver Detalles"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            <button
                                                className="btn btn-icon-light"
                                                onClick={() => handlePDFGeneration(worker)}
                                                title="Descargar PDF"
                                            >
                                                <i className="bi bi-file-earmark-pdf"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="d-md-none d-flex flex-column gap-3">
                {filteredWorkers.map((worker, index) => {
                    const fullName = getFullName(worker) || '';
                    const salary = getSalaryExpectation(worker);
                    const position = getPosition(worker);
                    const date = getApplicationDate(worker);

                    return (
                        <div key={worker.id || index} className="card border-0 shadow-sm rounded-4 p-3 bg-white">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-light)' }}>
                                        {fullName ? fullName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: '150px' }}>{fullName || 'N/A'}</h6>
                                </div>
                                <span className="badge bg-light text-dark border">
                                    {salary ? `Q${Number(salary).toLocaleString()}` : '—'}
                                </span>
                            </div>
                            <div className="d-flex flex-column gap-2 mb-3">
                                <div className="small text-secondary d-flex align-items-start">
                                    <i className="bi bi-briefcase me-2 mt-1"></i>
                                    <span className="line-clamp-2">{position || 'No definido'}</span>
                                </div>
                                <div className="small text-secondary">
                                    <i className="bi bi-calendar-event me-2"></i>
                                    {date || 'N/A'}
                                </div>
                            </div>
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary flex-grow-1 rounded-3 py-2" onClick={() => handleViewDetails(worker)}>
                                    Ver Detalles
                                </button>
                                <button className="btn btn-light border py-2 px-3 rounded-3" onClick={() => handlePDFGeneration(worker)}>
                                    <i className="bi bi-file-pdf"></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .custom-table {
                    border-collapse: separate;
                    border-spacing: 0;
                    table-layout: fixed;
                    width: 100%;
                }
                .custom-table thead th {
                    position: sticky;
                    top: 0;
                    background-color: #ffffff;
                    z-index: 10;
                    border-bottom: 1px solid var(--border-color);
                    color: var(--text-secondary);
                    font-weight: 500;
                    text-transform: uppercase;
                    font-size: 0.65rem;
                    letter-spacing: 0.5px;
                    padding: 0.75rem 0.5rem;
                }
                .custom-table tbody tr {
                    transition: all 0.2s ease;
                }
                .custom-table tbody tr:hover {
                    background-color: #f8fafc;
                }
                .custom-table tbody td {
                    border-bottom: 1px solid #f1f5f9;
                    vertical-align: middle;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .btn-icon-light {
                    width: 34px;
                    height: 34px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    background-color: transparent;
                    color: var(--text-secondary);
                    border: none;
                    transition: all 0.2s;
                }
                .btn-icon-light:hover {
                    background-color: var(--primary-light);
                    color: var(--primary-color);
                }
                .smaller {
                    font-size: 0.8rem;
                }
            `}</style>
        </>
    );
};

export default ApplicationsTable;