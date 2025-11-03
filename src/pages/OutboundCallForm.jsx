import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const OutboundCallForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        productOfInterest: "",
        otherProduct: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const products = [
        "Savings Account",
        "Credit Card",
        "Loan",
        "Insurance",
        "Other",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus(null);

        try {
            // Enviar datos y esperar la respuesta
            const response = await axios.post(
                "https://n8n.srv853599.hstgr.cloud/webhook/419bb751-1cc3-43d6-923b-c0b77e078802",
                {
                    "First Name": formData.firstName,
                    "Last Name": formData.lastName,
                    Email: formData.email,
                    "Phone Number": formData.phoneNumber,
                    "Products Of Interest": formData.productOfInterest,
                    "Other (Only Fill this if product isn't available above)":
                        formData.otherProduct,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Mostrar éxito si la respuesta es exitosa
            console.log("Form data sent successfully:", response.data);
            setSubmitStatus({
                type: "success",
                message: "¡Formulario enviado exitosamente! Nos pondremos en contacto contigo pronto.",
            });

            // Resetear formulario
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                productOfInterest: "",
                otherProduct: "",
            });
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            setSubmitStatus({
                type: "danger",
                message: "Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="text-center mb-4">
                        <h2>Banco Ficohsa</h2>
                        <p className="text-muted">Banco Ficohsa Online Form</p>
                    </div>

                    {submitStatus && (
                        <Alert
                            variant={submitStatus.type}
                            dismissible
                            onClose={() => setSubmitStatus(null)}
                        >
                            {submitStatus.message}
                        </Alert>
                    )}

                    <Form
                        onSubmit={handleSubmit}
                        className="p-4 border rounded-3 shadow-sm"
                        style={{ backgroundColor: "white" }}
                    >
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>
                                First Name{" "}
                                <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Enter First Name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="lastName">
                            <Form.Label>
                                Last Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter Last Name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>
                                Email <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter Email"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="phoneNumber">
                            <Form.Label>
                                Phone Number{" "}
                                <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter Phone Number"
                                required
                            />
                        </Form.Group>

                        <Form.Group
                            className="mb-3"
                            controlId="productOfInterest"
                        >
                            <Form.Label>
                                Products Of Interest{" "}
                                <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Select
                                name="productOfInterest"
                                value={formData.productOfInterest}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select an option ...</option>
                                {products.map((product, index) => (
                                    <option key={index} value={product}>
                                        {product}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="otherProduct">
                            <Form.Label>
                                Other (Only Fill this if product isn't available
                                above)
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="otherProduct"
                                value={formData.otherProduct}
                                onChange={handleChange}
                                placeholder="Product of interest"
                            />
                        </Form.Group>

                        <div className="d-grid">
                            <Button
                                variant="danger"
                                type="submit"
                                size="lg"
                                className="mt-3"
                                disabled={submitting}
                                style={{
                                    backgroundColor: "#ff6b6b",
                                    borderColor: "#ff6b6b",
                                    padding: "12px",
                                }}
                            >
                                {submitting ? "Submitting..." : "Submit"}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default OutboundCallForm;
