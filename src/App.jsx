import "./App.css";
import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
    Route,
    BrowserRouter as Router,
    Routes,
    useLocation,
    Navigate,
} from "react-router-dom";

import { ApplicationsProvider } from "./clients/RocknRolla/Applications/context/ApplicationsProvider";
import { FormProvider } from "./context/FormProvider.jsx";
// ── Client pages ──────────────────────────────────────────────────────────────
import RocknRollaApplications from "./clients/RocknRolla/Applications/ApplicationsPage.jsx";
import MundoVerdeInvoices from "./clients/MundoVerde/Invoices/InvoicesPage.jsx";
import FicohsaCalls from "./clients/Ficohsa/Calls/CallsPage.jsx";
import SpectrumLeads from "./clients/Spectrum/Leads/LeadsPage.jsx";
import PepsiVideoAnalysis from "./clients/Pepsi/VideoAnalysis/VideoAnalysisPage.jsx";
// ── Garoo services ─────────────────────────────────────────────────────────────
import AgentOnboarding from "./Garoo/AgentOnboarding/AgentOnboardingPage.jsx";
import Services from "./pages/Services.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import Sidebar from "./components/Layout/Sidebar.jsx";
import Header from "./components/Layout/Header.jsx";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <Router>
            <AuthProvider>
                <ApplicationsProvider>
                    <FormProvider>
                        <AppContent />
                    </FormProvider>
                </ApplicationsProvider>
            </AuthProvider>
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const hideLayoutRoutes = [
        "/login",
        "/outbound-call-form",
        "/form",
        "/applications",
        "/spectrum-leads",
        "/video-analysis",
        "/agent-onboarding",
    ];
    const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <>
            {!shouldHideLayout && <Header onToggleSidebar={toggleSidebar} />}
            <div className={shouldHideLayout ? "" : "app-container"}>
                {!shouldHideLayout && (
                    <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
                )}
                <main className={shouldHideLayout ? "" : "content"}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute serviceId="dashboard">
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/services"
                            element={
                                <ProtectedRoute serviceId="services">
                                    <Services />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/applications"
                            element={
                                <ProtectedRoute serviceId="applications">
                                    <RocknRollaApplications />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/form"
                            element={
                                <ProtectedRoute serviceId="form">
                                    <MundoVerdeInvoices />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/outbound-call-form"
                            element={
                                <ProtectedRoute serviceId="outbound-call-form">
                                    <FicohsaCalls />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/spectrum-leads"
                            element={
                                <ProtectedRoute serviceId="spectrum-leads">
                                    <SpectrumLeads />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/video-analysis"
                            element={
                                <ProtectedRoute serviceId="video-analysis">
                                    <PepsiVideoAnalysis />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/agent-onboarding"
                            element={
                                <ProtectedRoute serviceId="agent-onboarding">
                                    <AgentOnboarding />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </>
    );
}

export default App;
