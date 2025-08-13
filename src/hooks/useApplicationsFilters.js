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

export const useApplicationsFilters = (data) => {
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

    // Memoized filtered and sorted workers for performance
    const filteredWorkers = useMemo(() => {
        if (!Array.isArray(data)) return [];

        let workers = data;

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            workers = workers.filter(worker => {
                const fullName = getFullName(worker);
                const position = getPosition(worker);
                const nationality = getNationality(worker);
                const availability = getAvailability(worker);
                const email = getEmail(worker);
                const phone = getPhone(worker);

                return (
                    (fullName?.toLowerCase().includes(searchLower)) ||
                    (position?.toLowerCase().includes(searchLower)) ||
                    (nationality?.toLowerCase().includes(searchLower)) ||
                    (availability?.toLowerCase().includes(searchLower)) ||
                    (email?.toLowerCase().includes(searchLower)) ||
                    (phone?.toLowerCase().includes(searchLower))
                );
            });
        }

        // Apply nationality filter
        if (nationalityFilter) {
            workers = workers.filter(worker => {
                const nationality = getNationality(worker);
                return nationality === nationalityFilter;
            });
        }

        // Apply position filter
        if (positionFilter) {
            workers = workers.filter(worker => {
                const position = getPosition(worker);
                return position === positionFilter;
            });
        }

        // Apply sorting - only apply the active filter, not in priority order
        if (dateFilter) {
            workers = [...workers].sort((a, b) => {
                const dateA = getApplicationDate(a);
                const dateB = getApplicationDate(b);
                const parsedDateA = parseApplicationDate(dateA);
                const parsedDateB = parseApplicationDate(dateB);

                switch (dateFilter) {
                    case 'desc': // Más reciente a más antigua
                        return parsedDateB - parsedDateA;
                    case 'asc': // Más antigua a más reciente
                        return parsedDateA - parsedDateB;
                    default:
                        return 0;
                }
            });
        } else if (salaryFilter) {
            workers = [...workers].sort((a, b) => {
                const salaryA = Number(getSalaryExpectation(a)) || 0;
                const salaryB = Number(getSalaryExpectation(b)) || 0;

                switch (salaryFilter) {
                    case 'desc': // Mayor a Menor
                        return salaryB - salaryA;
                    case 'asc': // Menor a Mayor
                        return salaryA - salaryB;
                    default:
                        return 0;
                }
            });
        } else if (sortOption) {
            workers = [...workers].sort((a, b) => {
                switch (sortOption) {
                    case '1': // Alfabéticamente (A-Z)
                        {
                            const nameA = getFullName(a) || '';
                            const nameB = getFullName(b) || '';
                            return nameA.localeCompare(nameB, 'es', { sensitivity: 'base' });
                        }
                    case '1-desc': // Alfabéticamente (Z-A)
                        {
                            const nameA = getFullName(a) || '';
                            const nameB = getFullName(b) || '';
                            return nameB.localeCompare(nameA, 'es', { sensitivity: 'base' });
                        }
                    default:
                        return 0;
                }
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