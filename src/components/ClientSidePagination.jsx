import { useState, useMemo } from "react";
import { Button } from "react-bootstrap";

const ClientSidePagination = ({ data, itemsPerPage = 10, renderItems }) => {
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
            endRecord: endIndex,
        };
    }, [data, currentPage, itemsPerPage]);

    const [prevData, setPrevData] = useState(data);

    if (data !== prevData) {
        setPrevData(data);
        setCurrentPage(1);
    }

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
        <div className="d-flex flex-column h-100 overflow-hidden">
            {/* El contenedor de items crece para ocupar el espacio y tiene scroll propio */}
            <div className="flex-grow-1 overflow-auto">
                {renderItems(paginationInfo.currentItems)}
            </div>

            {/* Los controles de paginación se quedan fijos abajo */}
            {paginationInfo.totalItems > 0 && (
                <div className="flex-shrink-0 bg-white border-top py-3 px-4 shadow-sm">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div className="text-secondary small fw-medium">
                            Mostrando{" "}
                            <span className="text-dark">
                                {paginationInfo.startRecord}
                            </span>{" "}
                            -{" "}
                            <span className="text-dark">
                                {paginationInfo.endRecord}
                            </span>{" "}
                            de{" "}
                            <span className="text-dark">
                                {paginationInfo.totalItems}
                            </span>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <button
                                disabled={!paginationInfo.hasPrev}
                                onClick={goToPrevious}
                                className="btn btn-light border py-2 px-3 rounded-pill small transition-all"
                                style={{
                                    backgroundColor: paginationInfo.hasPrev
                                        ? "#ffffff"
                                        : "transparent",
                                    opacity: paginationInfo.hasPrev ? 1 : 0.5,
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="bi bi-chevron-left me-1"></i>
                                Anterior
                            </button>

                            <div className="px-3 py-2 bg-light border rounded-pill small fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                <span>{paginationInfo.currentPage}</span>
                                <span className="text-secondary fw-normal">/</span>
                                <span>{paginationInfo.totalPages}</span>
                            </div>

                            <button
                                disabled={!paginationInfo.hasNext}
                                onClick={goToNext}
                                className="btn btn-light border py-2 px-3 rounded-pill small transition-all"
                                style={{
                                    backgroundColor: paginationInfo.hasNext
                                        ? "#ffffff"
                                        : "transparent",
                                    opacity: paginationInfo.hasNext ? 1 : 0.5,
                                    fontSize: '0.75rem',
                                    fontWeight: '600'
                                }}
                            >
                                Siguiente
                                <i className="bi bi-chevron-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ClientSidePagination;
