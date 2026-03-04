import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import {
    formatDate,
    formatPeriod,
    formatExperienceDate,
    formatSalary,
} from "../utils/dateHelpers";
import {
    getFullName,
    getPosition,
    getNationality,
    getAvailability,
    getSalaryExpectation,
    getEmail,
    getPhone,
    getAddress,
    getCivilStatus,
    getBirthDate,
    getLinkedIn,
    getBehance,
    getCV,
    getPortfolio,
    getEducations,
    getExperiences,
    getAllReferences,
} from "../utils/workerDataHelpers";

const WorkerModal = ({ show, handleClose, workerData }) => {
    if (!workerData) return null;

    const educations = getEducations(workerData);
    const experiences = getExperiences(workerData);
    const allReferences = getAllReferences(workerData);

    const fullName = getFullName(workerData);
    const position = getPosition(workerData);

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            dialogClassName="modal-worker-dialog"
            contentClassName="border-0 rounded-4 shadow-lg overflow-hidden"
        >
            <Modal.Body className="p-0">
                <div className="row g-0 h-100">
                    {/* Left Sidebar - Profile Summary */}
                    <div
                        className="col-lg-4 border-end bg-light d-none d-lg-block"
                        style={{
                            backgroundColor: "var(--bg-light) !important",
                        }}
                    >
                        <div className="p-4 p-xl-5 text-center sticky-top">
                            <div className="position-relative d-inline-block mb-4">
                                {workerData.Fotografia ||
                                workerData.fotografia ||
                                workerData.foto ? (
                                    <Image
                                        src={
                                            workerData.Fotografia ||
                                            workerData.fotografia ||
                                            workerData.foto
                                        }
                                        roundedCircle
                                        className="shadow-sm border border-4 border-white"
                                        style={{
                                            width: "160px",
                                            height: "160px",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="bg-primary-subtle rounded-circle d-flex align-items-center justify-content-center mx-auto border border-4 border-white shadow-sm"
                                        style={{
                                            width: "160px",
                                            height: "160px",
                                            backgroundColor:
                                                "var(--primary-light)",
                                        }}
                                    >
                                        <i
                                            className="bi bi-person-fill text-primary"
                                            style={{ fontSize: "4.5rem" }}
                                        ></i>
                                    </div>
                                )}
                                <div
                                    className="position-absolute bottom-0 end-0 bg-success border border-3 border-white rounded-circle p-2 shadow-sm"
                                    title="Disponible"
                                ></div>
                            </div>

                            <h3
                                className="fw-bold text-dark mb-1"
                                style={{ letterSpacing: "-0.5px" }}
                            >
                                {fullName}
                            </h3>
                            <p className="text-secondary mb-4 fw-medium">
                                {position || "Perfil Profesional"}
                            </p>

                            <div className="d-flex justify-content-center gap-2 mb-4 pb-4 border-bottom">
                                {getLinkedIn(workerData) && (
                                    <a
                                        href={getLinkedIn(workerData)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-icon-social linkedin"
                                    >
                                        <i className="bi bi-linkedin"></i>
                                    </a>
                                )}
                                {getBehance(workerData) && (
                                    <a
                                        href={getBehance(workerData)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-icon-social dark"
                                    >
                                        <i className="bi bi-behance"></i>
                                    </a>
                                )}
                                {getCV(workerData) && (
                                    <a
                                        href={getCV(workerData)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-icon-social pdf"
                                        title="Ver CV"
                                    >
                                        <i className="bi bi-file-earmark-pdf"></i>
                                    </a>
                                )}
                            </div>

                            <div className="text-start mb-5">
                                <h6 className="text-uppercase smaller fw-bold text-secondary mb-3 tracking-widest">
                                    Contacto
                                </h6>
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="icon-box-small shadow-sm">
                                            <i className="bi bi-envelope"></i>
                                        </div>
                                        <div className="text-truncate">
                                            <p className="smaller text-secondary mb-0">
                                                Email
                                            </p>
                                            <a
                                                href={`mailto:${getEmail(workerData)}`}
                                                className="text-dark fw-medium text-decoration-none small"
                                            >
                                                {getEmail(workerData) || "N/A"}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="icon-box-small shadow-sm">
                                            <i className="bi bi-phone"></i>
                                        </div>
                                        <div>
                                            <p className="smaller text-secondary mb-0">
                                                Teléfono
                                            </p>
                                            <a
                                                href={`tel:${getPhone(workerData)}`}
                                                className="text-dark fw-medium text-decoration-none small"
                                            >
                                                {getPhone(workerData) || "N/A"}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="icon-box-small shadow-sm">
                                            <i className="bi bi-geo-alt"></i>
                                        </div>
                                        <div>
                                            <p className="smaller text-secondary mb-0">
                                                Ubicación
                                            </p>
                                            <p className="text-dark fw-medium small mb-0">
                                                {getAddress(workerData) ||
                                                    "No especificada"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-start">
                                <h6 className="text-uppercase smaller fw-bold text-secondary mb-3 tracking-widest">
                                    Perfil General
                                </h6>
                                <div className="bg-white p-3 rounded-4 border shadow-sm">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="smaller text-secondary">
                                            Nacionalidad
                                        </span>
                                        <span className="small fw-bold text-dark">
                                            {getNationality(workerData) ||
                                                "N/A"}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="smaller text-secondary">
                                            Estado Civil
                                        </span>
                                        <span className="small fw-bold text-dark">
                                            {getCivilStatus(workerData) ||
                                                "N/A"}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="smaller text-secondary">
                                            Aspiración
                                        </span>
                                        <span className="small fw-bold text-primary">
                                            {formatSalary(
                                                getSalaryExpectation(
                                                    workerData,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-start gap-2">
                                        <span className="smaller text-secondary flex-shrink-0">
                                            Disponibilidad
                                        </span>
                                        <span
                                            className="small fw-bold text-dark text-end"
                                            style={{ maxWidth: "60%" }}
                                        >
                                            {getAvailability(workerData) ||
                                                "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Detailed Info */}
                    <div
                        className="col-lg-8 bg-white d-flex flex-column"
                        style={{ minHeight: "80vh" }}
                    >
                        {/* Mobile Header (only visible on small screens) */}
                        <div className="d-lg-none p-4 border-bottom bg-light text-center">
                            <h4 className="fw-bold mb-1">{fullName}</h4>
                            <p className="text-secondary small mb-0">
                                {position}
                            </p>
                        </div>

                        <div className="p-4 p-xl-5 flex-grow-1">
                            {/* Experience Section */}
                            <section className="mb-5">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="icon-box-medium bg-primary-subtle text-primary">
                                        <i className="bi bi-briefcase"></i>
                                    </div>
                                    <h5 className="fw-bold mb-0">
                                        Experiencia Laboral
                                    </h5>
                                </div>
                                <div className="timeline ps-2">
                                    {experiences && experiences.length > 0 ? (
                                        experiences.map((exp, idx) => (
                                            <div
                                                key={`exp-${idx}`}
                                                className="timeline-item pb-4 border-start ps-4 position-relative"
                                            >
                                                <div className="timeline-dot"></div>
                                                <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
                                                    <h6 className="fw-bold text-dark mb-0">
                                                        {exp.position ||
                                                            "Puesto no especificado"}
                                                    </h6>
                                                    <span className="badge bg-light text-secondary fw-normal border">
                                                        {formatExperienceDate(
                                                            exp.startMonth,
                                                            exp.startYear,
                                                        )}{" "}
                                                        –{" "}
                                                        {exp.isCurrent
                                                            ? "Actualidad"
                                                            : formatExperienceDate(
                                                                  exp.endMonth,
                                                                  exp.endYear,
                                                              )}
                                                    </span>
                                                </div>
                                                <p className="text-primary fw-medium small mb-2">
                                                    {exp.company || "Empresa"}
                                                </p>
                                                <p className="text-secondary small mb-3">
                                                    {exp.performance ||
                                                        "Sin descripción detallada."}
                                                </p>
                                                <div
                                                    className="bg-light p-2 rounded-3 d-flex flex-wrap gap-3"
                                                    style={{
                                                        border: "1px solid #f1f5f9",
                                                    }}
                                                >
                                                    <div className="smaller">
                                                        <span className="text-secondary">
                                                            Jefe:
                                                        </span>{" "}
                                                        <span className="text-dark fw-medium">
                                                            {exp.boss || "N/A"}
                                                        </span>
                                                    </div>
                                                    <div className="smaller">
                                                        <span className="text-secondary">
                                                            Salario:
                                                        </span>{" "}
                                                        <span className="text-dark fw-medium">
                                                            {formatSalary(
                                                                exp.finalSalary,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="smaller">
                                                        <span className="text-secondary">
                                                            Motivo:
                                                        </span>{" "}
                                                        <span className="text-dark fw-medium">
                                                            {exp.leaveReason ||
                                                                "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted small ps-4">
                                            No hay experiencia laboral
                                            registrada.
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Education Section */}
                            <section className="mb-5">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="icon-box-medium bg-info-subtle text-info">
                                        <i className="bi bi-mortarboard"></i>
                                    </div>
                                    <h5 className="fw-bold mb-0">
                                        Formación Académica
                                    </h5>
                                </div>
                                <div className="timeline ps-2">
                                    {educations && educations.length > 0 ? (
                                        educations.map((edu, idx) => (
                                            <div
                                                key={`edu-${idx}`}
                                                className="timeline-item pb-4 border-start ps-4 position-relative"
                                            >
                                                <div className="timeline-dot bg-info"></div>
                                                <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
                                                    <h6 className="fw-bold text-dark mb-0">
                                                        {edu.title ||
                                                            "Título Académico"}
                                                    </h6>
                                                    <span className="badge bg-light text-secondary fw-normal border">
                                                        {formatPeriod(
                                                            edu.startPeriod,
                                                        )}{" "}
                                                        –{" "}
                                                        {formatPeriod(
                                                            edu.endPeriod,
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-info fw-medium small mb-1">
                                                    {edu.institution ||
                                                        "Universidad / Instituto"}
                                                </p>
                                                <p className="text-secondary smaller mb-0">
                                                    Nivel Academicó:{" "}
                                                    <span className="text-dark fw-medium">
                                                        {edu.level || "N/A"}
                                                    </span>
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted small ps-4">
                                            No hay formación académica
                                            registrada.
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* References Section */}
                            <section>
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="icon-box-medium bg-warning-subtle text-warning">
                                        <i className="bi bi-people"></i>
                                    </div>
                                    <h5 className="fw-bold mb-0">
                                        Referencias
                                    </h5>
                                </div>
                                <div className="row g-3">
                                    {/* Work References */}
                                    <div className="col-md-6">
                                        <h6 className="text-uppercase smaller fw-bold text-secondary mb-3 tracking-widest ps-1">
                                            Laborales
                                        </h6>
                                        {allReferences.work &&
                                        allReferences.work.length > 0 ? (
                                            <div className="d-flex flex-column gap-3">
                                                {allReferences.work.map(
                                                    (ref, idx) => (
                                                        <div
                                                            key={`wref-${idx}`}
                                                            className="p-3 bg-light rounded-4 border border-dashed shadow-sm"
                                                        >
                                                            <p className="fw-bold text-dark small mb-1">
                                                                {ref.name ||
                                                                    "Referencia"}
                                                            </p>
                                                            <p className="smaller text-secondary mb-2">
                                                                {ref.position ||
                                                                    "Puesto"}
                                                            </p>
                                                            <div className="d-flex align-items-center gap-2 smaller text-break">
                                                                <i className="bi bi-phone text-secondary"></i>
                                                                <span className="text-dark fw-medium">
                                                                    {ref.phone ||
                                                                        "N/A"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-muted smaller ps-1">
                                                Sin referencias laborales.
                                            </div>
                                        )}
                                    </div>
                                    {/* Personal References */}
                                    <div className="col-md-6">
                                        <h6 className="text-uppercase smaller fw-bold text-secondary mb-3 tracking-widest ps-1">
                                            Personales
                                        </h6>
                                        {allReferences.personal &&
                                        allReferences.personal.length > 0 ? (
                                            <div className="d-flex flex-column gap-3">
                                                {allReferences.personal.map(
                                                    (ref, idx) => (
                                                        <div
                                                            key={`pref-${idx}`}
                                                            className="p-3 bg-light rounded-4 border border-dashed shadow-sm"
                                                        >
                                                            <p className="fw-bold text-dark small mb-1 text-break">
                                                                {ref.name ||
                                                                    "Referencia"}
                                                            </p>
                                                            <p className="smaller text-secondary mb-2 text-break">
                                                                {ref.relation ||
                                                                    "Relación"}
                                                            </p>
                                                            <div className="d-flex align-items-center gap-2 smaller text-break">
                                                                <i className="bi bi-phone text-secondary"></i>
                                                                <span className="text-dark fw-medium">
                                                                    {ref.phone ||
                                                                        "N/A"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-muted smaller ps-1">
                                                Sin referencias personales.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer in right side column */}
                        <div
                            className="px-5 py-4 border-top d-flex align-items-center justify-content-between bg-light sticky-bottom mt-auto"
                            style={{
                                backgroundColor: "var(--bg-light) !important",
                            }}
                        >
                            <button
                                className="btn btn-dark px-4 py-2 rounded-3 fw-bold small"
                                onClick={handleClose}
                            >
                                <i className="bi bi-x-lg me-2"></i>Cerrar
                            </button>
                            <span className="smaller text-secondary fw-semibold">
                                Actualizado:{" "}
                                <span className="text-dark">
                                    {formatDate(
                                        workerData.fecha || workerData.Fecha,
                                    ) || "Recientemente"}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </Modal.Body>

            <style>{`
                .modal-worker-dialog {
                    margin-top: 100px;
                    margin-bottom: 50px;
                }
                .tracking-widest { letter-spacing: 0.1em; }
                .smaller { font-size: 0.75rem; }
                .icon-box-small {
                    width: 32px;
                    height: 32px;
                    background: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--primary-color);
                    font-size: 0.9rem;
                    border: 1px solid #f1f5f9;
                }
                .icon-box-medium {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                }
                .btn-icon-social {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                    transition: all 0.2s;
                }
                .btn-icon-social:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
                .btn-icon-social.linkedin:hover { color: #0077b5; background: #eef2f8; border-color: #0077b5; }
                .btn-icon-social.dark:hover { color: #1e293b; background: #f8fafc; border-color: #1e293b; }
                .btn-icon-social.pdf:hover { color: #dc2626; background: #fef2f2; border-color: #dc2626; }
                
                .timeline-item { border-left: 2px solid #e2e8f0; }
                .timeline-dot {
                    position: absolute;
                    left: -6.4px;
                    top: 0;
                    width: 11px;
                    height: 11px;
                    background: var(--primary-color);
                    border-radius: 50%;
                    border: 2px solid white;
                    box-shadow: 0 0 0 3px #f1f5f9;
                }
                .timeline-dot.bg-info { background: #0ea5e9; }
                .border-dashed { border-style: dashed !important; }
                
                @media (max-width: 991.98px) {
                    .modal-worker-dialog { margin-top: 60px; }
                    .col-lg-4 { border-bottom: 1px solid #e2e8f0; border-end: none !important; }
                }
            `}</style>
        </Modal>
    );
};

export default WorkerModal;
