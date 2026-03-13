import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import garooLogo from "../assets/img/garoo-logo.png";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <style>{`
                .login-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f8fafc;
                    font-family: 'Inter', sans-serif;
                    padding: 20px;
                    position: relative;
                    overflow: hidden;
                }

                .login-page::before {
                    content: '';
                    position: absolute;
                    width: 700px;
                    height: 700px;
                    background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
                    top: -200px;
                    right: -200px;
                    filter: blur(100px);
                }

                .login-page::after {
                    content: '';
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%);
                    bottom: -150px;
                    left: -150px;
                    filter: blur(100px);
                }

                .login-card {
                    width: 100%;
                    max-width: 420px;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 28px;
                    padding: 48px 40px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
                    z-index: 10;
                    position: relative;
                }

                .login-logo {
                    width: 80px;
                    height: 80px;
                    background: #f0f7ff;
                    border: 2.5px solid #dbeafe;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 32px;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
                }

                .login-logo img {
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .login-header {
                    text-align: center;
                    margin-bottom: 36px;
                }

                .login-header h1 {
                    color: #0f172a;
                    font-size: 1.85rem;
                    font-weight: 800;
                    margin-bottom: 8px;
                    letter-spacing: -0.03em;
                }

                .login-header p {
                    color: #64748b;
                    font-size: 0.95rem;
                    font-weight: 500;
                }

                .form-group {
                    margin-bottom: 24px;
                }

                .form-label {
                    display: block;
                    color: #475569;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 10px;
                    margin-left: 2px;
                }

                .form-input {
                    width: 100%;
                    background: #f8fafc;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 14px;
                    padding: 14px 18px;
                    color: #0f172a;
                    font-size: 0.95rem;
                    transition: all 0.25s ease;
                    outline: none;
                }

                .form-input::placeholder { color: #94a3b8; }

                .form-input:focus {
                    border-color: #2563eb;
                    background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }

                .login-btn {
                    width: 100%;
                    padding: 16px;
                    background: #2563eb;
                    border: none;
                    border-radius: 14px;
                    color: #fff;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-top: 12px;
                    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
                }

                .login-btn:hover:not(:disabled) {
                    background: #1d4ed8;
                    transform: translateY(-2px);
                    box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.4);
                }

                .login-btn:active:not(:disabled) { transform: translateY(0); }

                .login-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .error-alert {
                    background: #fef2f2;
                    border: 1px solid #fee2e2;
                    color: #dc2626;
                    padding: 14px;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    margin-bottom: 24px;
                    text-align: center;
                    font-weight: 500;
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 2.5px solid rgba(255, 255, 255, 0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 10px;
                }

                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            <div className="login-card">
                <div className="login-logo">
                    <img src={garooLogo} alt="Garoo" />
                </div>
                
                <div className="login-header">
                    <h1>Portal Garoo</h1>
                    <p>Inicia sesión con tus credenciales</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="form-input" 
                            placeholder="nombre@garoo.ai"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <><span className="spinner"></span> Validando...</>
                        ) : "Entrar al Portal"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
