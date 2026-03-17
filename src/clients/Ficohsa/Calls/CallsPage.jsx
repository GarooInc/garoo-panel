import { useState } from "react";
import { dataAgentInstance } from "../../../api/axios";

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
            await dataAgentInstance.post("/419bb751-1cc3-43d6-923b-c0b77e078802", {
                "First Name": formData.firstName, "Last Name": formData.lastName, Email: formData.email, "Phone Number": formData.phoneNumber, "Products Of Interest": formData.productOfInterest, "Other (Only Fill this if product isn't available above)": formData.otherProduct,
            });
            setSubmitStatus("success");
            setFormData({ firstName: "", lastName: "", email: "", phoneNumber: "", productOfInterest: "", otherProduct: "" });
        } catch (error) {
            setSubmitStatus("error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-container animate-in">
            <style>{`
                .ficohsa-header { margin-bottom: 3rem; text-align: center; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .form-group { margin-bottom: 1.5rem; }
                .form-label { display: block; font-size: 0.75rem; font-weight: 850; color: var(--text-muted); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; margin-left: 4px; }
                .form-input, .form-select { 
                    width: 100%; padding: 14px 18px; border: 2px solid #94a3b8; border-radius: 16px; 
                    background: #cbd5e1; font-size: 0.95rem; font-weight: 700; color: var(--text-main); transition: all 0.25s; outline: none;
                }
                .form-input:focus, .form-select:focus { border-color: var(--primary); background: white; box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.1); }
                
                .alert-pill { 
                    padding: 12px 20px; border-radius: 100px; margin-bottom: 2rem; 
                    font-size: 0.9rem; font-weight: 700; display: flex; align-items: center; gap: 12px;
                    border: 1px solid transparent; animation: slideDownFade 0.4s ease;
                }
                .alert-success { background: #dcfce7; color: #15803d; border-color: rgba(21,128,61,0.1); }
                .alert-error { background: #fef2f2; color: #dc2626; border-color: rgba(220,38,38,0.1); }

                @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
            `}</style>

            <div className="ficohsa-header">
                <h1 className="premium-title mb-2">Banco Ficohsa</h1>
                <p className="premium-subtitle">Registro centralizado para la gestión de prospectos y campañas de llamadas.</p>
            </div>

            <div className="glass-card p-4 p-md-5 mx-auto" style={{ maxWidth: '800px' }}>
                {submitStatus === "success" && (
                    <div className="alert-pill alert-success">
                        <i className="bi bi-check-circle-fill fs-5"></i> ¡El prospecto ha sido registrado exitosamente!
                    </div>
                )}
                {submitStatus === "error" && (
                    <div className="alert-pill alert-error">
                        <i className="bi bi-exclamation-circle-fill fs-5"></i> Hubo un error al procesar el envío. Revisa tu conexión.
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Nombre del Cliente</label>
                            <input className="form-input" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ej: Roberto" required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Apellido del Cliente</label>
                            <input className="form-input" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Ej: Gómez" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Dirección de Correo</label>
                        <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="cliente@ejemplo.com" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Número Telefónico</label>
                        <input className="form-input" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+504 9999-0000" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Servicio Bancario de Interés</label>
                        <select className="form-select" name="productOfInterest" value={formData.productOfInterest} onChange={handleChange} required>
                            <option value="">Selecciona una opción...</option>
                            {products.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>

                    {formData.productOfInterest === "Otro" && (
                        <div className="form-group animate-in">
                            <label className="form-label">Especificar Otro Producto</label>
                            <input className="form-input" name="otherProduct" value={formData.otherProduct} onChange={handleChange} placeholder="Describe el producto aquí..." required />
                        </div>
                    )}

                    <div className="mt-4 pt-2">
                        <button type="submit" className="btn-premium btn-premium-primary w-100 py-3 justify-content-center" disabled={submitting}>
                            {submitting ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span> Sincronizando...</>
                            ) : (
                                <><i className="bi bi-send-fill"></i> Registrar Información</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FicohsaCalls;
