import { Table, Button } from 'react-bootstrap';
import {
    getFullName,
    getPosition,
    getNationality,
    getSalaryExpectation,
    getApplicationDate
} from '../utils/workerDataHelpers';

const ApplicationsTable = ({
    filteredWorkers,
    handleViewDetails,
    handlePDFGeneration,
    styles,
    searchTerm
}) => {
    if (filteredWorkers.length === 0) {
        return (
            <div className="text-center py-5">
                <i className="bi bi-inbox display-4 display-md-3 display-lg-2 display-xl-1 text-muted"></i>
                <h4 className="text-muted mt-3 fs-5 fs-md-4 fs-lg-3">No se encontraron aplicaciones</h4>
                <p className="text-muted fs-6 fs-md-5">
                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay aplicaciones disponibles en este momento'}
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Vista de tabla para pantallas medianas y grandes */}
            <div className="table-responsive d-none d-md-block shadow-sm rounded">
                <Table
                    hover
                    className="mb-0 fs-6 fs-md-5 fs-lg-6 fs-xl-5 bg-white table-sm"
                    style={{
                        '--bs-table-cell-padding-y': '0.25rem',
                        '--bs-table-cell-padding-x': '0.5rem'
                    }}
                >
                    <thead className="table-dark">
                        <tr className="fs-6 fs-lg-5" style={{ height: '35px' }}>
                            <th className="text-center small fw-medium border-0 p-1">#</th>
                            <th className="small fw-medium border-0 p-1">Nombre Completo</th>
                            <th className="d-none d-lg-table-cell small fw-medium border-0 p-1">Puesto</th>
                            <th className="d-none d-xl-table-cell small fw-medium border-0 p-1">Nacionalidad</th>
                            <th className="d-none d-lg-table-cell small fw-medium border-0 p-1">Salario</th>
                            <th className="d-none d-xl-table-cell small fw-medium border-0 p-1">Fecha</th>
                            <th className="text-center small fw-medium border-0 p-1">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="fs-6 fs-lg-5">
                        {filteredWorkers.map((worker, index) => {
                            const fullName = getFullName(worker);
                            const position = getPosition(worker);
                            const nationality = getNationality(worker);
                            const salaryExpectation = getSalaryExpectation(worker);
                            const applicationDate = getApplicationDate(worker);

                            return (
                                <tr key={worker.id || index} className="align-middle border-0" style={{ borderBottom: '1px solid #f1f5f9', height: '38px' }}>
                                    <td className="text-center fw-medium small text-muted p-1">{index + 1}</td>
                                    <td className="small p-1">
                                        <div style={{ lineHeight: '1.2' }}>
                                            <strong className="text-dark" style={{ fontSize: '0.8rem' }}>{fullName || 'N/A'}</strong>
                                            <div className="d-lg-none small text-muted">
                                                <i className="bi bi-briefcase me-1"></i>
                                                {position || 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="d-none d-lg-table-cell small text-muted p-1">{position || 'N/A'}</td>
                                    <td className="d-none d-xl-table-cell small text-muted p-1">{nationality || 'N/A'}</td>
                                    <td className="d-none d-lg-table-cell fw-medium small text-dark p-1">
                                        {salaryExpectation ? `Q${Number(salaryExpectation).toLocaleString()}` : 'Q N/A'}
                                    </td>
                                    <td className="d-none d-xl-table-cell small text-muted p-1">{applicationDate || 'N/A'}</td>
                                    <td className="text-center p-1">
                                        <div className="d-flex gap-1 justify-content-center">
                                            <Button
                                                variant="dark"
                                                size="sm"
                                                title="Ver detalles"
                                                onClick={() => handleViewDetails(worker)}
                                                className="px-1 py-0"
                                                style={{ fontSize: '0.7rem', lineHeight: '1', minHeight: '24px', minWidth: '28px' }}
                                            >
                                                <i className="bi bi-eye"></i>
                                            </Button>
                                            <Button
                                                variant="dark"
                                                size="sm"
                                                title="Descargar PDF"
                                                onClick={() => handlePDFGeneration(worker)}
                                                className="px-1 py-0"
                                                style={{ fontSize: '0.7rem', lineHeight: '1', minHeight: '24px', minWidth: '28px' }}
                                            >
                                                <i className="bi bi-file-earmark-pdf"></i>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>

            {/* Vista de tarjetas para móviles */}
            <div className="d-md-none">
                {filteredWorkers.map((worker, index) => {
                    const fullName = getFullName(worker);
                    const position = getPosition(worker);
                    const nationality = getNationality(worker);
                    const salaryExpectation = getSalaryExpectation(worker);
                    const applicationDate = getApplicationDate(worker);

                    return (
                        <div key={worker.id || index} className="card mb-3 border-0 shadow-sm bg-white">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="flex-grow-1">
                                        <h6 className="card-title mb-1 fw-medium text-dark fs-6">
                                            <span className="badge bg-light text-muted me-2 fs-6 fw-normal">#{index + 1}</span>
                                            {fullName || 'N/A'}
                                        </h6>
                                        <p className="card-text mb-0 small text-muted">
                                            <i className="bi bi-briefcase me-1"></i>
                                            {position || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="d-flex gap-1 flex-shrink-0">
                                        <Button
                                            variant="dark"
                                            size="sm"
                                            title="Ver detalles"
                                            onClick={() => handleViewDetails(worker)}
                                            className="px-2 py-1"
                                        >
                                            <i className="bi bi-eye"></i>
                                        </Button>
                                        <Button
                                            variant="dark"
                                            size="sm"
                                            title="Descargar PDF"
                                            onClick={() => handlePDFGeneration(worker)}
                                            className="px-2 py-1"
                                        >
                                            <i className="bi bi-file-earmark-pdf"></i>
                                        </Button>
                                    </div>
                                </div>

                                <div className="row g-3 small">
                                    <div className="col-6">
                                        <div className="text-muted mb-1 fw-medium">
                                            <i className="bi bi-flag me-1"></i>
                                            Nacionalidad
                                        </div>
                                        <div className="text-dark">{nationality || 'N/A'}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="text-muted mb-1 fw-medium">
                                            <i className="bi bi-currency-dollar me-1"></i>
                                            Salario
                                        </div>
                                        <div className="fw-medium text-dark">
                                            {salaryExpectation ? `Q${Number(salaryExpectation).toLocaleString()}` : 'Q N/A'}
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <div className="text-muted mb-1 fw-medium">
                                            <i className="bi bi-calendar me-1"></i>
                                            Fecha de aplicación
                                        </div>
                                        <div className="text-dark">{applicationDate || 'N/A'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div >
        </>
    );
};

export default ApplicationsTable;