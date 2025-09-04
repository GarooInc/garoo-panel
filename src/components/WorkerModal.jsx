import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { formatDate, formatPeriod, formatExperienceDate, formatSalary } from '../utils/dateHelpers';
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
    getAllReferences
} from '../utils/workerDataHelpers';

const WorkerModal = ({ show, handleClose, workerData }) => {
    if (!workerData) return null;

    // Get structured data using imported utilities (arrays)
    const educations = getEducations(workerData);
    const experiences = getExperiences(workerData);
    const allReferences = getAllReferences(workerData);

    return (
        <Modal
            show={show}
            onHide={handleClose}
            animation={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable
        // className="modal-xl"
        >
            <Modal.Header closeButton className="bg-light">
                <Modal.Title className="fs-5">
                    {getFullName(workerData) || 'Detalles del Trabajador'}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-0">
                <div className="row g-0">
                    {/* Columna izquierda */}
                    <div className="col-md-4 bg-light p-4">
                        <div className="text-center mb-4">
                            {(workerData.Fotografia || workerData.fotografia || workerData.foto) ? (
                                <Image
                                    src={workerData.Fotografia || workerData.fotografia || workerData.foto}
                                    roundedCircle
                                    className="img-thumbnail"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            ) : (
                                <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto"
                                    style={{ width: '150px', height: '150px' }}>
                                    <i className="bi bi-person-fill text-muted" style={{ fontSize: '4rem' }}></i>
                                </div>
                            )}

                            <h4 className="mt-3 mb-0">{getFullName(workerData)}</h4>
                            <p className="text-muted">{getPosition(workerData) || 'Sin puesto especificado'}</p>

                            <div className="d-flex justify-content-center gap-2 mb-3">
                                {getLinkedIn(workerData) && (
                                    <a href={getLinkedIn(workerData)} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                                        <i className="bi bi-linkedin me-1"></i> LinkedIn
                                    </a>
                                )}
                                {getBehance(workerData) && (
                                    <a href={getBehance(workerData)} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark btn-sm">
                                        <i className="bi bi-behance me-1"></i> Behance
                                    </a>
                                )}
                            </div>

                            <div className="bg-white p-3 rounded-3 shadow-sm">
                                <h6 className="text-center mb-3">Información de Contacto</h6>
                                <p className="mb-1">
                                    <i className="bi bi-telephone-fill text-primary me-2"></i>
                                    <a href={`tel:${getPhone(workerData)}`}>{getPhone(workerData) || 'N/A'}</a>
                                </p>
                                <p className="mb-1">
                                    <i className="bi bi-envelope-fill text-primary me-2"></i>
                                    <a href={`mailto:${getEmail(workerData)}`}>{getEmail(workerData) || 'N/A'}</a>
                                </p>
                                <p className="mb-0">
                                    <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                                    {getAddress(workerData) || 'Dirección no especificada'}
                                </p>
                            </div>

                            <div className="mt-3 bg-white p-3 rounded-3 shadow-sm">
                                <h6 className="text-center mb-3">Información Adicional</h6>
                                <p className="mb-1">
                                    <strong>Disponibilidad:</strong> {getAvailability(workerData) || 'No especificada'}
                                </p>
                                <p className="mb-1">
                                    <strong>Nacionalidad:</strong> {getNationality(workerData) || 'N/A'}
                                </p>
                                <p className="mb-1">
                                    <strong>Estado Civil:</strong> {getCivilStatus(workerData) || 'N/A'}
                                </p>
                                <p className="mb-1">
                                    <strong>Fecha Nacimiento:</strong> {formatDate(getBirthDate(workerData))}
                                </p>
                                <p className="mb-0">
                                    <strong>Pretención Salarial:</strong> {formatSalary(getSalaryExpectation(workerData))}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="col-md-8 p-4">
                        {/* Sección de Educación */}
                        <section className="mb-4">
                            <h5 className="border-bottom pb-2">
                                <i className="bi bi-mortarboard-fill text-primary me-2"></i>
                                Educación
                            </h5>
                            <div className="ps-3">
                                {educations && educations.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                        {educations.map((education, idx) => (
                                            <div key={`edu-${idx}`}>
                                                <h6 className="mb-1">{education.title || 'Sin título especificado'}</h6>
                                                <p className="mb-1 text-muted">
                                                    {education.institution || 'Institución no especificada'}
                                                </p>
                                                <small className="text-muted">
                                                    {formatPeriod(education.startPeriod)} - {formatPeriod(education.endPeriod)}
                                                </small>
                                                <p className="mb-0">
                                                    <strong>Nivel Educativo:</strong> {education.level || 'N/A'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted mb-0">Sin registros de educación</p>
                                )}
                            </div>
                        </section>

                        {/* Sección de Experiencia Laboral */}
                        <section className="mb-4">
                            <h5 className="border-bottom pb-2">
                                <i className="bi bi-briefcase-fill text-primary me-2"></i>
                                Experiencia Laboral
                            </h5>
                            <div className="ps-3">
                                {experiences && experiences.length > 0 ? (
                                    <div className="d-flex flex-column gap-3">
                                        {experiences.map((experience, idx) => (
                                            <div key={`exp-${idx}`}>
                                                <h6 className="mb-1">{experience.position || 'Puesto no especificado'}</h6>
                                                <p className="mb-1 text-muted">
                                                    {experience.company || 'Empresa no especificada'}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Período:</strong> {formatExperienceDate(experience.startMonth, experience.startYear)} - {formatExperienceDate(experience.endMonth, experience.endYear)}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Salario Final:</strong> {formatSalary(experience.finalSalary)}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Jefe Inmediato:</strong> {experience.boss || 'N/A'}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Motivo de Retiro:</strong> {experience.leaveReason || 'N/A'}
                                                </p>
                                                <p className="mb-0">
                                                    <strong>Desempeño:</strong> {experience.performance || 'N/A'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted mb-0">Sin registros de experiencia</p>
                                )}
                            </div>
                        </section>

                        {/* Sección de Referencias */}
                        <section className="mb-4">
                            <h5 className="border-bottom pb-2">
                                <i className="bi bi-people-fill text-primary me-2"></i>
                                Referencias
                            </h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card border-0 bg-light mb-3">
                                        <div className="card-body p-3">
                                            <h6 className="card-title">Laborales</h6>
                                            {allReferences.work && allReferences.work.length > 0 ? (
                                                <div className="d-flex flex-column gap-2">
                                                    {allReferences.work.map((ref, idx) => (
                                                        <div key={`work-ref-${idx}`} className="border-bottom pb-2">
                                                            <p className="mb-1"><strong>Nombre:</strong> {ref.name || 'N/A'}</p>
                                                            <p className="mb-1"><strong>Puesto:</strong> {ref.position || 'N/A'}</p>
                                                            <p className="mb-1"><strong>Teléfono:</strong> {ref.phone || 'N/A'}</p>
                                                            <p className="mb-0"><strong>Email:</strong> {ref.email || 'N/A'}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted mb-0">Sin referencias laborales</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card border-0 bg-light mb-3">
                                        <div className="card-body p-3">
                                            <h6 className="card-title">Personales</h6>
                                            {allReferences.personal && allReferences.personal.length > 0 ? (
                                                <div className="d-flex flex-column gap-2">
                                                    {allReferences.personal.map((ref, idx) => (
                                                        <div key={`personal-ref-${idx}`} className="border-bottom pb-2">
                                                            <p className="mb-1"><strong>Nombre:</strong> {ref.name || 'N/A'}</p>
                                                            <p className="mb-1"><strong>Relación:</strong> {ref.relation || 'N/A'}</p>
                                                            <p className="mb-1"><strong>Teléfono:</strong> {ref.phone || 'N/A'}</p>
                                                            <p className="mb-0"><strong>Email:</strong> {ref.email || 'N/A'}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted mb-0">Sin referencias personales</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Sección de Documentos */}
                        <section>
                            <h5 className="border-bottom pb-2">
                                <i className="bi bi-folder-fill text-primary me-2"></i>
                                Documentos
                            </h5>
                            <div className="d-flex gap-2">
                                {getCV(workerData) && (
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => window.open(getCV(workerData), '_blank')}
                                    >
                                        <i className="bi bi-file-earmark-pdf-fill me-1"></i>
                                        Ver CV
                                    </Button>
                                )}
                                {getPortfolio(workerData) && (
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => window.open(getPortfolio(workerData), '_blank')}
                                    >
                                        <i className="bi bi-folder-fill me-1"></i>
                                        Portafolio
                                    </Button>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer className="bg-light">
                <Button variant="secondary" onClick={handleClose}>
                    <i className="bi bi-x-lg me-1"></i>
                    Cerrar
                </Button>
                <div className="ms-auto">
                    <small className="text-muted me-2">
                        Última actualización: {formatDate(workerData.fecha || workerData.Fecha) || 'N/A'}
                    </small>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default WorkerModal;