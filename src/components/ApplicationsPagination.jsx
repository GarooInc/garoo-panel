import { Button } from 'react-bootstrap';

const ApplicationsPagination = ({
    pagination,
    paginationInfo,
    getApplications,
    loading
}) => {
    if (pagination.total === 0) return null;

    return (
        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3 p-3 bg-light rounded">
            <small className="text-muted fw-medium">
                Mostrando {paginationInfo.startRecord} - {paginationInfo.endRecord} de {pagination.total} registros
            </small>

            <div className="d-flex align-items-center gap-2">
                <Button
                    variant="outline-dark"
                    size="sm"
                    disabled={!pagination.has_prev || loading}
                    onClick={() => getApplications(pagination.page - 1, pagination.limit)}
                    className="border-0 text-muted"
                    style={{ backgroundColor: 'white' }}
                >
                    <i className="bi bi-chevron-left"></i> Anterior
                </Button>

                <span className="px-3 py-2 bg-white rounded fw-medium text-dark shadow-sm">
                    Página {pagination.page}
                </span>

                <Button
                    variant="outline-dark"
                    size="sm"
                    disabled={!pagination.has_next || loading}
                    onClick={() => getApplications(pagination.page + 1, pagination.limit)}
                    className="border-0 text-muted"
                    style={{ backgroundColor: 'white' }}
                >
                    Siguiente <i className="bi bi-chevron-right"></i>
                </Button>
            </div>
        </div>
    );
};

export default ApplicationsPagination;