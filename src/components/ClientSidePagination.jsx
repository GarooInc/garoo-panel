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
        <div>
            {/* Renderizar los items actuales */}
            {renderItems(paginationInfo.currentItems)}

            {/* Controles de paginación */}
            {paginationInfo.totalItems > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
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
                            className="btn btn-light border-0 py-2 px-3 rounded-3 small text-secondary"
                            style={{
                                backgroundColor: paginationInfo.hasPrev
                                    ? "#ffffff"
                                    : "transparent",
                                opacity: paginationInfo.hasPrev ? 1 : 0.5,
                            }}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>

                        <div className="px-3 py-2 bg-white border rounded-3 small fw-bold text-dark shadow-sm">
                            {paginationInfo.currentPage}{" "}
                            <span className="text-secondary fw-normal mx-1">
                                /
                            </span>{" "}
                            {paginationInfo.totalPages}
                        </div>

                        <button
                            disabled={!paginationInfo.hasNext}
                            onClick={goToNext}
                            className="btn btn-light border-0 py-2 px-3 rounded-3 small text-secondary"
                            style={{
                                backgroundColor: paginationInfo.hasNext
                                    ? "#ffffff"
                                    : "transparent",
                                opacity: paginationInfo.hasNext ? 1 : 0.5,
                            }}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientSidePagination;
