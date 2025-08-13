import { useState, useMemo } from 'react';
import { Button } from 'react-bootstrap';

const ClientSidePagination = ({
    data,
    itemsPerPage = 10,
    renderItems
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Calcular información de paginación
    const paginationInfo = useMemo(() => {
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const currentItems = data.slice(startIndex, endIndex);

        return {
            totalItems,
            totalPages,
            currentPage,
            startIndex,
            endIndex,
            currentItems,
            hasNext: currentPage < totalPages,
            hasPrev: currentPage > 1,
            startRecord: startIndex + 1,
            endRecord: endIndex
        };
    }, [data, currentPage, itemsPerPage]);

    // Resetear a página 1 cuando cambien los datos
    useMemo(() => {
        setCurrentPage(1);
    }, [data]);

    const goToPage = (page) => {
        if (page >= 1 && page <= paginationInfo.totalPages) {
            setCurrentPage(page);
        }
    };

    const goToPrevious = () => {
        if (paginationInfo.hasPrev) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (paginationInfo.hasNext) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div>
            {/* Renderizar los items actuales */}
            {renderItems(paginationInfo.currentItems)}

            {/* Controles de paginación */}
            {paginationInfo.totalItems > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3 p-3 bg-light rounded">
                    <small className="text-muted fw-medium">
                        Mostrando {paginationInfo.startRecord} - {paginationInfo.endRecord} de {paginationInfo.totalItems} registros
                    </small>

                    <div className="d-flex align-items-center gap-2">
                        <Button
                            variant="outline-dark"
                            size="sm"
                            disabled={!paginationInfo.hasPrev}
                            onClick={goToPrevious}
                            className="border-0 text-muted"
                            style={{ backgroundColor: 'white' }}
                        >
                            <i className="bi bi-chevron-left"></i> Anterior
                        </Button>

                        <span className="px-3 py-2 bg-white rounded fw-medium text-dark shadow-sm">
                            Página {paginationInfo.currentPage} de {paginationInfo.totalPages}
                        </span>

                        <Button
                            variant="outline-dark"
                            size="sm"
                            disabled={!paginationInfo.hasNext}
                            onClick={goToNext}
                            className="border-0 text-muted"
                            style={{ backgroundColor: 'white' }}
                        >
                            Siguiente <i className="bi bi-chevron-right"></i>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientSidePagination;