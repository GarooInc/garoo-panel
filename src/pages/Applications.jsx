import styles from './applications.module.css';
import { useState, useCallback } from 'react';
import { Card, Tabs, Tab, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useApplications } from '../config/ApplicationsProvider';
import { useSimpleFilters } from '../hooks/useSimpleFilters';
import { generateWorkerPDF } from '../utils/pdfGenerator';

import WorkerModal from '../components/WorkerModal';
import Button_back_RB from '../components/Button_back_RB';
import ApplicationsFilters from '../components/ApplicationsFilters';
import ApplicationsTable from '../components/ApplicationsTable';
import ClientSidePagination from '../components/ClientSidePagination';

const Applications = () => {
   const { error, loading, data, nationalities, positions } = useApplications();
   const {
      searchTerm,
      setSearchTerm,
      sortOption,
      setSortOption,
      nationalityFilter,
      setNationalityFilter,
      positionFilter,
      setPositionFilter,
      salaryFilter,
      setSalaryFilter,
      dateFilter,
      setDateFilter,
      handleResetFilters,
      filteredWorkers
   } = useSimpleFilters(data);

   const [showModal, setShowModal] = useState(false);
   const [selectedWorker, setSelectedWorker] = useState(null);

   // Event handlers with useCallback for performance
   const handleViewDetails = useCallback((worker) => {
      setSelectedWorker(worker);
      setShowModal(true);
   }, []);

   const handleCloseModal = useCallback(() => {
      setShowModal(false);
      setSelectedWorker(null);
   }, []);

   const handlePDFGeneration = useCallback(async (worker) => {
      try {
         generateWorkerPDF(worker);
      }
      catch (error) {
         console.error('Error generating PDF:', error);
         alert(error.message || 'Error al generar el PDF. Por favor, inténtalo de nuevo.');
      }
   }, []);

   const navigateTo = useNavigate();

   const goToDashboard = () => {
      navigateTo('/services');
   };

   return (
      <div className="bg-light min-vh-100">
         <Card className="border-0 bg-white">
            <Card.Body className="p-1">
               {/* Header simple */}
               <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-light">
                  <Button_back_RB onClick={goToDashboard} className="me-3" />
                  <h2 className="text-dark mb-0 fw-light">RocknRolla Jobs</h2>
               </div>

               <div>
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
                     className="mb-4 border-0"
                     variant="pills"
                     style={{
                        '--bs-nav-pills-link-active-bg': '#212529',
                        '--bs-nav-link-padding-x': '0.75rem',
                        '--bs-nav-link-padding-y': '0.375rem'
                     }}
                  >
                     <Tab eventKey="workers" title={<span className="small">Aplicaciones</span>} className="text-muted">
                        {loading ? (
                           <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                              <div className="text-center">
                                 <Spinner animation="border" role="status" className="mb-3">
                                    <span className="visually-hidden">Cargando...</span>
                                 </Spinner>
                                 <p className="text-muted">Cargando aplicaciones...</p>
                              </div>
                           </div>
                        ) : (
                           <>
                              <ApplicationsFilters
                                 searchTerm={searchTerm}
                                 setSearchTerm={setSearchTerm}
                                 sortOption={sortOption}
                                 setSortOption={setSortOption}
                                 nationalityFilter={nationalityFilter}
                                 setNationalityFilter={setNationalityFilter}
                                 positionFilter={positionFilter}
                                 setPositionFilter={setPositionFilter}
                                 salaryFilter={salaryFilter}
                                 setSalaryFilter={setSalaryFilter}
                                 dateFilter={dateFilter}
                                 setDateFilter={setDateFilter}
                                 nationalities={nationalities}
                                 positions={positions}
                                 handleResetFilters={handleResetFilters}
                                 filteredWorkers={filteredWorkers}
                              />

                              <ClientSidePagination
                                 data={filteredWorkers}
                                 itemsPerPage={10}
                                 renderItems={(currentItems) => (
                                    <ApplicationsTable
                                       filteredWorkers={currentItems}
                                       handleViewDetails={handleViewDetails}
                                       handlePDFGeneration={handlePDFGeneration}
                                       styles={styles}
                                       searchTerm={searchTerm}
                                    />
                                 )}
                              />
                           </>
                        )}
                     </Tab>

                     <Tab eventKey="response" title={<span className="small">Datos</span>} className="text-muted">
                        <div className="mt-4">
                           <h5 className="text-dark fw-light mb-3">Respuesta del servidor</h5>
                           <div className="bg-light border rounded p-3 overflow-auto" style={{ maxHeight: '400px' }}>
                              <pre className="mb-0 small text-muted">
                                 {JSON.stringify(data, null, 2)}
                              </pre>
                           </div>
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

export default Applications;