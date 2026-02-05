import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import RB_Toast from "../components/RB_Toast";
import { useState } from "react";

const FormPage = () => {
    // Definimos una paleta de colores profesional
    const colors = {
        primary: "#1e293b", // Slate 800
        accent: "#3b82f6", // Blue 500
        border: "#e2e8f0", // Slate 200
        bgSubtle: "#f8fafc", // Slate 50
        text: "#0f172a", // Slate 900
        textMuted: "#64748b", // Slate 500
        danger: "#ef4444", // Red 500
        success: "#10b981", // Emerald 500
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            nit: "",
            serie: "",
        },
    });

    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [xmlContent, setXmlContent] = useState(null);
    const [selectedXml, setSelectedXml] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastTitle, setToastTitle] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("");

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            if (!data.pdf?.[0] || !data.xml?.[0]) {
                throw new Error(
                    "Por favor, complete todos los campos requeridos",
                );
            }

            const pdfFile = data.pdf[0];
            const xmlFile = data.xml[0];

            const formData = new FormData();
            formData.append("nit", data.nit.trim());
            formData.append("serie", data.serie.trim());

            const pdfBlob = new Blob([pdfFile], { type: "application/pdf" });
            formData.append("pdf", pdfBlob, pdfFile.name);

            const xmlBlob = new Blob([xmlFile], { type: "text/xml" });
            formData.append("xml", xmlBlob, xmlFile.name);

            const response = await fetch(
                "https://agentsprod.redtec.ai/webhook/facturas",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json",
                    },
                },
            );

            let responseData;
            const contentType = response.headers.get("content-type");

            try {
                if (contentType && contentType.includes("application/json")) {
                    responseData = await response.json();
                } else {
                    const text = await response.text();
                    responseData = { message: text };
                }
            } catch {
                responseData = { message: "Respuesta del servidor inválida" };
            }

            if (!response.ok) {
                throw new Error(
                    responseData.message ||
                        `Error del servidor (${response.status}): ${response.statusText}`,
                );
            }

            setToastTitle("Éxito");
            setToastMessage("Datos enviados correctamente");
            setToastVariant("success");
            setShowToast(true);
        } catch (error) {
            setToastTitle("Error");
            setToastMessage(
                error.message || "Ocurrió un error al enviar los datos",
            );
            setToastVariant("danger");
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            const url = URL.createObjectURL(file);
            setPdfUrl(url);
            setSelectedPdf(file);
        } else {
            setPdfUrl(null);
            setSelectedPdf(null);
        }
    };

    const handleXmlChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileName = file.name.toLowerCase();
            if (
                fileName.endsWith(".xml") ||
                file.type === "text/xml" ||
                file.type === "application/xml"
            ) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const content = event.target.result;
                    if (content.trim().startsWith("<")) {
                        setXmlContent(content);
                        setSelectedXml(file);
                    }
                };
                reader.readAsText(file, "UTF-8");
            }
        } else {
            setXmlContent(null);
            setSelectedXml(null);
        }
    };

    return (
        <div
            style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}
            className="main-wrapper"
        >
            <div className="container-fluid px-4 py-4 main-container-dashboard">
                {/* Título principal profesional */}
                <div className="text-start mb-4 ps-1">
                    <h2
                        className="fw-bold mb-1 responsive-title"
                        style={{
                            color: colors.primary,
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Gestión Documental de Facturas
                    </h2>
                    <p className="text-muted small mb-0">
                        Portal corporativo para la carga y validación de
                        documentos tributarios.
                    </p>
                </div>

                <Form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-fill-content"
                >
                    <div className="row g-4 h-100">
                        {/* Columna de vistas previas */}
                        <div className="col-12 col-lg-7 order-2 order-lg-1 h-100-lg">
                            {/* Card PDF */}
                            <div className="card shadow border-1 border-danger mb-3 overflow-hidden preview-card-half">
                                <div
                                    className="card-header border-0 py-3 bg-white"
                                    style={{
                                        borderBottom: `1px solid ${colors.border}`,
                                    }}
                                >
                                    <h6
                                        className="mb-0 fw-bold d-flex align-items-center"
                                        style={{ color: colors.primary }}
                                    >
                                        <i
                                            className="bi bi-file-earmark-pdf-fill me-2"
                                            style={{ color: colors.danger }}
                                        ></i>
                                        Visualización de Archivo PDF
                                    </h6>
                                </div>
                                <div className="card-body p-0 flex-grow-1 overflow-auto">
                                    {pdfUrl ? (
                                        <iframe
                                            src={pdfUrl}
                                            width="100%"
                                            height="100%"
                                            title="PDF Preview"
                                            style={{
                                                border: "none",
                                                minHeight: "200px",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="d-flex flex-column align-items-center justify-content-center h-100"
                                            style={{
                                                backgroundColor:
                                                    colors.bgSubtle,
                                            }}
                                        >
                                            <i
                                                className="bi bi-file-earmark-pdf text-light-emphasis mb-2"
                                                style={{ fontSize: "2.5rem" }}
                                            ></i>
                                            <p className="text-muted small">
                                                No se ha cargado ningún archivo
                                                PDF
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card XML */}
                            <div className="card shadow border-1 border-primary mb-0 overflow-hidden preview-card-half">
                                <div
                                    className="card-header border-0 py-3 bg-white"
                                    style={{
                                        borderBottom: `1px solid ${colors.border}`,
                                    }}
                                >
                                    <h6
                                        className="mb-0 fw-bold d-flex align-items-center"
                                        style={{ color: colors.primary }}
                                    >
                                        <i
                                            className="bi bi-code-slash me-2"
                                            style={{ color: colors.accent }}
                                        ></i>
                                        Estructura de Datos XML
                                    </h6>
                                </div>

                                <div className="card-body p-0 flex-grow-1 overflow-auto">
                                    {xmlContent ? (
                                        <pre
                                            className="mb-0"
                                            style={{
                                                height: "100%",
                                                overflow: "auto",
                                                backgroundColor: "#1e293b", // Slate 800 for code
                                                color: "#f8fafc",
                                                padding: "1.5rem",
                                                fontSize: "0.8rem",
                                                fontFamily:
                                                    "'JetBrains Mono', 'Fira Code', monospace",
                                                margin: 0,
                                            }}
                                        >
                                            {xmlContent}
                                        </pre>
                                    ) : (
                                        <div
                                            className="d-flex flex-column align-items-center justify-content-center h-100"
                                            style={{
                                                backgroundColor:
                                                    colors.bgSubtle,
                                            }}
                                        >
                                            <i
                                                className="bi bi-code-square text-light-emphasis mb-2"
                                                style={{ fontSize: "2.5rem" }}
                                            ></i>
                                            <p className="text-muted small">
                                                No se ha cargado ningún archivo
                                                XML
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Columna de Formulario */}
                        <div className="col-12 col-lg-5 px-xxl-5 px-xl-4 px-lg-3 px-md-5 px-2 order-1 order-lg-2 h-100-lg">
                            <div
                                className="card shadow h-100 overflow-hidden"
                                style={{
                                    borderColor: "gray",
                                    border: "1px solid gray",
                                }}
                            >
                                <div
                                    className="card-header border-0 py-3 bg-white"
                                    style={{
                                        borderBottom: `1px solid ${colors.border}`,
                                    }}
                                >
                                    <h6
                                        className="mb-0 fw-bold d-flex align-items-center"
                                        style={{ color: colors.primary }}
                                    >
                                        <i className="bi bi-pencil-square me-2"></i>
                                        Formulario de Registro
                                    </h6>
                                </div>

                                <div className="card-body p-4 overflow-auto">
                                    {/* Sección: Identificación */}
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div
                                                style={{
                                                    width: "4px",
                                                    height: "16px",
                                                    backgroundColor:
                                                        colors.accent,
                                                    borderRadius: "0",
                                                    marginRight: "10px",
                                                }}
                                            ></div>
                                            <p
                                                className="text-uppercase fw-bold mb-0"
                                                style={{
                                                    fontSize: "0.7rem",
                                                    color: colors.primary,
                                                    letterSpacing: "1px",
                                                }}
                                            >
                                                Información General
                                            </p>
                                        </div>
                                        <div
                                            className="p-3 rounded-0 mb-3"
                                            style={{
                                                backgroundColor: "#ffffff",
                                                border: `1px solid ${colors.border}`,
                                            }}
                                        >
                                            <div className="mb-3">
                                                <FloatingLabel
                                                    controlId="nit"
                                                    label="NIT Emisor"
                                                >
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="NIT"
                                                        className="high-contrast-input"
                                                        {...register("nit", {
                                                            required: true,
                                                        })}
                                                        isInvalid={!!errors.nit}
                                                    />
                                                </FloatingLabel>
                                            </div>
                                            <div>
                                                <FloatingLabel
                                                    controlId="serie"
                                                    label="Serie / Número de Orden"
                                                >
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Serie"
                                                        className="high-contrast-input"
                                                        {...register("serie", {
                                                            required: true,
                                                        })}
                                                        isInvalid={
                                                            !!errors.serie
                                                        }
                                                    />
                                                </FloatingLabel>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sección: Carga de Archivos */}
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <div
                                                style={{
                                                    width: "4px",
                                                    height: "16px",
                                                    backgroundColor:
                                                        colors.accent,
                                                    borderRadius: "0",
                                                    marginRight: "10px",
                                                }}
                                            ></div>
                                            <p
                                                className="text-uppercase fw-bold mb-0"
                                                style={{
                                                    fontSize: "0.7rem",
                                                    color: colors.primary,
                                                    letterSpacing: "1px",
                                                }}
                                            >
                                                Documentación Adjunta
                                            </p>
                                        </div>
                                        <div
                                            className="p-3 rounded-0"
                                            style={{
                                                backgroundColor: "#ffffff",
                                                border: `1px solid ${colors.border}`,
                                            }}
                                        >
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-secondary mb-1">
                                                    Archivo PDF Oficial
                                                </label>
                                                <Form.Control
                                                    type="file"
                                                    accept=".pdf"
                                                    {...register("pdf", {
                                                        required: true,
                                                    })}
                                                    onChange={handlePdfChange}
                                                    isInvalid={!!errors.pdf}
                                                    className="bg-white"
                                                    style={{
                                                        fontSize: "0.9rem",
                                                    }}
                                                />
                                                {selectedPdf && (
                                                    <div className="mt-1 small text-success">
                                                        ✓ {selectedPdf.name}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mb-0">
                                                <label className="form-label small fw-bold text-secondary mb-1">
                                                    Archivo XML (Estructura)
                                                </label>
                                                <Form.Control
                                                    type="file"
                                                    accept=".xml"
                                                    {...register("xml", {
                                                        required: true,
                                                    })}
                                                    onChange={handleXmlChange}
                                                    isInvalid={!!errors.xml}
                                                    className="bg-white"
                                                    style={{
                                                        fontSize: "0.9rem",
                                                    }}
                                                />
                                                {selectedXml && (
                                                    <div className="mt-1 small text-success">
                                                        ✓ {selectedXml.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <hr
                                        className="my-4"
                                        style={{
                                            opacity: 0.1,
                                            borderTop: `1px solid ${colors.primary}`,
                                        }}
                                    />

                                    <button
                                        type="submit"
                                        className="btn w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center transform-active"
                                        disabled={isLoading}
                                        style={{
                                            backgroundColor: colors.primary,
                                            color: "white",
                                            border: "none",
                                            borderRadius: "0",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Procesando Información...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-shield-check me-2"></i>
                                                Validar y Enviar Factura
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>

            <RB_Toast
                showToast={showToast}
                onClose={() => setShowToast(false)}
                toastVariant={toastVariant}
                toastTitle={toastTitle}
                toastMessage={toastMessage}
                position="middle-center"
            />

            <style>{`
                .card, .card-header, .card-footer, .form-control, .btn, .rounded, .rounded-1, .rounded-2, .rounded-3, .rounded-4, .rounded-5, .toast, .toast-header {
                    border-radius: 0 !important;
                }
                .transform-active:active {
                    transform: scale(0.98);
                }
                .x-small {
                    font-size: 0.75rem;
                }
                input.high-contrast-input, 
                .form-control.high-contrast-input {
                    color: #000000 !important;
                    background-color: #ffffff !important;
                    background: #ffffff !important;
                    border: 2px solid #94a3b8 !important;
                    font-size: 1.15rem !important;
                    font-weight: 700 !important;
                    height: calc(3.5rem + 2px) !important;
                    padding: 1.625rem 0.75rem 0.625rem 0.75rem !important;
                }
                .high-contrast-input:focus {
                    border-color: #3b82f6 !important;
                    box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.2) !important;
                    background-color: #ffffff !important;
                    color: #000000 !important;
                }
                .form-floating > label {
                    color: #475569 !important;
                    font-weight: 500 !important;
                    opacity: 0.8 !important;
                }
                .form-floating > .form-control:focus ~ label,
                .form-floating > .form-control:not(:placeholder-shown) ~ label {
                    color: #2563eb !important;
                    font-weight: 700 !important;
                    opacity: 1 !important;
                    transform: scale(0.85) translateY(-0.75rem) translateX(0.15rem) !important;
                }
                .card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .card:hover {
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
                }
                
                @media (min-width: 992px) {
                    .main-wrapper {
                        height: 100vh;
                        overflow: hidden;
                    }
                    .main-container-dashboard {
                        height: 100vh;
                        display: flex;
                        flex-direction: column;
                    }
                    .flex-fill-content {
                        flex: 1;
                        overflow: hidden;
                        padding-bottom: 30px;
                    }
                    .h-100-lg {
                        height: 100% !important;
                        display: flex;
                        flex-direction: column;
                    }
                    .preview-card-half {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        min-height: 0;
                    }
                    /* Ocultamos scroll de la página pero permitimos interno */
                    body {
                        overflow: hidden;
                    }
                }

                @media (max-width: 991px) {
                    .responsive-preview-container {
                        height: 350px;
                    }
                    .main-wrapper {
                        overflow-y: auto;
                    }
                }
                @media (max-width: 576px) {
                    .responsive-preview-container {
                        height: 300px;
                    }
                    .responsive-title {
                        font-size: 1.5rem;
                    }
                    .container-fluid {
                        padding-left: 1rem !important;
                        padding-right: 1rem !important;
                    }
                }
                @media (min-width: 1400px) {
                   .container-fluid {
                       padding-left: 6rem !important;
                       padding-right: 6rem !important;
                   }
                }
            `}</style>
        </div>
    );
};

export default FormPage;
