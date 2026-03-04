import { useState } from "react";
import axios from "axios";
import garooLogo from "../assets/img/garoo-logo.png";

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
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'

    const products = [
        "Savings Account",
        "Credit Card",
        "Loan",
        "Insurance",
        "Other",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus(null);

        try {
            await axios.post(
                "https://agents.redtec.ai/webhook/419bb751-1cc3-43d6-923b-c0b77e078802",
                {
                    "First Name": formData.firstName,
                    "Last Name": formData.lastName,
                    Email: formData.email,
                    "Phone Number": formData.phoneNumber,
                    "Products Of Interest": formData.productOfInterest,
                    "Other (Only Fill this if product isn't available above)":
                        formData.otherProduct,
                },
                { headers: { "Content-Type": "application/json" } },
            );

            setSubmitStatus("success");
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
            setSubmitStatus("error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

                .ocf-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem 1rem;
                    font-family: 'Inter', system-ui, sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                /* Background orbs */
                .ocf-page::before {
                    content: '';
                    position: absolute;
                    top: -20%;
                    right: -10%;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%);
                    filter: blur(60px);
                    pointer-events: none;
                }

                .ocf-page::after {
                    content: '';
                    position: absolute;
                    bottom: -20%;
                    left: -10%;
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);
                    filter: blur(60px);
                    pointer-events: none;
                }

                .ocf-card {
                    background: rgba(255,255,255,0.035);
                    border: 1px solid rgba(255,255,255,0.09);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 24px;
                    padding: 2.75rem 2.5rem;
                    width: 100%;
                    max-width: 540px;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05);
                    position: relative;
                    z-index: 1;
                }

                /* Header */
                .ocf-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    margin-bottom: 2.25rem;
                }

                .ocf-logo-ring {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05));
                    border: 1.5px solid rgba(245,158,11,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 1.25rem;
                    box-shadow: 0 0 30px rgba(245,158,11,0.15);
                }

                .ocf-logo-ring img {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .ocf-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(245,158,11,0.12);
                    border: 1px solid rgba(245,158,11,0.25);
                    color: #fbbf24;
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    padding: 4px 12px;
                    border-radius: 100px;
                    margin-bottom: 0.85rem;
                }

                .ocf-badge::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #f59e0b;
                    box-shadow: 0 0 6px #f59e0b;
                    animation: pulse-dot 2s ease-in-out infinite;
                }

                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }

                .ocf-title {
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: #f8fafc;
                    margin: 0 0 0.4rem;
                    letter-spacing: -0.03em;
                }

                .ocf-subtitle {
                    color: #94a3b8;
                    font-size: 0.92rem;
                    margin: 0;
                }

                /* Form fields */
                .ocf-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .ocf-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.45rem;
                    margin-bottom: 1rem;
                }

                .ocf-label {
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: #cbd5e1;
                    letter-spacing: 0.01em;
                }

                .ocf-label .req {
                    color: #f59e0b;
                    margin-left: 2px;
                }

                .ocf-input,
                .ocf-select {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    padding: 0.65rem 0.9rem;
                    font-size: 0.9rem;
                    color: #f1f5f9;
                    font-family: inherit;
                    transition: all 0.2s ease;
                    outline: none;
                    width: 100%;
                    box-sizing: border-box;
                    -webkit-appearance: none;
                }

                .ocf-input::placeholder {
                    color: #475569;
                }

                .ocf-input:focus,
                .ocf-select:focus {
                    border-color: rgba(245,158,11,0.5);
                    background: rgba(245,158,11,0.05);
                    box-shadow: 0 0 0 3px rgba(245,158,11,0.1);
                }

                .ocf-select {
                    cursor: pointer;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 0.9rem center;
                    padding-right: 2.5rem;
                }

                .ocf-select option {
                    background: #1e293b;
                    color: #f1f5f9;
                }

                /* Submit button */
                .ocf-btn {
                    width: 100%;
                    padding: 0.8rem 1.5rem;
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    border: none;
                    border-radius: 12px;
                    color: #0f172a;
                    font-size: 0.95rem;
                    font-weight: 700;
                    font-family: inherit;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6rem;
                    margin-top: 0.5rem;
                    box-shadow: 0 4px 15px rgba(245,158,11,0.3);
                    letter-spacing: 0.01em;
                }

                .ocf-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(245,158,11,0.4);
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                }

                .ocf-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .ocf-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Spinner */
                .ocf-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(15,23,42,0.3);
                    border-top-color: #0f172a;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                    flex-shrink: 0;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Alerts */
                .ocf-alert {
                    border-radius: 12px;
                    padding: 0.9rem 1.1rem;
                    font-size: 0.87rem;
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid;
                }

                .ocf-alert-success {
                    background: rgba(16,185,129,0.1);
                    border-color: rgba(16,185,129,0.25);
                    color: #6ee7b7;
                }

                .ocf-alert-error {
                    background: rgba(239,68,68,0.1);
                    border-color: rgba(239,68,68,0.25);
                    color: #fca5a5;
                }

                .ocf-alert-icon {
                    font-size: 1.1rem;
                    flex-shrink: 0;
                    margin-top: 1px;
                }

                /* Divider */
                .ocf-divider {
                    height: 1px;
                    background: rgba(255,255,255,0.07);
                    margin: 1.25rem 0;
                }

                /* Footer note */
                .ocf-footer-note {
                    text-align: center;
                    color: #475569;
                    font-size: 0.75rem;
                    margin-top: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.4rem;
                }

                @media (max-width: 480px) {
                    .ocf-card {
                        padding: 2rem 1.5rem;
                        border-radius: 20px;
                    }
                    .ocf-grid-2 {
                        grid-template-columns: 1fr;
                    }
                    .ocf-title {
                        font-size: 1.5rem;
                    }
                }
            `}</style>

            <div className="ocf-page">
                <div className="ocf-card">
                    {/* Header */}
                    <div className="ocf-header">
                        <div className="ocf-logo-ring">
                            <img src={garooLogo} alt="Garoo Servicios" />
                        </div>
                        <span className="ocf-badge">
                            Formulario de Llamadas
                        </span>
                        <h1 className="ocf-title">Banco Ficohsa</h1>
                        <p className="ocf-subtitle">
                            Completa el formulario y te contactaremos pronto
                        </p>
                    </div>

                    {/* Alerts */}
                    {submitStatus === "success" && (
                        <div className="ocf-alert ocf-alert-success">
                            <i className="bi bi-check-circle-fill ocf-alert-icon"></i>
                            <span>
                                ¡Formulario enviado exitosamente! Nos pondremos
                                en contacto contigo pronto.
                            </span>
                        </div>
                    )}
                    {submitStatus === "error" && (
                        <div className="ocf-alert ocf-alert-error">
                            <i className="bi bi-exclamation-circle-fill ocf-alert-icon"></i>
                            <span>
                                Hubo un error al enviar. Por favor, inténtalo de
                                nuevo más tarde.
                            </span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Nombre y Apellido en grid */}
                        <div className="ocf-grid-2">
                            <div className="ocf-group">
                                <label
                                    className="ocf-label"
                                    htmlFor="firstName"
                                >
                                    Nombre <span className="req">*</span>
                                </label>
                                <input
                                    id="firstName"
                                    className="ocf-input"
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div className="ocf-group">
                                <label className="ocf-label" htmlFor="lastName">
                                    Apellido <span className="req">*</span>
                                </label>
                                <input
                                    id="lastName"
                                    className="ocf-input"
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="ocf-group">
                            <label className="ocf-label" htmlFor="email">
                                Correo electrónico{" "}
                                <span className="req">*</span>
                            </label>
                            <input
                                id="email"
                                className="ocf-input"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>

                        <div className="ocf-group">
                            <label className="ocf-label" htmlFor="phoneNumber">
                                Número de teléfono{" "}
                                <span className="req">*</span>
                            </label>
                            <input
                                id="phoneNumber"
                                className="ocf-input"
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+504 0000-0000"
                                required
                            />
                        </div>

                        <div className="ocf-group">
                            <label
                                className="ocf-label"
                                htmlFor="productOfInterest"
                            >
                                Producto de interés{" "}
                                <span className="req">*</span>
                            </label>
                            <select
                                id="productOfInterest"
                                className="ocf-select"
                                name="productOfInterest"
                                value={formData.productOfInterest}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Selecciona una opción...
                                </option>
                                {products.map((product, index) => (
                                    <option key={index} value={product}>
                                        {product}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="ocf-divider"></div>

                        <div className="ocf-group">
                            <label className="ocf-label" htmlFor="otherProduct">
                                Otro producto
                                <span
                                    style={{
                                        color: "#475569",
                                        fontWeight: 400,
                                        marginLeft: "6px",
                                    }}
                                >
                                    (solo si no está en la lista)
                                </span>
                            </label>
                            <input
                                id="otherProduct"
                                className="ocf-input"
                                type="text"
                                name="otherProduct"
                                value={formData.otherProduct}
                                onChange={handleChange}
                                placeholder="Describe el producto..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="ocf-btn"
                            disabled={submitting}
                            id="submit-outbound-form"
                        >
                            {submitting ? (
                                <>
                                    <span className="ocf-spinner"></span>
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-send-fill"></i>
                                    Enviar formulario
                                </>
                            )}
                        </button>
                    </form>

                    <p className="ocf-footer-note">
                        <i className="bi bi-lock-fill"></i>
                        Tus datos están protegidos y no serán compartidos con
                        terceros
                    </p>
                </div>
            </div>
        </>
    );
};

export default OutboundCallForm;
