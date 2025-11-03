import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";

import { ApplicationsProvider } from "./config/ApplicationsProvider";
import { FormProvider } from "./config/FormProvider.jsx";
import { DataAgentProvider } from "./config/DataAgentProvider.jsx";

import Gallery from "./pages/Gallery.jsx";
import Form from "./pages/Form.jsx";
import Applications from "./pages/Applications.jsx";
import Services from "./pages/Services.jsx";
import MainPage from "./pages/Data Agent/MainPage.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import Sidebar from "./components/Layout/Sidebar.jsx";
import Header from "./components/Layout/Header.jsx";

import ComingSoon from "./pages/ComingSoon.jsx";
import OutboundCallForm from "./pages/OutboundCallForm.jsx";

function App() {
    return (
        <Router>
            <ApplicationsProvider>
                <FormProvider>
                    <DataAgentProvider>
                        <AppContent />
                    </DataAgentProvider>
                </FormProvider>
            </ApplicationsProvider>
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const hideLayoutRoutes = ['/outbound-call-form'];
    const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

    return (
        <>
            {!shouldHideLayout && <Header />}
            <div className="app-container">
                {!shouldHideLayout && <Sidebar />}
                <main className="content p-5 w-100">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/services" element={<Services />} />
                        <Route
                            path="/applications"
                            element={<Applications />}
                        />
                        <Route path="/form" element={<Form />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/data-agent" element={<MainPage />} />
                        <Route
                            path="/outbound-call-form"
                            element={<OutboundCallForm />}
                        />
                        <Route path="/ai-tools" element={<ComingSoon />} />
                        <Route path="/bot" element={<ComingSoon />} />
                        <Route path="/coming-soon" element={<ComingSoon />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </main>
            </div>
        </>
    );
}

export default App;
