import { createContext, useContext, useEffect, useState, useCallback } from "react";

import { get_applications } from "../api/applicationsAPI";
import { getNationality, getPosition, getEmail, getFullName } from "../utils/workerDataHelpers";

const ApplicationsContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useApplications = () => {

    const context = useContext(ApplicationsContext);
    if (!context) {
        throw new Error("useApplications debe usarse dentro de un ApplicationsProvider");
    }
    return context;

};





export const ApplicationsProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nationalities, setNationalities] = useState([]);
    const [positions, setPositions] = useState([]);
    const [allData, setAllData] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        has_next: false,
        has_prev: false
    });

    const getApplications = useCallback(async (page = 1, limit = 10, filters = {}, loadAll = false) => {
        setLoading(true);
        setError(null);

        try {
            if (loadAll) {
                let accumulatedData = [];
                let currentPage = 1;
                let hasNext = true;

                while (hasNext) {
                    const response = await get_applications(currentPage, limit || 100);
                    const responseData = response.data || response;
                    const results = responseData.results || (Array.isArray(responseData) ? responseData : []);

                    if (results.length === 0) break;

                    accumulatedData = [...accumulatedData, ...results];
                    hasNext = responseData.has_next && results.length > 0;
                    currentPage++;
                }

                // Extraer nacionalidades y puestos únicos
                const uniqueNationalities = [...new Set(
                    accumulatedData
                        .map(worker => getNationality(worker))
                        .filter(n => n && n.trim() !== '')
                )].sort();
                setNationalities(uniqueNationalities);

                const uniquePositions = [...new Set(
                    accumulatedData
                        .map(worker => getPosition(worker))
                        .filter(p => p && p.trim() !== '')
                )].sort();
                setPositions(uniquePositions);

                return accumulatedData;
            } else {
                const response = await get_applications(page, limit, filters);
                const responseData = response.data || response;

                if (responseData.results && Array.isArray(responseData.results)) {
                    setPagination({
                        page: responseData.page,
                        limit: responseData.limit,
                        total: responseData.total,
                        has_next: responseData.has_next,
                        has_prev: responseData.has_prev
                    });
                    return responseData.results;
                } else {
                    return Array.isArray(responseData) ? responseData : [];
                }
            }
        } catch (error) {
            console.error('Error in getApplications:', error);
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const loadAllData = useCallback(async () => {
        if (dataLoaded && allData.length > 0) return allData;

        try {
            setLoading(true);
            let accumulatedApps = [];
            let currentPage = 1;
            let hasNext = true;
            while (hasNext) {
                const response = await get_applications(currentPage, 100);
                const responseData = response.data || response;
                const results = responseData.results || (Array.isArray(responseData) ? responseData : []);

                if (results.length === 0) break;

                accumulatedApps = [...accumulatedApps, ...results];
                hasNext = !!responseData.has_next && results.length > 0;
                currentPage++;
            }

            setAllData(accumulatedApps);
            setDataLoaded(true);

            // Extract unique nationalities and positions
            const uniqueNationalities = [...new Set(
                accumulatedApps
                    .map(worker => getNationality(worker))
                    .filter(n => n && n.trim() !== '')
            )].sort();
            setNationalities(uniqueNationalities);

            const uniquePositions = [...new Set(
                accumulatedApps
                    .map(worker => getPosition(worker))
                    .filter(p => p && p.trim() !== '')
            )].sort();
            setPositions(uniquePositions);

            return accumulatedApps;
        } catch (error) {
            console.error('Error loading all data:', error);
            setError(error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [dataLoaded, allData.length]); // Cambiado de allData a allData.length para evitar bucle

    useEffect(() => {
        if (!dataLoaded) {
            loadAllData();
        }
    }, [dataLoaded, loadAllData]);

    return (
        <ApplicationsContext.Provider
            value={{
                loading,
                data: allData,
                error,
                nationalities,
                positions,
                pagination,
                setAllData,
                setLoading,
                setError,
                getApplications,
                loadAllData,
                allData
            }}
        >
            {children}
        </ApplicationsContext.Provider>
    );
};

