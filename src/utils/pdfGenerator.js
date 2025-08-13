import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate, formatPeriod, formatExperienceDate, formatSalary } from './dateHelpers';
import {
    getFullName,
    getPosition,
    getNationality,
    getCivilStatus,
    getBirthDate,
    getPhone,
    getEmail,
    getAddress,
    getAvailability,
    getSalaryExpectation,
    getLinkedIn,
    getBehance,
    getCV,
    getPortfolio,
    getEducation,
    getExperience,
    getReferences,
    getSkills
} from './workerDataHelpers';

/**
 * Generate PDF for worker data
 * @param {Object} worker - Worker data object
 */
export const generateWorkerPDF = (worker) => {
    try {
        if (!worker) {
            throw new Error('No worker data provided');
        }

        const doc = new jsPDF();
        let yPos = 20;

        // Document title
        doc.setFontSize(20);
        doc.setTextColor(33, 37, 41);
        doc.text('Información del Trabajador', 14, yPos);
        yPos += 15;

        // Generation date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, yPos);
        yPos += 15;

        /**
         * Add section to PDF
         * @param {string} title - Section title
         * @param {Array} data - Array of [key, value] pairs
         */
        const addSection = (title, data) => {
            try {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }

                const filteredData = data.filter(([key, value]) => {
                    // Don't filter CV and Portfolio fields even if empty
                    if (key === 'CV' || key === 'Portafolio') return true;
                    return value !== null && value !== undefined && value !== '';
                });

                if (filteredData.length === 0) return;

                doc.setFontSize(12);
                doc.setTextColor(100);
                doc.text(title, 14, yPos);
                yPos += 8;

                const tableData = filteredData.map(([key, value]) => {
                    if ((key === 'CV' || key === 'Portafolio') && (!value || value === 'No disponible')) {
                        return [key, 'No disponible'];
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
                    },
                    didDrawCell: (data) => {
                        if (data.column.index === 1) {
                            const key = data.row.raw[0];
                            const value = data.row.raw[1];

                            if (key === 'CV' && value && value !== 'No disponible') {
                                const textX = data.cell.x + data.cell.padding('left');
                                const textY = data.cell.y + data.cell.padding('top') + 7;

                                // Add only clickable link area (invisible)
                                doc.link(textX, textY - 5, data.cell.width - data.cell.padding('left') - data.cell.padding('right'), 10, { url: value });
                            }
                        }
                    }
                };

                autoTable(doc, tableConfig);
                yPos = doc.lastAutoTable.finalY + 10;

            } catch (error) {
                console.error(`Error in section ${title}:`, error);
            }
        };

        // Get structured data
        const education = getEducation(worker);
        const experience = getExperience(worker);
        const references = getReferences(worker);

        // Personal Data Section
        addSection('Datos Personales', [
            ['Nombre Completo', getFullName(worker)],
            ['Puesto', getPosition(worker)],
            ['Nacionalidad', getNationality(worker)],
            ['Estado Civil', getCivilStatus(worker)],
            ['Fecha Nacimiento', formatDate(getBirthDate(worker))],
            ['Teléfono', getPhone(worker)],
            ['Email', getEmail(worker)],
            ['Dirección', getAddress(worker)],
            ['Disponibilidad', getAvailability(worker)],
            ['Pretención Salarial', formatSalary(getSalaryExpectation(worker))],
            ['LinkedIn', getLinkedIn(worker)],
            ['Behance', getBehance(worker)],
            ['CV', (() => {
                const cv = getCV(worker);
                return cv && typeof cv === 'string' && (cv.startsWith('http') || cv.startsWith('www.')) ?
                    cv : 'No disponible';
            })()],
            ['Portafolio', (() => {
                const portfolio = getPortfolio(worker);
                return portfolio && typeof portfolio === 'string' && (portfolio.startsWith('http') || portfolio.startsWith('www.')) ?
                    portfolio : 'No disponible';
            })()],
        ]);

        // Education Section
        if (education.title || education.institution) {
            addSection('Educación', [
                ['Título', education.title],
                ['Institución', education.institution],
                ['Nivel Educativo', education.level],
                ['Período', `${formatPeriod(education.startPeriod)} - ${formatPeriod(education.endPeriod)}`]
            ]);
        }

        // Work Experience Section
        if (experience.company || experience.position) {
            addSection('Experiencia Laboral', [
                ['Empresa', experience.company],
                ['Puesto', experience.position],
                ['Período', `${formatExperienceDate(experience.startMonth, experience.startYear)} - ${formatExperienceDate(experience.endMonth, experience.endYear)}`],
                ['Salario Final', formatSalary(experience.finalSalary)],
                ['Jefe Inmediato', experience.boss],
                ['Motivo de Retiro', experience.leaveReason],
                ['Desempeño', experience.performance]
            ]);
        }

        // References Section
        if (references.work.name || references.personal.name) {
            const referenceData = [];

            if (references.work.name) {
                referenceData.push(
                    ['Ref. Laboral - Nombre', references.work.name],
                    ['Ref. Laboral - Puesto', references.work.position],
                    ['Ref. Laboral - Teléfono', references.work.phone],
                    ['Ref. Laboral - Email', references.work.email]
                );
            }

            if (references.personal.name) {
                referenceData.push(
                    ['Ref. Personal - Nombre', references.personal.name],
                    ['Ref. Personal - Relación', references.personal.relation],
                    ['Ref. Personal - Teléfono', references.personal.phone],
                    ['Ref. Personal - Email', references.personal.email]
                );
            }

            addSection('Referencias', referenceData);
        }

        // Skills Section
        const skills = getSkills(worker);
        if (skills) {
            addSection('Habilidades', [
                ['Habilidades', skills]
            ]);
        }

        // Save PDF
        const fileName = `CV_${(getFullName(worker) || 'trabajador').replace(/[^a-z0-9]/gi, '_')}.pdf`;
        doc.save(fileName);

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
};