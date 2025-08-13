import styles from './workers.module.css';

import { useState, useEffect } from 'react';
import { Card, Tabs, Tab, Table, Button, Spinner, Alert, Image, InputGroup, Form } from 'react-bootstrap';
import { useWorker } from '../config/WorkerProvider';
import WorkerModal from '../components/WorkerModal';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import garooLogo from '../assets/img/garoo-logo.png';

const Workers = () => {

    const { triggerN8N, data: dataFromState, loading, error } = useWorker();

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);

    useEffect(() => {
        if (dataFromState && Array.isArray(dataFromState)) {
            setData(dataFromState);
        } else if (dataFromState) {
            // Si dataFromState no es un array, intentar extraer el array de datos
            console.warn('dataFromState no es un array:', dataFromState);
            setData([]);
        }
    }, [dataFromState]);

    const handleClick = async () => {
        try {
            await triggerN8N();
        }
        catch (err) {
            console.error('Error en el componente:', err);
        }
    };

    const handleViewDetails = (worker) => {
        setSelectedWorker(worker);
        setShowModal(true);
    };

    const handleCloseModal = () => {

        setShowModal(false);
        setSelectedWorker(null);

    };

    const generateWorkerPDF = (worker) => {
        try {
            // console.log('Datos completos del trabajador:', worker);
            // console.log('Campos disponibles:', Object.keys(worker || {}));

            const doc = new jsPDF();
            let yPos = 20; // Posición vertical inicial

            // Título del documento
            doc.setFontSize(20);
            doc.setTextColor(33, 37, 41);
            doc.text('Información del Trabajador', 14, yPos);
            yPos += 15;

            // Fecha de generación
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, yPos);
            yPos += 15;

            const addSection = (title, data) => {
                try {
                    if (yPos > 250) {
                        doc.addPage();
                        yPos = 20;
                    }

                    const filteredData = data.filter(([key, value]) => {
                        // No filtrar los campos CV y Portafolio aunque estén vacíos
                        if (key === 'CV' || key === 'Portafolio') return true;
                        return value !== null && value !== undefined && value !== '';
                    });

                    if (filteredData.length === 0) return;

                    doc.setFontSize(12);
                    doc.setTextColor(100);
                    doc.text(title, 14, yPos);
                    yPos += 8;

                    // Preparar los datos de la tabla con enlaces formateados
                    const tableData = filteredData.map(([key, value]) => {
                        // Para campos que no tienen valor
                        if (!value || value === 'No disponible') {
                            return [key, 'No disponible'];
                        }

                        // Para enlaces (CV, LinkedIn, Behance), mostrar URL acortada
                        if ((key === 'CV' || key === 'LinkedIn' || key === 'Behance') &&
                            (value.startsWith('http') || value.startsWith('www.'))) {
                            // Acortar URL para mejor visualización
                            const shortUrl = value.length > 50 ? value.substring(0, 47) + '...' : value;
                            return [key, shortUrl];
                        }

                        return [key, value || 'N/A'];
                    });

                    const tableConfig = {
                        startY: yPos,
                        head: [['Campo', 'Valor']],
                        body: tableData,
                        theme: 'grid',
                        headStyles: {
                            fillColor: [52, 58, 64],
                            textColor: 255,
                            fontStyle: 'bold',
                            fontSize: 10
                        },
                        styles: {
                            fontSize: 9,
                            cellPadding: 3,
                            overflow: 'linebreak',
                            cellWidth: 'wrap',
                            minCellHeight: 10
                        },
                        columnStyles: {
                            0: { cellWidth: 70, fontStyle: 'bold' },
                            1: { cellWidth: 'auto' }
                        }
                    };

                    // Dibujamos la tabla
                    autoTable(doc, tableConfig);

                    // Actualizamos la posición Y
                    yPos = doc.lastAutoTable.finalY + 10;

                } catch (error) {
                    console.error(`Error en la sección ${title}:`, error);
                }
            };

            // console.log('Datos del trabajador:', {
            //     'Cv': worker['Cv'],
            //     'cvUrl': worker['cvUrl'],
            //     'File Of Work': worker['File Of Work'],
            //     'portfolioUrl': worker['portfolioUrl']
            // });

            // Datos Personales
            addSection('Datos Personales', [
                ['Nombre Completo', worker.nombre_completo],
                ['Puesto', worker.puesto_solicitud],
                ['Nacionalidad', worker.nacionalidad],
                ['Estado Civil', worker.estado_civil],
                ['Fecha Nacimiento', formatDate(worker.fecha_nacimiento)],
                ['Teléfono', worker.telefono],
                ['Email', worker.email],
                ['Dirección', worker.direccion],
                ['Disponibilidad', worker.disponibilidad_laboral],
                ['Pretención Salarial', worker.pretencion_salarial ? `Q${worker.pretencion_salarial.toLocaleString()}` : 'N/A'],
                ['LinkedIn', worker.linkedin],
                ['Behance', worker.Behance],
                ['CV', worker.cv || 'No disponible'],
            ]);

            // Educación
            if (worker.educacion && worker.educacion.length > 0) {
                const education = worker.educacion[0]; // Tomar la primera educación
                addSection('Educación', [
                    ['Título', education.titulo],
                    ['Institución', education.institucion],
                    ['Nivel Educativo', education.nivel_educativo],
                    ['Período', `${education.periodo?.inicio || 'N/A'} - ${education.periodo?.fin || 'N/A'}`]
                ]);
            }

            // Experiencia Laboral
            if (worker.experiencia && worker.experiencia.length > 0) {
                const experience = worker.experiencia[0]; // Tomar la primera experiencia
                addSection('Experiencia Laboral', [
                    ['Empresa', experience.nombre_empresa],
                    ['Puesto', experience.puesto],
                    ['Período', `${experience.fecha_ingreso?.mes || 'N/A'}/${experience.fecha_ingreso?.año || 'N/A'} - ${experience.fecha_egreso?.mes || 'N/A'}/${experience.fecha_egreso?.año || 'N/A'}`],
                    ['Salario Final', experience.salario_final ? `Q${experience.salario_final.toLocaleString()}` : 'N/A'],
                    ['Jefe Inmediato', experience.jefe_inmediato],
                    ['Motivo de Retiro', experience.motivo_retiro],
                    ['Desempeño', experience.desempeno]
                ]);
            }

            // Referencias Laborales
            if (worker.referencias_laborales && worker.referencias_laborales.length > 0) {
                const workRef = worker.referencias_laborales[0];
                addSection('Referencias Laborales', [
                    ['Nombre', workRef.nombre],
                    ['Puesto', workRef.puesto],
                    ['Empresa', workRef.empresa],
                    ['Teléfono', workRef.telefono],
                    ['Email', workRef.email]
                ]);
            }

            // Referencias Personales
            if (worker.referencias_personales && worker.referencias_personales.length > 0) {
                const personalRef = worker.referencias_personales[0];
                addSection('Referencias Personales', [
                    ['Nombre', personalRef.nombre],
                    ['Relación', personalRef.relacion],
                    ['Teléfono', personalRef.telefono],
                    ['Email', personalRef.email]
                ]);
            }

            // Habilidades (si existen)
            if (worker.habilidades) {
                addSection('Habilidades', [
                    ['Habilidades', worker.habilidades]
                ]);
            }

            // Guardar el PDF
            doc.save(`CV_${(worker.nombre_completo || 'trabajador').replace(/[^a-z0-9]/gi, '_')}.pdf`);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            const errorMessage = error.message || 'Ocurrió un error al generar el PDF. Por favor, inténtalo de nuevo.';
            alert(errorMessage);
        }
    };

    // Función auxiliar para formatear fechas
    const formatPeriod = (period) => {
        try {
            if (!period) return 'N/A';

            // Si el periodo ya está en el formato deseado
            if (typeof period === 'string' && period.match(/\d{1,2}\/\d{4}/)) {
                return period;
            }

            // Si es un objeto de fecha
            if (period instanceof Date) {
                return `${period.getMonth() + 1}/${period.getFullYear()}`;
            }

            // Si es un número (fecha de Excel)
            if (typeof period === 'number') {
                const date = new Date((period - 25569) * 86400 * 1000);
                return isNaN(date.getTime()) ? 'N/A' : `${date.getMonth() + 1}/${date.getFullYear()}`;
            }

            return String(period);
        } catch (error) {
            console.error('Error al formatear período:', period, error);
            return 'N/A';
        }
    };

    const formatExperienceDate = (month, year) => {
        try {
            if (!month || !year) return 'N/A';
            return `${month}/${year}`;
        } catch (error) {
            console.error('Error al formatear fecha de experiencia:', { month, year }, error);
            return 'N/A';
        }
    };

    const formatDate = (date) => {
        try {
            if (!date) return 'N/A';

            // Si ya es un string, devolverlo tal cual
            if (typeof date === 'string') {
                // Intentar parsear si tiene formato de fecha
                const parsedDate = new Date(date);
                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate.toLocaleDateString('es-GT');
                }
                return date;
            }

            // Si es un número (fecha de Excel)
            if (typeof date === 'number') {
                const jsDate = new Date((date - 25569) * 86400 * 1000);
                return isNaN(jsDate.getTime()) ? 'N/A' : jsDate.toLocaleDateString('es-GT');
            }

            // Si es un objeto Date
            if (date instanceof Date) {
                return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('es-GT');
            }

            return 'N/A';
        } catch (error) {
            console.error('Error al formatear fecha:', date, error);
            return 'N/A';
        }
    };

    const filteredWorkers = Array.isArray(data) ? data.filter(worker => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (worker.nombre_completo?.toLowerCase().includes(searchLower)) ||
            (worker.puesto_solicitud?.toLowerCase().includes(searchLower)) ||
            (worker.nacionalidad?.toLowerCase().includes(searchLower)) ||
            (worker.disponibilidad_laboral?.toLowerCase().includes(searchLower))
        );
    }) : [];

    return (
        <div className="mt-4">
            <Card>
                <Card.Body className=''>
                    <Card.Title className='mb-5 d-flex justify-content-between mx-1'>
                        <span className='fs-1 fw-bold'>Reclutamiento</span>
                        <Image src={garooLogo} roundedCircle fluid width={100} height={100} className='border border-primary border-2' />
                    </Card.Title>

                    <div className='mx-4'>
                        <Button
                            variant="primary"
                            onClick={handleClick}
                            disabled={loading}
                            className="mb-3"
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Procesando...
                                </>
                            ) : 'Actualizar Datos'}
                        </Button>

                        {error && (
                            <Alert variant="danger" className="mt-3">
                                <Alert.Heading>Error</Alert.Heading>
                                <p>{error.message}</p>
                            </Alert>
                        )}

                        <Tabs
                            defaultActiveKey="workers"
                            transition={false}
                            id="workers-tabs"
                            className="mb-3"
                        >
                            <Tab eventKey="workers" title="Tabla">
                                <div className="mt-5 mb-3 w-25">
                                    <InputGroup className='border border-dark rounded'>
                                        <InputGroup.Text id="search-workers">
                                            <i className="bi bi-search"></i>
                                        </InputGroup.Text>
                                        <Form.Control
                                            placeholder="Buscar trabajadores..."
                                            aria-label="Buscar trabajadores"
                                            aria-describedby="search-workers"
                                            className='bg-light'
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        {searchTerm && (
                                            <Button
                                                variant="outline-dark"
                                                onClick={() => setSearchTerm('')}
                                                aria-label="Limpiar búsqueda"
                                            >
                                                <i className="bi bi-lg bi-x"></i>
                                            </Button>
                                        )}
                                    </InputGroup>

                                    <small className="text-muted">
                                        {filteredWorkers.length} registro{filteredWorkers.length !== 1 ? 's' : ''} encontrado{filteredWorkers.length !== 1 ? 's' : ''}
                                    </small>
                                </div>

                                <div className="table-responsive">
                                    <Table hover className={`${styles['table']} ${styles['fs-10']}`}>
                                        <thead className='table-secondary'>
                                            <tr>
                                                <th>#</th>
                                                <th>Nombre Completo</th>
                                                <th>Puesto</th>
                                                <th>Nacionalidad</th>
                                                <th>Disponibilidad</th>
                                                <th>Pretención Salarial</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredWorkers.length === 0 && !loading ? (
                                                <tr>
                                                    <td colSpan="7" className="text-center py-4">
                                                        <i className="bi bi-inbox display-4 text-muted d-block mb-2"></i>
                                                        <span className="text-muted">
                                                            {searchTerm ? 'No se encontraron trabajadores con esos criterios' : 'No hay trabajadores disponibles'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredWorkers.map((worker, index) => (
                                                    <tr key={worker.id || index}>
                                                        <td>{index + 1}</td>
                                                        <td>{worker.nombre_completo || 'N/A'}</td>
                                                        <td>{worker.puesto_solicitud || 'N/A'}</td>
                                                        <td>{worker.nacionalidad || 'N/A'}</td>
                                                        <td>
                                                            {worker.disponibilidad_laboral || 'No especificada'}
                                                        </td>
                                                        <td>
                                                            {worker.pretencion_salarial ? `Q${Number(worker.pretencion_salarial).toLocaleString()}` : 'Q N/A'}
                                                        </td>

                                                        <td>
                                                            <div className='d-flex gap-1'>
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    className="me-1"
                                                                    title="Ver detalles"
                                                                    onClick={() => handleViewDetails(worker)}
                                                                >
                                                                    <i className="bi bi-eye"></i>
                                                                </Button>

                                                                <Button
                                                                    variant="success"
                                                                    size="sm"
                                                                    title="Descargar PDF"
                                                                    onClick={() => generateWorkerPDF(worker)}
                                                                >
                                                                    <i className="bi bi-file-earmark-pdf"></i>
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Tab>
                            <Tab eventKey="response" title="Respuesta del servidor">
                                <div className="mt-4">
                                    <h4>Respuesta del servidor:</h4>
                                    <pre className="bg-light p-3 rounded">
                                        {JSON.stringify(data, null, 2)}
                                    </pre>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </Card.Body>
            </Card>

            {/* Modal de detalles del trabajador */}
            {selectedWorker && (
                <WorkerModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    workerData={selectedWorker}
                />
            )}
        </div>
    );
};

export default Workers;