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

   return (
      <div className="container-fluid p-0">
         <div className="mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
               <h2 className="fw-bold mb-1" style={{ letterSpacing: "-0.5px" }}>Gestión de Aplicaciones</h2>
               <p className="text-secondary small mb-0">Administra y filtra los aplicantes para las vacantes disponibles.</p>
            </div>
            {error && (
               <Alert variant="danger" className="m-0 py-2 border-0 shadow-sm small">
                  {error.message}
               </Alert>
            )}
         </div>

         <div className="bg-white rounded-4 border shadow-sm overflow-hidden min-vh-75">
            <Tabs
               defaultActiveKey="workers"
               id="applications-tabs"
               className="px-3 pt-3 border-bottom bg-light bg-opacity-50"
               style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}
            >
               <Tab
                  eventKey="workers"
                  title={<div className="d-flex align-items-center gap-2 px-2 py-1"><i className="bi bi-person-lines-fill"></i><span>Candidatos</span></div>}
               >
                  <div className="p-3 p-md-4">
                     {loading ? (
                        <div className="d-flex flex-column justify-content-center align-items-center py-5">
                           <Spinner animation="border" variant="primary" className="mb-3" />
                           <p className="text-secondary fw-semibold">Cargando base de datos...</p>
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

                           <div className="mt-4">
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
                           </div>
                        </>
                     )}
                  </div>
               </Tab>

               <Tab
                  eventKey="response"
                  title={<div className="d-flex align-items-center gap-2 px-2 py-1"><i className="bi bi-code-square"></i><span>API Data</span></div>}
               >
                  <div className="p-4">
                     <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fw-bold mb-0">Raw Server JSON</h6>
                        <span className="badge bg-light text-dark border">{data?.length || 0} objetos</span>
                     </div>
                     <div className="rounded-3 bg-dark p-3 overflow-auto" style={{ maxHeight: '500px' }}>
                        <pre className="mb-0 small text-info" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>
                           {JSON.stringify(data, null, 2)}
                        </pre>
                     </div>
                  </div>
               </Tab>
            </Tabs>
         </div>

         {selectedWorker && (
            <WorkerModal
               show={showModal}
               handleClose={handleCloseModal}
               workerData={selectedWorker}
            />
         )}

         <style>{`
            .nav-tabs .nav-link {
                border: none;
                color: var(--text-secondary);
                font-weight: 500;
                font-size: 0.9rem;
                padding: 12px 20px;
                border-bottom: 2px solid transparent;
                transition: all 0.2s ease;
            }
            .nav-tabs .nav-link:hover {
                color: var(--text-main);
                background-color: transparent;
            }
            .nav-tabs .nav-link.active {
                color: var(--primary-color) !important;
                background-color: transparent !important;
                border-bottom: 2px solid var(--primary-color) !important;
            }
            .min-vh-75 {
                min-height: 75vh;
            }
         `}</style>
      </div>
   );
};

export default Applications;