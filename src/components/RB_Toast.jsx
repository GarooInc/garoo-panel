import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const RB_Toast = ({
    showToast,
    onClose,
    toastVariant,
    toastTitle,
    toastMessage,
    position,
    custom_autohide,
    delay,
}) => {
    // Definimos los temas para asegurar consistencia total
    const themes = {
        success: {
            color: "#10b981", // Esmeralda
            icon: "bi-check-circle-fill",
        },
        danger: {
            color: "#ef4444", // Rojo
            icon: "bi-exclamation-triangle-fill",
        },
        warning: {
            color: "#f59e0b", // Ámbar
            icon: "bi-exclamation-circle-fill",
        },
        info: {
            color: "#3b82f6", // Azul
            icon: "bi-info-circle-fill",
        },
    };

    // Obtenemos el tema actual, por defecto usamos info si no existe el variant
    const theme = themes[toastVariant] || themes.info;

    return (
        <ToastContainer
            position={position}
            className="p-0"
            style={{
                zIndex: 10000,
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "auto",
            }}
        >
            <Toast
                show={showToast}
                onClose={onClose}
                autohide={custom_autohide ?? true}
                delay={delay ?? 5000}
                className="shadow border-0 overflow-hidden"
                style={{
                    minWidth: "480px",
                    maxWidth: "90vw",
                    borderRadius: "0",
                    border: `1px solid ${theme.color}`,
                    backgroundColor: "white",
                }}
            >
                <div
                    className="d-flex align-items-stretch"
                    style={{ minHeight: "130px" }}
                >
                    {/* Barra lateral de color con ícono grande */}
                    <div
                        className="d-flex align-items-center justify-content-center px-4"
                        style={{
                            backgroundColor: theme.color,
                            color: "white",
                            fontSize: "3rem",
                        }}
                    >
                        <i className={`bi ${theme.icon}`}></i>
                    </div>

                    <div className="flex-grow-1 p-4 d-flex flex-column justify-content-center">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h3
                                className="fw-bold mb-0"
                                style={{
                                    color: "#1e293b",
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                {toastTitle}
                            </h3>
                            <button
                                type="button"
                                className="btn-close ms-2"
                                onClick={onClose}
                                style={{ fontSize: "0.9rem" }}
                            ></button>
                        </div>
                        <p className="mb-0 text-muted fs-5 lh-sm">
                            {toastMessage}
                        </p>
                    </div>
                </div>
            </Toast>
        </ToastContainer>
    );
};

export default RB_Toast;
