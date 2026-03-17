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
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                }

                .login-page::before {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at 100% 0%, rgba(37, 99, 235, 0.05) 0%, transparent 40%),
                                radial-gradient(circle at 0% 100%, rgba(37, 99, 235, 0.04) 0%, transparent 40%);
                    pointer-events: none;
                }

                .login-card-premium {
                    width: 100%;
                    max-width: 440px;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    border-radius: 32px;
                    padding: 3rem 2.5rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    z-index: 10;
                    position: relative;
                    animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .login-logo-ring {
                    width: 72px;
                    height: 72px;
                    background: white;
                    border: 1px solid #f1f5f9;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 2.5rem;
                    padding: 10px;
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
                }

                .login-logo-ring img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .login-header-group { text-align: center; margin-bottom: 3rem; }
                .login-header-group h1 { font-size: 2rem; font-weight: 950; color: #0f172a; margin-bottom: 0.5rem; letter-spacing: -0.04em; }
                .login-header-group p { color: #64748b; font-size: 1rem; font-weight: 500; }

                .form-control-premium {
                    width: 100%;
                    background: #f8fafc;
                    border: 2px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 14px 20px;
                    color: #0f172a;
                    font-size: 0.95rem;
                    font-weight: 600;
                    transition: all 0.25s;
                    outline: none;
                }

                .form-control-premium:focus {
                    border-color: #2563eb;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.06);
                }

                .login-btn-premium {
                    width: 100%;
                    padding: 16px;
                    background: #2563eb;
                    border: none;
                    border-radius: 16px;
                    color: #fff;
                    font-size: 1.05rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    margin-top: 1rem;
                    box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.3);
                }

                .login-btn-premium:hover:not(:disabled) {
                    background: #1d4ed8;
                    transform: translateY(-2px);
                    box-shadow: 0 20px 25px -5px rgba(37, 99, 235, 0.4);
                }

                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="login-card-premium">
                <div className="login-logo-ring">
                    <img src={garooLogo} alt="Garoo" />
                </div>
                
                <div className="login-header-group">
                    <h1>Portal Garoo</h1>
                    <p>Gestiona tu operación inteligente</p>
                </div>

                {error && <div className="alert-pill alert-error mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label ms-1" style={{ fontSize: '0.75rem', fontWeight: 850, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Email Corporativo</label>
                        <input 
                            type="email" 
                            className="form-control-premium" 
                            placeholder="usuario@redtec.ai"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label className="form-label ms-1" style={{ fontSize: '0.75rem', fontWeight: 850, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control-premium" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-btn-premium"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span> Autenticando...</>
                        ) : "Entrar al Portal"}
                    </button>
                    
                    <div className="text-center mt-5">
                        <p className="small text-muted mb-0 fw-600">Copyright © 2026 Redtec Intelligence</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
