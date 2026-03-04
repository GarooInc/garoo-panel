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
import Form from "./pages/Form.jsx";
import Applications from "./pages/Applications.jsx";
import SpectrumLeads from "./pages/SpectrumLeads.jsx";
import Services from "./pages/Services.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import Sidebar from "./components/Layout/Sidebar.jsx";
import Header from "./components/Layout/Header.jsx";

import OutboundCallForm from "./pages/OutboundCallForm.jsx";

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
                            element={<Applications />}
                        />
                        <Route path="/form" element={<Form />} />
                        <Route
                            path="/outbound-call-form"
                            element={<OutboundCallForm />}
                        />
                        <Route
                            path="/spectrum-leads"
                            element={<SpectrumLeads />}
                        />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </main>
            </div>
        </>
    );
}

export default App;
