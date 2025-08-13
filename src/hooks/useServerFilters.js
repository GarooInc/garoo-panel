import { useState, useCallback, useEffect } from 'react';
import { useApplications } from '../config/ApplicationsProvider';

export const useServerFilters = () => {
    const { getApplications, pagination } = useApplications();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [nationalityFilter, setNationalityFilter] = useState('');
    const [positionFilter, setPositionFilter] = useState('');
    const [salaryFilter, setSalaryFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Función para aplicar filtros al servidor
    const applyFilters = useCallback(async (page = 1) => {
        const filters = {};

        // Construir objeto de filtros
        if (searchTerm.trim()) {
            filters.search = searchTerm.trim();
        }

        if (nationalityFilter) {
            filters.nationality = nationalityFilter;
        }

        if (positionFilter) {
            filters.position = positionFilter;
        }

        // Manejar ordenamiento
        if (sortOption) {
            if (sortOption === '1') {
                filters.sortBy = 'name';
                filters.sortOrder = 'asc';
            } else if (sortOption === '1-desc') {
                filters.sortBy = 'name';
                filters.sortOrder = 'desc';
            }
        } else if (salaryFilter) {
            filters.sortBy = 'salary';
            filters.sortOrder = salaryFilter; // 'asc' o 'desc'
        } else if (dateFilter) {
            filters.sortBy = 'date';
            filters.sortOrder = dateFilter; // 'asc' o 'desc'
        }

        // Aplicar filtros al servidor
        await getApplications(page, pagination.limit, filters);
    }, [searchTerm, sortOption, nationalityFilter, positionFilter, salaryFilter, dateFilter, getApplications, pagination.limit]);

    // Función para resetear filtros
    const handleResetFilters = useCallback(async () => {
        setSearchTerm('');
        setSortOption('');
        setNationalityFilter('');
        setPositionFilter('');
        setSalaryFilter('');
        setDateFilter('');

        // Recargar datos sin filtros
        await getApplications(1, pagination.limit, {});
    }, [getApplications, pagination.limit]);

    // Aplicar filtros automáticamente cuando cambien (con debounce para búsqueda)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            applyFilters(1); // Siempre volver a la página 1 cuando cambien los filtros
        }, searchTerm ? 500 : 0); // Debounce de 500ms para búsqueda, inmediato para otros filtros

        return () => clearTimeout(timeoutId);
    }, [searchTerm, sortOption, nationalityFilter, positionFilter, salaryFilter, dateFilter, applyFilters]);

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
        applyFilters
    };
};