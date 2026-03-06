import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const RB_Toast = ({
    showToast,
    onClose,
    toastVariant,
    toastTitle,
    toastMessage,
    position = "top-center",
    custom_autohide,
    delay,
    showOkButton = false,
}) => {
    const themes = {
        success: {
            bg: "#ecfdf5",
            color: "#059669",
            icon: "bi-check-circle-fill",
        },
        danger: {
            bg: "#fef2f2",
            color: "#dc2626",
            icon: "bi-exclamation-triangle-fill",
        },
        warning: {
            bg: "#fffbeb",
            color: "#d97706",
            icon: "bi-exclamation-circle-fill",
        },
        info: {
            bg: "#eff6ff",
            color: "#2563eb",
            icon: "bi-info-circle-fill",
        },
    };

    const theme = themes[toastVariant] || themes.info;

    return (
        <ToastContainer
            position={position}
            className="p-4"
            style={{ zIndex: 10000, position: "fixed" }}
        >
            <Toast
                show={showToast}
                onClose={onClose}
                autohide={custom_autohide ?? true}
                delay={delay ?? 4000}
                className="border-0 shadow-lg rounded-4 overflow-hidden"
                style={{
                    minWidth: "350px",
                    maxWidth: "90vw",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                }}
            >
                <div className="d-flex align-items-center p-3">
                    <div
                        className="rounded-3 d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: theme.bg,
                            color: theme.color,
                            fontSize: "1.25rem"
                        }}
                    >
                        <i className={`bi ${theme.icon}`}></i>
                    </div>

                    <div className="flex-grow-1 pr-3">
                        <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "0.95rem" }}>
                            {toastTitle}
                        </h6>
                        <p className="mb-0 text-secondary small" style={{ lineHeight: "1.4" }}>
                            {toastMessage}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn-close ms-2 smaller"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                {showOkButton && (
                    <div className="px-3 pb-3 d-flex justify-content-end">
                        <button
                            className="btn btn-sm px-4 fw-bold"
                            style={{
                                backgroundColor: theme.color,
                                color: '#fff',
                                borderRadius: '8px',
                                fontSize: '0.8rem'
                            }}
                            onClick={onClose}
                        >
                            OK
                        </button>
                    </div>
                )}
                {(custom_autohide ?? true) && (
                    <div
                        className="toast-progress-bar"
                        style={{
                            height: "3px",
                            width: "100%",
                            backgroundColor: theme.color,
                            opacity: 0.3
                        }}
                    ></div>
                )}
            </Toast>
        </ToastContainer>
    );
};

export default RB_Toast;
