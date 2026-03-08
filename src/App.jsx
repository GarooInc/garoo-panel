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
} from "react-router-dom";

import { ApplicationsProvider } from "./config/ApplicationsProvider";
import { FormProvider } from "./config/FormProvider.jsx";
// ── Client pages ──────────────────────────────────────────────────────────────
import RocknRollaApplications from "./pages/clients/RocknRolla/ApplicationsPage.jsx";
import MundoVerdeInvoices from "./pages/clients/MundoVerde/InvoicesPage.jsx";
import FicohsaCalls from "./pages/clients/Ficohsa/CallsPage.jsx";
import SpectrumLeads from "./pages/clients/Spectrum/LeadsPage.jsx";
import PepsiVideoAnalysis from "./pages/clients/Pepsi/VideoAnalysisPage.jsx";
// ── Garoo services ─────────────────────────────────────────────────────────────
import AgentOnboarding from "./pages/services/GarooAgent/AgentOnboardingPage.jsx";
import Services from "./pages/Services.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import Sidebar from "./components/Layout/Sidebar.jsx";
import Header from "./components/Layout/Header.jsx";

function App() {
    return (
        <Router>
            <ApplicationsProvider>
                <FormProvider>
                    <AppContent />
                </FormProvider>
            </ApplicationsProvider>
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const hideLayoutRoutes = [
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
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/services" element={<Services />} />
                        <Route
                            path="/applications"
                            element={<RocknRollaApplications />}
                        />
                        <Route path="/form" element={<MundoVerdeInvoices />} />
                        <Route
                            path="/outbound-call-form"
                            element={<FicohsaCalls />}
                        />
                        <Route
                            path="/spectrum-leads"
                            element={<SpectrumLeads />}
                        />
                        <Route
                            path="/video-analysis"
                            element={<PepsiVideoAnalysis />}
                        />
                        <Route
                            path="/agent-onboarding"
                            element={<AgentOnboarding />}
                        />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </main>
            </div>
        </>
    );
}

export default App;
