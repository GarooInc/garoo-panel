

import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useForm } from 'react-hook-form';
import Button_back_RB from '../components/Button_back_RB';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useFormData } from '../config/FormProvider';



const FormPage = () => {

    const { register, handleSubmit } = useForm();

    const { sendData } = useFormData();

    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');

    const onSubmit = async (data) => {

        setIsLoading(true);

        try {
            // console.log("Datos del formulario:", data);

            const formData = new FormData();

            // Agregar todos los campos del formulario
            formData.append('nit', data.nit);
            formData.append('serie', data.serie);
            formData.append('nroFactura', data.nroFactura);
            formData.append('nroOrden', data.nroOrden);

            if (data.pdf && data.pdf[0]) {
                formData.append('pdf', data.pdf[0]);
            }

            // Enviar datos usando el provider
            await sendData(formData);

            // console.log("Formulario enviado exitosamente");
            setToastMessage('Datos enviados correctamente');
            setToastVariant('success');
            setShowToast(true);
        }
        catch (error) {
            console.error("Error al enviar datos:", error);
            setToastMessage('Error');
            setToastVariant('danger');
            setShowToast(true);
        }
        finally {
            setIsLoading(false);
        }
    };





    const navigateTo = useNavigate();

    const goToDashboard = () => {
        navigateTo('/services');
    };

    // Función para manejar el cambio de archivo PDF
    const handlePdfChange = (e) => {

        const file = e.target.files[0];

        if (file && file.type === 'application/pdf') {
            const url = URL.createObjectURL(file);
            setPdfUrl(url);
            setSelectedFile(file);
        }
        else {
            setPdfUrl(null);
            setSelectedFile(null);
        }
    };

    return (
        <>
            <Button_back_RB onClick={goToDashboard} className={'postion-absolute top-50 start-0 translate-middle-y'} />

            <div className='d-flex gap-5'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className='bg-secondary-subtle p-4 border rounded shadow-sm' style={{ width: "20rem" }}>

                        <FloatingLabel
                            controlId="input_nit"
                            label="NIT (Sin guión)"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="526349L"
                                {...register("nit", { required: true })}
                            />
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="serie"
                            label="Nro. Serie"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="526349L"
                                {...register("serie", { required: true })}
                            />
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="input_nro_factura"
                            label="Nro. de Factura"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="1406121529"
                                {...register("nroFactura", { required: true })}
                            />
                        </FloatingLabel>

                        <FloatingLabel
                            controlId="input_orden_factura"
                            label="Nro. Orden de Compra"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                placeholder="A4F22B61"
                                {...register("nroOrden", { required: true })}
                            />
                        </FloatingLabel>

                        <Form.Group controlId="input_pdf" className="mb-5">
                            <Form.Label className='m-1 fw-bold' style={{ fontSize: "70%" }}>Subir la factura en PDF</Form.Label>
                            <Form.Control
                                type="file"
                                size="md"
                                accept=".pdf"
                                {...register("pdf", { required: true })}
                                onChange={handlePdfChange}
                            />
                        </Form.Group>

                        <button
                            type="submit"
                            className='btn btn-primary w-100'
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Enviando...
                                </>
                            ) : (
                                'Enviar'
                            )}
                        </button>
                    </div>
                </Form>

                <div className='PREVIEW w-100 border rounded bg-light p-3'>
                    {pdfUrl ? (
                        <div>
                            <h5 className="mb-3">{selectedFile ? selectedFile.name : "Vista previa del PDF:"}</h5>
                            <iframe
                                src={pdfUrl}
                                width="100%"
                                height="400px"
                                title="Vista previa del PDF"
                            />
                        </div>
                    ) : (
                        <div className="text-center text-muted">
                            <p>Selecciona un archivo PDF para ver la vista previa</p>
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer position="top-end" className="p-3">
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                    bg={toastVariant}
                >
                    <Toast.Body className="text-white">
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    );
};

export default FormPage;