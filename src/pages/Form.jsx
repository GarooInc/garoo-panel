import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import Button_back_RB from "../components/Button_back_RB";
import RB_Toast from "../components/RB_Toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormData } from "../config/FormProvider";

const FormPage = () => {
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

    const { sendData } = useFormData();

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
            const formData = new FormData();
            formData.append("nit", data.nit.trim());
            formData.append("serie", data.serie.trim());

            if (!data.pdf?.[0] || !data.xml?.[0]) {
                throw new Error(
                    "Por favor, complete todos los campos requeridos"
                );
            }

            formData.append("pdf", data.pdf[0]);
            formData.append("xml", data.xml[0]);

            // Enviar datos al webhook
            const response = await fetch(
                "https://agentsprod.redtec.ai/webhook/facturas",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Error al enviar los datos"
                );
            }

            setToastTitle("Éxito");
            setToastMessage("Datos enviados correctamente");
            setToastVariant("success");
            setShowToast(true);
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setToastTitle("Error");
            setToastMessage(
                error.message || "Ocurrió un error al enviar los datos"
            );
            setToastVariant("danger");
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateTo = useNavigate();

    const goToDashboard = () => {
        navigateTo("/services");
    };

    // Función para manejar el cambio de archivo PDF
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

    // Función para manejar el cambio de archivo XML
    const handleXmlChange = (e) => {
        const file = e.target.files[0];

        if (file && (file.type === "text/xml" || file.name.endsWith(".xml"))) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setXmlContent(event.target.result);
                setSelectedXml(file);
            };
            reader.readAsText(file);
        } else {
            setXmlContent(null);
            setSelectedXml(null);
        }
    };

    return (
        <>
            <Button_back_RB
                onClick={goToDashboard}
                className={"postion-absolute top-50 start-0 translate-middle-y"}
            />

            <div className="d-flex flex-column gap-4">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="bg-secondary-subtle p-4 border rounded shadow-sm">
                        <div className="row g-3 align-items-end">
                            <div className="col-12 col-md-3">
                                <FloatingLabel
                                    controlId="input_nit"
                                    label="NIT (Sin guión)"
                                >
                                    <Form.Control
                                        type="text"
                                        placeholder="526349L"
                                        isInvalid={!!errors.nit}
                                        {...register("nit", {
                                            required: "El NIT es requerido",
                                            pattern: {
                                                value: /^[0-9A-Za-z]+$/,
                                                message:
                                                    "El NIT no debe contener guiones ni caracteres especiales",
                                            },
                                            minLength: {
                                                value: 3,
                                                message:
                                                    "El NIT debe tener al menos 3 caracteres",
                                            },
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.nit?.message}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </div>

                            <div className="col-12 col-md-3">
                                <FloatingLabel
                                    controlId="serie"
                                    label="Nro. Orden Factura"
                                >
                                    <Form.Control
                                        type="text"
                                        placeholder="526349L"
                                        isInvalid={!!errors.serie}
                                        {...register("serie", {
                                            required:
                                                "El número de orden de factura es requerido",
                                            minLength: {
                                                value: 2,
                                                message:
                                                    "El número de orden de factura debe tener al menos 2 caracteres",
                                            },
                                        })}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.serie?.message}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </div>

                            <div className="col-12 col-md-3">
                                <Form.Group controlId="input_pdf">
                                    <Form.Label
                                        className="m-1 fw-bold"
                                        style={{ fontSize: "70%" }}
                                    >
                                        Subir factura en PDF
                                    </Form.Label>
                                    <Form.Control
                                        type="file"
                                        size="md"
                                        accept=".pdf"
                                        isInvalid={!!errors.pdf}
                                        {...register("pdf", {
                                            required:
                                                "El archivo PDF es requerido",
                                            validate: {
                                                isPdf: (files) =>
                                                    files[0]?.type ===
                                                    "application/pdf" ||
                                                    "El archivo debe ser un PDF válido",
                                                maxSize: (files) =>
                                                    files[0]?.size <=
                                                    5 * 1024 * 1024 ||
                                                    "El archivo no debe superar los 5MB",
                                            },
                                        })}
                                        onChange={handlePdfChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.pdf?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>

                            <div className="col-12 col-md-3">
                                <Form.Group controlId="input_xml">
                                    <Form.Label
                                        className="m-1 fw-bold"
                                        style={{ fontSize: "70%" }}
                                    >
                                        Subir factura en XML
                                    </Form.Label>
                                    <Form.Control
                                        type="file"
                                        size="md"
                                        accept=".xml,text/xml"
                                        isInvalid={!!errors.xml}
                                        {...register("xml", {
                                            required:
                                                "El archivo XML es requerido",
                                            validate: {
                                                isXml: (files) =>
                                                    files[0]?.type ===
                                                    "text/xml" ||
                                                    files[0]?.name.endsWith(
                                                        ".xml"
                                                    ) ||
                                                    "El archivo debe ser un XML válido",
                                                maxSize: (files) =>
                                                    files[0]?.size <=
                                                    5 * 1024 * 1024 ||
                                                    "El archivo no debe superar los 5MB",
                                            },
                                        })}
                                        onChange={handleXmlChange}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.xml?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </Form>

                <div className="d-flex justify-content-end mt-0 mb-3">
                    <button
                        type="submit"
                        className="btn btn-sm btn-success px-4 shadow-sm fw-bold"
                        disabled={isLoading}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {isLoading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                Enviando...
                            </>
                        ) : (
                            "Enviar"
                        )}
                    </button>
                </div>

                <div className="w-100">
                    <div className="row g-3 bg-secondary-subtle rounded pb-3 shadow-sm">
                        <div className="col-12 col-md-6">
                            <div className="border rounded bg-light p-3 h-100">
                                <h5 className="mb-3">Vista Previa PDF</h5>
                                {pdfUrl ? (
                                    <div>
                                        <p className="small text-muted">
                                            {selectedPdf?.name}
                                        </p>
                                        <iframe
                                            src={pdfUrl}
                                            width="100%"
                                            height="300px"
                                            title="Vista previa del PDF"
                                            className="border rounded"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="text-center text-muted d-flex align-items-center justify-content-center"
                                        style={{ height: "300px" }}
                                    >
                                        <p>Selecciona un archivo PDF</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="border rounded bg-light p-3 h-100">
                                <h5 className="mb-3">Vista Previa XML</h5>
                                {xmlContent ? (
                                    <div>
                                        <p className="small text-muted">
                                            {selectedXml?.name}
                                        </p>
                                        <pre
                                            style={{
                                                height: "300px",
                                                overflow: "auto",
                                                backgroundColor: "#f8f9fa",
                                                padding: "10px",
                                                borderRadius: "4px",
                                                border: "1px solid #dee2e6",
                                                whiteSpace: "pre-wrap",
                                                wordWrap: "break-word",
                                                fontSize: "12px",
                                                fontFamily: "monospace",
                                            }}
                                        >
                                            {xmlContent}
                                        </pre>
                                    </div>
                                ) : (
                                    <div
                                        className="text-center text-muted d-flex align-items-center justify-content-center"
                                        style={{ height: "300px" }}
                                    >
                                        <p>Selecciona un archivo XML</p>
                                    </div>
                                )}
                            </div>
                        </div>
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
                custom_autohide={false}
                delay={null}
            />
        </>
    );
};

export default FormPage;
