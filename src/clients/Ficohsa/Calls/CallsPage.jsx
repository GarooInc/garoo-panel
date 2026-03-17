import React, { useState } from "react";
import { redtecInstance } from "../../../api/axios";

const FicohsaCalls = () => {
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phoneNumber: "", productOfInterest: "", otherProduct: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const products = ["Cuenta de Ahorros", "Tarjeta de Crédito", "Préstamo", "Seguro", "Otro"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus(null);
        try {
            await redtecInstance.post("/form-call", {
                "Nombre": formData.firstName,
                "Apellido": formData.lastName,
                "Correo electrónico": formData.email,
                "Número de teléfono": formData.phoneNumber,
                "Producto de interés": formData.productOfInterest,
                "Otro producto": formData.otherProduct,
            }, { isPublic: true });
            setSubmitStatus("success");
            setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "", productOfInterest: "", otherProduct: "" });
        } catch (error) {
            void error;
            setSubmitStatus("error");
        } finally {
            setSubmitting(false);
        }
    };    return (
        <div className="public-form-wrapper animate-in">
            <style>{`
                .public-form-wrapper {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1.5rem;
                    background: #1a2332; /* Deep Navy Dark Mode */
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                }
                .ficohsa-container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .ficohsa-header { 
                    margin-bottom: 2.5rem; 
                    text-align: center; 
                }

                .badge-v2 {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 16px;
                    background: rgba(255, 215, 0, 0.05); /* Subtle gold tint */
                    border: 1px solid rgba(255, 215, 0, 0.3);
                    border-radius: 100px;
                    color: #fbbf24;
                    font-size: 0.65rem;
                    font-weight: 950;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 1.5rem;
                }
                .badge-v2::before {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background: #fbbf24;
                    border-radius: 50%;
                }

                .premium-title-v3 {
                    font-size: 2.8rem;
                    font-weight: 950;
                    color: #fff;
                    letter-spacing: -1.5px;
                    margin-bottom: 0.75rem;
                }

                .premium-subtitle-v3 {
                    font-size: 1rem;
                    font-weight: 500;
                    color: #94a3b8;
                    margin-bottom: 3rem;
                }

                .form-grid-v3 { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 1.25rem; 
                }

                .form-group-v3 { 
                    margin-bottom: 1.5rem; 
                }

                .form-label-v3 { 
                    display: block; 
                    font-size: 0.85rem; 
                    font-weight: 700; 
                    color: #e2e8f0; 
                    margin-bottom: 0.75rem; 
                }
                .form-label-v3 .asterisk { color: #fbbf24; font-weight: 950; margin-left: 4px; }
                .form-label-v3 .sub-text { font-size: 0.75rem; color: #64748b; font-weight: 500; margin-left: 6px; }

                .form-input-v3, .form-select-v3 { 
                    width: 100%; 
                    padding: 14px 20px; 
                    border: 1px solid rgba(255, 255, 255, 0.1); 
                    border-radius: 12px; 
                    background: rgba(255, 255, 255, 0.05); 
                    font-size: 1rem; 
                    font-weight: 500; 
                    color: #fff; 
                    transition: 0.3s; 
                    outline: none;
                }
                .form-input-v3::placeholder { color: #475569; }

                .form-input-v3:focus, .form-select-v3:focus { 
                    border-color: #fbbf24; 
                    background: rgba(255, 255, 255, 0.08); 
                }

                .btn-submit-v3 {
                    background: #fff;
                    color: #1a2332;
                    border: none;
                    border-radius: 12px;
                    width: 100%;
                    padding: 16px;
                    font-size: 1rem;
                    font-weight: 950;
                    margin-top: 1rem;
                    transition: 0.3s;
                    cursor: pointer;
                }
                .btn-submit-v3:hover:not(:disabled) {
                    background: #fbbf24;
                    transform: translateY(-2px);
                }

                .status-toast-v3 {
                    padding: 1rem;
                    border-radius: 12px;
                    margin-bottom: 2rem;
                    text-align: center;
                    font-weight: 700;
                }
                .status-success { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
                .status-error { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }

                @media (max-width: 600px) { 
                    .form-grid-v3 { grid-template-columns: 1fr; }
                    .premium-title-v3 { font-size: 2.2rem; }
                }
            `}</style>

            <div className="ficohsa-container">
                <div className="ficohsa-header">
                    <div className="badge-v2">Formulario de Llamadas</div>
                    <h1 className="premium-title-v3">Banco Ficohsa</h1>
                    <p className="premium-subtitle-v3">Completa el formulario y te contactaremos pronto</p>
                </div>

                {submitStatus === "success" && (
                    <div className="status-toast-v3 status-success">
                        ¡Registro exitoso! Te contactaremos pronto.
                    </div>
                )}
                {submitStatus === "error" && (
                    <div className="status-toast-v3 status-error">
                        Error al enviar. Intenta de nuevo.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid-v3">
                        <div className="form-group-v3">
                            <label className="form-label-v3">Nombre<span className="asterisk">*</span></label>
                            <input className="form-input-v3" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Juan" required />
                        </div>
                        <div className="form-group-v3">
                            <label className="form-label-v3">Apellido<span className="asterisk">*</span></label>
                            <input className="form-input-v3" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Pérez" required />
                        </div>
                    </div>

                    <div className="form-group-v3">
                        <label className="form-label-v3">Correo electrónico<span className="asterisk">*</span></label>
                        <input className="form-input-v3" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com" required />
                    </div>

                    <div className="form-group-v3">
                        <label className="form-label-v3">Número de teléfono<span className="asterisk">*</span></label>
                        <input className="form-input-v3" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+504 0000-0000" required />
                    </div>

                    <div className="form-group-v3">
                        <label className="form-label-v3">Producto de interés<span className="asterisk">*</span></label>
                        <select className="form-select-v3" name="productOfInterest" value={formData.productOfInterest} onChange={handleChange} required>
                            <option value="">Selecciona una opción...</option>
                            {products.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    <div className="form-group-v3">
                        <label className="form-label-v3">Otro producto <span className="sub-text">(solo si no está en la lista)</span></label>
                        <input className="form-input-v3" name="otherProduct" value={formData.otherProduct} onChange={handleChange} placeholder="Describe el producto..." required={formData.productOfInterest === "Otro"} />
                    </div>

                    <button type="submit" className="btn-submit-v3" disabled={submitting}>
                        {submitting ? "Enviando..." : "Registrar Información"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FicohsaCalls;
