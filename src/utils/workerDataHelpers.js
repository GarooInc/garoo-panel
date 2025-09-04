// Utility functions for extracting worker data fields
// This eliminates code duplication between Applications.jsx and WorkerModal.jsx

/**
 * Generic function to get field value from worker object with multiple possible field names
 * @param {Object} worker - Worker data object
 * @param {Array} possibleFields - Array of possible field names to check
 * @returns {*} Field value or null if not found
 */
export const getFieldValue = (worker, possibleFields) => {
    if (!worker || !Array.isArray(possibleFields)) return null;

    for (const field of possibleFields) {
        if (worker[field] !== undefined && worker[field] !== null && worker[field] !== '') {
            return worker[field];
        }
    }
    return null;
};

// Personal Information
export const getFullName = (worker) => {
    return getFieldValue(worker, [
        'nombre_completo',
        'Nombre Completo',
        'nombreCompleto',
        'fullName',
        'name',
        'nombre'
    ]);
};

export const getPosition = (worker) => {
    return getFieldValue(worker, [
        'puesto_solicitud',
        'Puesto Solicitud',
        'Experiencia Puesto',
        'experiencia_puesto',
        'position',
        'puesto',
        'job_title'
    ]);
};

export const getNationality = (worker) => {
    return getFieldValue(worker, [
        'nacionalidad',
        'Nacionalidad',
        'nationality',
        'country'
    ]);
};

export const getAvailability = (worker) => {
    return getFieldValue(worker, [
        'disponibilidad_laboral',
        'Disponibilidad Laboral',
        'availability',
        'disponibilidad'
    ]);
};

export const getSalaryExpectation = (worker) => {
    return getFieldValue(worker, [
        'pretencion_salarial',
        'Pretencion Salarial',
        'salary_expectation',
        'salario_esperado'
    ]);
};

export const getEmail = (worker) => {
    return getFieldValue(worker, [
        'email',
        'Email',
        'correo',
        'Correo',
        'correo_electronico',
        'Correo Electronico',
        'correo_electrónico',
        'Correo Electrónico',
        'mail',
        'Mail',
        'e_mail',
        'e-mail',
        'E-mail',
        'E_mail',
        'emailAddress',
        'email_address'
    ]);
};

export const getPhone = (worker) => {
    return getFieldValue(worker, [
        'telefono',
        'Telefono',
        'phone',
        'tel'
    ]);
};

export const getAddress = (worker) => {
    return getFieldValue(worker, [
        'direccion',
        'Direccion',
        'address',
        'domicilio'
    ]);
};

export const getCivilStatus = (worker) => {
    return getFieldValue(worker, [
        'estado_civil',
        'Estado Civil',
        'civil_status',
        'marital_status'
    ]);
};

export const getBirthDate = (worker) => {
    return getFieldValue(worker, [
        'fecha_nacimiento',
        'Fecha Nacimiento',
        'birth_date',
        'fecha_nac'
    ]);
};

// Education - Get the most recent education entry
export const getEducations = (worker) => {
    if (!worker || !Array.isArray(worker.educacion) || worker.educacion.length === 0) return [];
    // Map all education entries to a normalized structure
    return worker.educacion.map((education) => ({
        title: education?.titulo || null,
        institution: education?.institucion || null,
        level: education?.nivel_educativo || null,
        startPeriod: education?.periodo?.inicio || null,
        endPeriod: education?.periodo?.fin || null
    }));
};

// Backward-compatible: keep single-item helper returning the first entry
export const getEducation = (worker) => {
    const list = getEducations(worker);
    return list[0] || { title: null, institution: null, level: null, startPeriod: null, endPeriod: null };
};

// Social Links
export const getLinkedIn = (worker) => {
    return getFieldValue(worker, [
        'linkedin',
        'Linkedin',
        'LinkedIn'
    ]);
};

export const getBehance = (worker) => {
    return getFieldValue(worker, [
        'Behance',
        'behance'
    ]);
};

// Documents
export const getCV = (worker) => {
    return getFieldValue(worker, [
        'cv',
        'Cv',
        'CV',
        'cvUrl',
        'cv_url'
    ]);
};

export const getPortfolio = (worker) => {
    return getFieldValue(worker, [
        'portafolio',
        'File Of Work',
        'Portafolio',
        'portfolioUrl',
        'portfolio_url'
    ]);
};

// Experience - Get the most recent experience entry
export const getExperiences = (worker) => {
    if (!worker || !Array.isArray(worker.experiencia) || worker.experiencia.length === 0) return [];
    return worker.experiencia.map((experience) => ({
        position: experience?.puesto || null,
        company: experience?.nombre_empresa || null,
        startMonth: experience?.fecha_ingreso?.mes || null,
        startYear: experience?.fecha_ingreso?.año || null,
        endMonth: experience?.fecha_egreso?.mes || null,
        endYear: experience?.fecha_egreso?.año || null,
        finalSalary: experience?.salario_final || null,
        boss: experience?.jefe_inmediato || null,
        leaveReason: experience?.motivo_retiro || null,
        performance: experience?.desempeno || null
    }));
};

// Backward-compatible
export const getExperience = (worker) => {
    const list = getExperiences(worker);
    return list[0] || {
        position: null,
        company: null,
        startMonth: null,
        startYear: null,
        endMonth: null,
        endYear: null,
        finalSalary: null,
        boss: null,
        leaveReason: null,
        performance: null
    };
};

// References
export const getAllReferences = (worker) => {
    const workRefs = Array.isArray(worker?.referencias_laborales)
        ? worker.referencias_laborales.map((r) => ({
            name: r?.nombre || null,
            position: r?.puesto || null,
            phone: r?.telefono || null,
            email: r?.email || null
        }))
        : [];

    const personalRefs = Array.isArray(worker?.referencias_personales)
        ? worker.referencias_personales.map((r) => ({
            name: r?.nombre || null,
            relation: r?.relacion || null,
            phone: r?.telefono || null,
            email: r?.email || null
        }))
        : [];

    return { work: workRefs, personal: personalRefs };
};

// Backward-compatible: keep original signature returning first of each list
export const getReferences = (worker) => {
    const { work, personal } = getAllReferences(worker);
    return {
        work: work[0] || { name: null, position: null, phone: null, email: null },
        personal: personal[0] || { name: null, relation: null, phone: null, email: null }
    };
};

// Skills
export const getSkills = (worker) => {
    return getFieldValue(worker, [
        'Habilidades',
        'habilidades',
        'skills'
    ]);
};

// Application Date
export const getApplicationDate = (worker) => {
    return getFieldValue(worker, [
        'fecha',
        'Fecha',
        'fecha_aplicacion',
        'Fecha Aplicacion',
        'fecha_de_aplicacion',
        'Fecha de Aplicacion',
        'application_date',
        'created_at',
        'createdAt',
        'timestamp',
        'date'
    ]);
};

// Parse date from DD-MM-YYYY format to Date object
export const parseApplicationDate = (dateString) => {
    if (!dateString) return new Date(0);

    // Handle DD-MM-YYYY format
    if (typeof dateString === 'string' && dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }
    }

    // Fallback to regular Date parsing
    return new Date(dateString);
};