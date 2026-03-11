import { useState, useMemo, useCallback } from 'react';
import {
    getFullName,
    getPosition,
    getNationality,
    getAvailability,
    getSalaryExpectation,
    getEmail,
    getPhone,
    getApplicationDate,
    parseApplicationDate
} from '../utils/workerDataHelpers';

export const useSimpleFilters = (data) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [nationalityFilter, setNationalityFilter] = useState('');
    const [positionFilter, setPositionFilter] = useState('');
    const [salaryFilter, setSalaryFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const handleResetFilters = useCallback(() => {
        setSearchTerm('');
        setSortOption('');
        setNationalityFilter('');
        setPositionFilter('');
        setSalaryFilter('');
        setDateFilter('');
    }, []);

    // Filtros y ordenamiento aplicados a los datos
    const filteredWorkers = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [];

        let workers = [...data]; // Crear copia para no mutar el original

        // Aplicar filtro de búsqueda
        if (searchTerm && searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            workers = workers.filter(worker => {
                const fullName = getFullName(worker);
                const position = getPosition(worker);
                const nationality = getNationality(worker);
                const availability = getAvailability(worker);
                const email = getEmail(worker);
                const phone = getPhone(worker);

                return (
                    (fullName && fullName.toLowerCase().includes(searchLower)) ||
                    (position && position.toLowerCase().includes(searchLower)) ||
                    (nationality && nationality.toLowerCase().includes(searchLower)) ||
                    (availability && availability.toLowerCase().includes(searchLower)) ||
                    (email && email.toLowerCase().includes(searchLower)) ||
                    (phone && phone.toLowerCase().includes(searchLower))
                );
            });
        }

        // Aplicar filtro de nacionalidad
        if (nationalityFilter && nationalityFilter.trim()) {
            workers = workers.filter(worker => {
                const nationality = getNationality(worker);
                return nationality === nationalityFilter;
            });
        }

        // Aplicar filtro de puesto
        if (positionFilter && positionFilter.trim()) {
            workers = workers.filter(worker => {
                const position = getPosition(worker);
                return position === positionFilter;
            });
        }

        // Aplicar ordenamiento
        if (dateFilter) {
            workers.sort((a, b) => {
                const dateA = getApplicationDate(a);
                const dateB = getApplicationDate(b);
                const parsedDateA = parseApplicationDate(dateA);
                const parsedDateB = parseApplicationDate(dateB);

                if (dateFilter === 'desc') {
                    return parsedDateB - parsedDateA;
                } else if (dateFilter === 'asc') {
                    return parsedDateA - parsedDateB;
                }
                return 0;
            });
        } else if (salaryFilter) {
            workers.sort((a, b) => {
                const salaryA = Number(getSalaryExpectation(a)) || 0;
                const salaryB = Number(getSalaryExpectation(b)) || 0;

                if (salaryFilter === 'desc') {
                    return salaryB - salaryA;
                } else if (salaryFilter === 'asc') {
                    return salaryA - salaryB;
                }
                return 0;
            });
        } else if (sortOption) {
            workers.sort((a, b) => {
                const nameA = getFullName(a) || '';
                const nameB = getFullName(b) || '';

                if (sortOption === '1') {
                    return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
                } else if (sortOption === '1-desc') {
                    return nameB.localeCompare(nameA, 'es', { sensitivity: 'base' });
                }
                return 0;
            });
        }

        return workers;
    }, [data, searchTerm, sortOption, nationalityFilter, positionFilter, salaryFilter, dateFilter]);

    return {
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
    };
};