import { useForm } from "react-hook-form";
import RB_Toast from "../../components/RB_Toast";
import { useState } from "react";
import garooLogo from "../../assets/img/garoo-logo.png";

const MundoVerdeInvoices = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: { nit: "", serie: "" },
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
    const [isPersistentToast, setIsPersistentToast] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setIsPersistentToast(false);

        try {
            const pdfFile = data.pdf?.[0] || selectedPdf;
            const xmlFile = data.xml?.[0] || selectedXml;

            if (!pdfFile || !xmlFile || !data.nit || !data.serie) {
                setToastTitle("Campos Incompletos");
                setToastMessage(
                    "Por favor, complete todos los campos requeridos (NIT, Serie, PDF y XML)",
                );
                setToastVariant("warning");
                setIsPersistentToast(false);
                setShowToast(true);
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("nit", data.nit.trim());
            formData.append("serie", data.serie.trim());
            formData.append(
                "pdf",
                new Blob([pdfFile], { type: "application/pdf" }),
                pdfFile.name,
            );
            formData.append(
                "xml",
                new Blob([xmlFile], { type: "text/xml" }),
                xmlFile.name,
            );

            let response;
            try {
                response = await fetch(
                    "https://agentsprod.redtec.ai/webhook/facturas",
                    {
                        method: "POST",
                        body: formData,
                        headers: { Accept: "application/json" },
                    },
                );
            } catch {
                setToastTitle("Error de Conexión");
                setToastMessage(
                    "No se pudo conectar con el servidor. Verifique su conexión e intente nuevamente.",
                );
                setToastVariant("danger");
                setIsPersistentToast(false);
                setShowToast(true);
                setIsLoading(false);
                return;
            }

            let responseData;
            const contentType = response.headers.get("content-type");
            try {
                if (contentType && contentType.includes("application/json")) {
                    responseData = await response.json();
                } else {
                    const text = await response.text();
                    responseData = {
                        status: "error",
                        title: "Error del Servidor",
                        message: text || "Respuesta del servidor inválida",
                    };
                }
            } catch {
                responseData = {
                    status: "error",
                    title: "Error de Formato",
                    message: "No se pudo interpretar la respuesta del servidor",
                };
            }

            if (responseData.status === "ok") {
                setToastTitle(responseData.title || "Éxito");
                setToastMessage(
                    responseData.message || "Datos enviados correctamente",
                );
                setToastVariant("success");
                setIsPersistentToast(true);
            } else if (responseData.status === "error") {
                setToastTitle(responseData.title || "Error");
                setToastMessage(
                    responseData.message ||
                    "Ha ocurrido un error al procesar la factura",
                );
                setToastVariant("danger");
                setIsPersistentToast(false);
            } else if (!response.ok) {
                setToastTitle("Error del Servidor");
                setToastMessage(
                    responseData.message ||
                    `Error ${response.status}: ${response.statusText}`,
                );
                setToastVariant("danger");
                setIsPersistentToast(false);
            } else {
                setToastTitle("Enviado");
                setToastMessage(
                    responseData.message ||
                    "La solicitud se procesó correctamente",
                );
                setToastVariant("success");
                setIsPersistentToast(true);
            }
            setShowToast(true);
        } catch (error) {
            setToastTitle("Error Inesperado");
            setToastMessage(
                error.message ||
                "Ocurrió un error inesperado al enviar los datos",
            );
            setToastVariant("danger");
            setIsPersistentToast(false);
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePdfChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setPdfUrl(URL.createObjectURL(file));
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
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                * { box-sizing: border-box; }

                .mvf-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0a1628 0%, #0f2d1a 50%, #0a1628 100%);
                    display: flex;
                    flex-direction: column;
                    font-family: 'Inter', system-ui, sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                .mvf-page::before {
                    content: '';
                    position: absolute;
                    top: -20%;
                    left: -10%;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 65%);
                    filter: blur(80px);
                    pointer-events: none;
                }

                .mvf-page::after {
                    content: '';
                    position: absolute;
                    bottom: -20%;
                    right: -10%;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%);
                    filter: blur(80px);
                    pointer-events: none;
                }

                /* ── Top bar ── */
                .mvf-topbar {
                    display: flex;
                    align-items: center;
                    gap: 0.85rem;
                    padding: 1.1rem 2rem;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                    background: rgba(0,0,0,0.2);
                    backdrop-filter: blur(10px);
                    position: relative;
                    z-index: 10;
                    flex-shrink: 0;
                }

                .mvf-logo-ring {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05));
                    border: 1.5px solid rgba(16,185,129,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 14px rgba(16,185,129,0.2);
                    flex-shrink: 0;
                }

                .mvf-logo-ring img {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .mvf-topbar-info { flex: 1; }

                .mvf-topbar-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #f1f5f9;
                    margin: 0;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                }

                .mvf-topbar-sub {
                    font-size: 0.72rem;
                    color: #64748b;
                    margin: 0;
                }

                .mvf-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: rgba(16,185,129,0.12);
                    border: 1px solid rgba(16,185,129,0.25);
                    color: #34d399;
                    font-size: 0.7rem;
                    font-weight: 600;
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    padding: 4px 10px;
                    border-radius: 100px;
                }

                .mvf-badge::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #10b981;
                    box-shadow: 0 0 6px #10b981;
                    animation: mvf-pulse 2s ease-in-out infinite;
                }

                @keyframes mvf-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.5; transform: scale(0.75); }
                }

                /* ── Main content layout ── */
                .mvf-body {
                    flex: 1;
                    display: flex;
                    gap: 1.5rem;
                    padding: 1.75rem 2rem;
                    position: relative;
                    z-index: 1;
                    overflow: hidden;
                    min-height: 0;
                }

                /* ── Previews column ── */
                .mvf-previews {
                    flex: 1 1 60%;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                    min-height: 0;
                    min-width: 0;
                }

                .mvf-preview-card {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 18px;
                    overflow: hidden;
                    min-height: 0;
                }

                .mvf-preview-header {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    padding: 0.85rem 1.25rem;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                    flex-shrink: 0;
                }

                .mvf-preview-header-icon {
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                    flex-shrink: 0;
                }

                .mvf-preview-header-icon.pdf {
                    background: rgba(239,68,68,0.12);
                    color: #f87171;
                }

                .mvf-preview-header-icon.xml {
                    background: rgba(59,130,246,0.12);
                    color: #60a5fa;
                }

                .mvf-preview-label {
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: #cbd5e1;
                }

                .mvf-preview-body {
                    flex: 1;
                    overflow: auto;
                    min-height: 0;
                }

                .mvf-empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    gap: 0.65rem;
                    padding: 2rem;
                    min-height: 140px;
                }

                .mvf-empty-icon {
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                }

                .mvf-empty-icon.pdf {
                    background: rgba(239,68,68,0.08);
                    color: rgba(239,68,68,0.5);
                    border: 1.5px dashed rgba(239,68,68,0.2);
                }

                .mvf-empty-icon.xml {
                    background: rgba(59,130,246,0.08);
                    color: rgba(59,130,246,0.5);
                    border: 1.5px dashed rgba(59,130,246,0.2);
                }

                .mvf-empty-text {
                    font-size: 0.8rem;
                    color: #475569;
                    text-align: center;
                    margin: 0;
                }

                /* ── Form column ── */
                .mvf-form-col {
                    width: 340px;
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: column;
                }

                .mvf-form-card {
                    background: rgba(255,255,255,0.035);
                    border: 1px solid rgba(255,255,255,0.09);
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    height: 100%;
                }

                .mvf-form-header {
                    padding: 1.1rem 1.4rem;
                    border-bottom: 1px solid rgba(255,255,255,0.07);
                    flex-shrink: 0;
                }

                .mvf-form-header-title {
                    font-size: 0.88rem;
                    font-weight: 700;
                    color: #e2e8f0;
                    margin: 0 0 0.15rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .mvf-form-header-sub {
                    font-size: 0.72rem;
                    color: #64748b;
                    margin: 0;
                }

                .mvf-form-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1.4rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }

                /* ── Section labels ── */
                .mvf-section-label {
                    font-size: 0.68rem;
                    font-weight: 700;
                    letter-spacing: 0.09em;
                    text-transform: uppercase;
                    color: #10b981;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.85rem;
                }

                .mvf-section-label::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: rgba(16,185,129,0.2);
                }

                /* ── Inputs ── */
                .mvf-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                    margin-bottom: 1rem;
                }

                .mvf-label {
                    font-size: 0.78rem;
                    font-weight: 600;
                    color: #94a3b8;
                }

                .mvf-label .req { color: #10b981; margin-left: 2px; }

                .mvf-input,
                .mvf-file {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    padding: 0.6rem 0.85rem;
                    font-size: 0.88rem;
                    color: #f1f5f9;
                    font-family: inherit;
                    transition: all 0.2s ease;
                    outline: none;
                    width: 100%;
                }

                .mvf-input::placeholder { color: #334155; }

                .mvf-input:focus {
                    border-color: rgba(16,185,129,0.5);
                    background: rgba(16,185,129,0.05);
                    box-shadow: 0 0 0 3px rgba(16,185,129,0.1);
                }

                .mvf-input.err {
                    border-color: rgba(239,68,68,0.5);
                    background: rgba(239,68,68,0.05);
                }

                .mvf-err-msg {
                    font-size: 0.72rem;
                    color: #f87171;
                    margin: 0;
                }

                /* File input */
                .mvf-file-wrapper {
                    position: relative;
                }

                .mvf-file-custom {
                    background: rgba(255,255,255,0.04);
                    border: 1.5px dashed rgba(255,255,255,0.12);
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .mvf-file-custom:hover {
                    border-color: rgba(16,185,129,0.4);
                    background: rgba(16,185,129,0.05);
                }

                .mvf-file-custom input[type="file"] {
                    position: absolute;
                    inset: 0;
                    opacity: 0;
                    cursor: pointer;
                    width: 100%;
                    height: 100%;
                }

                .mvf-file-icon {
                    width: 34px;
                    height: 34px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1rem;
                    flex-shrink: 0;
                }

                .mvf-file-icon.pdf { background: rgba(239,68,68,0.12); color: #f87171; }
                .mvf-file-icon.xml { background: rgba(59,130,246,0.12); color: #60a5fa; }

                .mvf-file-text { flex: 1; min-width: 0; }
                .mvf-file-text p { margin: 0; }
                .mvf-file-text .main { font-size: 0.78rem; font-weight: 600; color: #94a3b8; }
                .mvf-file-text .sub  { font-size: 0.68rem; color: #475569; }
                .mvf-file-text .chosen { font-size: 0.72rem; color: #34d399; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

                /* ── Divider ── */
                .mvf-divider {
                    height: 1px;
                    background: rgba(255,255,255,0.07);
                    margin: 1.1rem 0;
                }

                /* ── Submit button ── */
                .mvf-btn {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: linear-gradient(135deg, #10b981, #059669);
                    border: none;
                    border-radius: 12px;
                    color: #fff;
                    font-size: 0.88rem;
                    font-weight: 700;
                    font-family: inherit;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.55rem;
                    box-shadow: 0 4px 15px rgba(16,185,129,0.3);
                    letter-spacing: 0.01em;
                    margin-top: auto;
                }

                .mvf-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(16,185,129,0.4);
                    background: linear-gradient(135deg, #34d399, #10b981);
                }

                .mvf-btn:active:not(:disabled) { transform: translateY(0); }
                .mvf-btn:disabled { opacity: 0.55; cursor: not-allowed; }

                .mvf-spinner {
                    width: 15px;
                    height: 15px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: mvf-spin 0.7s linear infinite;
                    flex-shrink: 0;
                }

                @keyframes mvf-spin { to { transform: rotate(360deg); } }

                /* iframe / pre */
                .mvf-preview-body iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                    display: block;
                    min-height: 140px;
                }

                .mvf-preview-body pre {
                    margin: 0;
                    padding: 1.25rem;
                    font-size: 0.75rem;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace;
                    color: #94a3b8;
                    background: transparent;
                    height: 100%;
                    overflow: auto;
                    white-space: pre-wrap;
                    word-break: break-all;
                }

                /* ── Responsive ── */
                @media (max-width: 1024px) {
                    .mvf-form-col { width: 300px; }
                }

                @media (max-width: 768px) {
                    .mvf-body {
                        flex-direction: column;
                        padding: 1.25rem 1rem;
                        overflow: auto;
                        min-height: unset;
                    }
                    .mvf-form-col {
                        width: 100%;
                        flex-shrink: unset;
                    }
                    .mvf-form-card { height: auto; }
                    .mvf-previews {
                        min-height: unset;
                    }
                    .mvf-preview-card { min-height: 220px; }
                    .mvf-topbar { padding: 0.9rem 1rem; height: auto; flex-direction: column; gap: .5rem; align-items: center; text-align: center; }
                    .mvf-badge { display: none; }
                    .mvf-logo-ring { display: none; }
                    .mvf-modulo-label { display: none; }
                    .mvf-divider { display: none; }
                }

                @media (max-width: 480px) {
                    .mvf-topbar-title { font-size: 0.88rem; }
                }

                @media (min-width: 769px) {
                    .mvf-page { height: 100vh; overflow: hidden; }
                    .mvf-body { height: calc(100vh - 65px); }
                }
            `}</style>

            <div className="mvf-page">
                {/* ── Top bar ── */}
                <header className="mvf-topbar">
                    <div className="d-flex align-items-center gap-3">
                        <div className="mvf-logo-ring">
                            <img src={garooLogo} alt="Garoo" />
                        </div>
                        <div className="d-flex flex-column">
                            <h1 className="mvf-topbar-title" style={{ fontSize: '1.1rem', marginBottom: '2px' }}>Garoo Portal</h1>
                            <div className="d-flex align-items-center gap-2">
                                <span className="mvf-modulo-label" style={{ fontSize: '.6rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '.05em' }}>Módulo:</span>
                                <span style={{ fontSize: '.65rem', fontWeight: 800, color: '#f1f5f9' }}>Gestor de Facturas</span>
                            </div>
                        </div>
                    </div>

                    <div className="mvf-divider ms-2 me-2" style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,.1)', margin: 0 }} />

                    <span className="mvf-badge">
                        Mundo Verde
                    </span>

                    <div style={{ flex: 1 }} />
                </header>
                {/* ── Main layout ── */}
                <div className="mvf-body">
                    {/* Left — Previews */}
                    <div className="mvf-previews">
                        {/* PDF Preview */}
                        <div className="mvf-preview-card">
                            <div className="mvf-preview-header">
                                <span className="mvf-preview-header-icon pdf">
                                    <i className="bi bi-file-earmark-pdf-fill"></i>
                                </span>
                                <span className="mvf-preview-label">
                                    Visualización PDF
                                </span>
                                {selectedPdf && (
                                    <span
                                        style={{
                                            marginLeft: "auto",
                                            fontSize: "0.7rem",
                                            color: "#34d399",
                                            fontWeight: 600,
                                        }}
                                    >
                                        ✓ {selectedPdf.name}
                                    </span>
                                )}
                            </div>
                            <div className="mvf-preview-body">
                                {pdfUrl ? (
                                    <iframe src={pdfUrl} title="PDF Preview" />
                                ) : (
                                    <div className="mvf-empty-state">
                                        <span className="mvf-empty-icon pdf">
                                            <i className="bi bi-file-earmark-pdf"></i>
                                        </span>
                                        <p className="mvf-empty-text">
                                            Sube un archivo PDF para
                                            previsualizar su contenido aquí
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* XML Preview */}
                        <div className="mvf-preview-card">
                            <div className="mvf-preview-header">
                                <span className="mvf-preview-header-icon xml">
                                    <i className="bi bi-code-slash"></i>
                                </span>
                                <span className="mvf-preview-label">
                                    Estructura XML
                                </span>
                                {selectedXml && (
                                    <span
                                        style={{
                                            marginLeft: "auto",
                                            fontSize: "0.7rem",
                                            color: "#34d399",
                                            fontWeight: 600,
                                        }}
                                    >
                                        ✓ {selectedXml.name}
                                    </span>
                                )}
                            </div>
                            <div className="mvf-preview-body">
                                {xmlContent ? (
                                    <pre>{xmlContent}</pre>
                                ) : (
                                    <div className="mvf-empty-state">
                                        <span className="mvf-empty-icon xml">
                                            <i className="bi bi-code-square"></i>
                                        </span>
                                        <p className="mvf-empty-text">
                                            Sube un archivo XML para ver su
                                            estructura de datos aquí
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="mvf-form-col">
                        <form
                            className="mvf-form-card"
                            onSubmit={handleSubmit(onSubmit)}
                            noValidate
                        >
                            <div className="mvf-form-header">
                                <p className="mvf-form-header-title">
                                    <i
                                        className="bi bi-pencil-square"
                                        style={{ color: "#10b981" }}
                                    ></i>
                                    Formulario de Registro
                                </p>
                                <p className="mvf-form-header-sub">
                                    Complete los campos y adjunte los documentos
                                </p>
                            </div>

                            <div className="mvf-form-body">
                                {/* Section: Identificación */}
                                <p className="mvf-section-label">
                                    Identificación
                                </p>

                                <div className="mvf-group">
                                    <label className="mvf-label" htmlFor="nit">
                                        NIT Emisor{" "}
                                        <span className="req">*</span>
                                    </label>
                                    <input
                                        id="nit"
                                        className={`mvf-input${errors.nit ? " err" : ""}`}
                                        type="text"
                                        placeholder="Ej: 1234567-8"
                                        {...register("nit", { required: true })}
                                    />
                                    {errors.nit && (
                                        <p className="mvf-err-msg">
                                            El NIT es requerido
                                        </p>
                                    )}
                                </div>

                                <div
                                    className="mvf-group"
                                    style={{ marginBottom: "1.4rem" }}
                                >
                                    <label
                                        className="mvf-label"
                                        htmlFor="serie"
                                    >
                                        Serie / Número de Orden{" "}
                                        <span className="req">*</span>
                                    </label>
                                    <input
                                        id="serie"
                                        className={`mvf-input${errors.serie ? " err" : ""}`}
                                        type="text"
                                        placeholder="Ej: A-001"
                                        {...register("serie", {
                                            required: true,
                                        })}
                                    />
                                    {errors.serie && (
                                        <p className="mvf-err-msg">
                                            La serie es requerida
                                        </p>
                                    )}
                                </div>

                                {/* Section: Documentación */}
                                <p className="mvf-section-label">
                                    Documentación
                                </p>

                                {/* PDF Upload */}
                                <div className="mvf-group">
                                    <label className="mvf-label">
                                        Archivo PDF Oficial{" "}
                                        <span className="req">*</span>
                                    </label>
                                    <div className="mvf-file-wrapper">
                                        <label className="mvf-file-custom">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                {...register("pdf", {
                                                    required: true,
                                                    onChange: handlePdfChange,
                                                })}
                                            />
                                            <span className="mvf-file-icon pdf">
                                                <i className="bi bi-file-earmark-pdf-fill"></i>
                                            </span>
                                            <div className="mvf-file-text">
                                                {selectedPdf ? (
                                                    <p className="chosen">
                                                        {selectedPdf.name}
                                                    </p>
                                                ) : (
                                                    <>
                                                        <p className="main">
                                                            Seleccionar PDF
                                                        </p>
                                                        <p className="sub">
                                                            Haz clic para cargar
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                    {errors.pdf && (
                                        <p className="mvf-err-msg">
                                            El PDF es requerido
                                        </p>
                                    )}
                                </div>

                                {/* XML Upload */}
                                <div
                                    className="mvf-group"
                                    style={{ marginBottom: "1.4rem" }}
                                >
                                    <label className="mvf-label">
                                        Archivo XML{" "}
                                        <span className="req">*</span>
                                    </label>
                                    <div className="mvf-file-wrapper">
                                        <label className="mvf-file-custom">
                                            <input
                                                type="file"
                                                accept=".xml"
                                                {...register("xml", {
                                                    required: true,
                                                    onChange: handleXmlChange,
                                                })}
                                            />
                                            <span className="mvf-file-icon xml">
                                                <i className="bi bi-code-slash"></i>
                                            </span>
                                            <div className="mvf-file-text">
                                                {selectedXml ? (
                                                    <p className="chosen">
                                                        {selectedXml.name}
                                                    </p>
                                                ) : (
                                                    <>
                                                        <p className="main">
                                                            Seleccionar XML
                                                        </p>
                                                        <p className="sub">
                                                            Haz clic para cargar
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </label>
                                    </div>
                                    {errors.xml && (
                                        <p className="mvf-err-msg">
                                            El XML es requerido
                                        </p>
                                    )}
                                </div>

                                <div className="mvf-divider"></div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="mvf-btn"
                                    disabled={isLoading}
                                    id="submit-mundo-verde-form"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="mvf-spinner"></span>
                                            Procesando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-shield-check"></i>
                                            Validar y Enviar Factura
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <RB_Toast
                showToast={showToast}
                onClose={() => setShowToast(false)}
                toastVariant={toastVariant}
                toastTitle={toastTitle}
                toastMessage={toastMessage}
                position="middle-center"
                custom_autohide={!isPersistentToast}
                showOkButton={isPersistentToast}
            />
        </>
    );
};

export default MundoVerdeInvoices;
