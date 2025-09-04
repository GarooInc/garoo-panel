import { createContext, useContext, useEffect, useState, useCallback } from "react";

import { get_applications } from "../api/applicationsAPI";
import { getNationality, getPosition } from "../utils/workerDataHelpers";

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
    const [, setData] = useState([]);
    const [error, setError] = useState(null);
    const [nationalities, setNationalities] = useState([]);
    const [positions, setPositions] = useState([]);
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
                // Para cargar todos los datos para filtros (nacionalidades y posiciones)
                let allData = [];
                let currentPage = 1;
                let hasNext = true;

                while (hasNext) {
                    const response = await get_applications(currentPage, 100); // Usar límite alto para eficiencia
                    const responseData = response.data || response;

                    if (responseData.results && Array.isArray(responseData.results)) {
                        allData = [...allData, ...responseData.results];
                        hasNext = responseData.has_next;
                        currentPage++;
                    } else {
                        hasNext = false;
                    }
                }

                // Extract unique nationalities and positions from all data
                const uniqueNationalities = [...new Set(
                    allData
                        .map(worker => getNationality(worker))
                        .filter(nationality => nationality && nationality.trim() !== '')
                )].sort();
                setNationalities(uniqueNationalities);

                const uniquePositions = [...new Set(
                    allData
                        .map(worker => getPosition(worker))
                        .filter(position => position && position.trim() !== '')
                )].sort();
                setPositions(uniquePositions);

                return allData;
            } else {
                // Carga paginada con filtros
                const response = await get_applications(page, limit, filters);
                const responseData = response.data || response;

                if (responseData.results && Array.isArray(responseData.results)) {
                    setData(responseData.results);
                    setPagination({
                        page: responseData.page,
                        limit: responseData.limit,
                        total: responseData.total,
                        has_next: responseData.has_next,
                        has_prev: responseData.has_prev
                    });
                    return responseData.results;
                } else {
                    // Fallback para formato anterior
                    setData(responseData);
                    return responseData;
                }
            }
        }
        catch (error) {
            console.error('Error in getApplications:', error);
            setError(error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    }, []);

    // Estado para todos los datos (para filtros)
    const [allData, setAllData] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Función para cargar todos los datos
    const loadAllData = useCallback(async () => {
        if (dataLoaded) return allData;

        try {
            setLoading(true);
            let allApplications = [];
            let currentPage = 1;
            let hasNext = true;

            while (hasNext) {
                const response = await get_applications(currentPage, 100);
                const responseData = response.data || response;

                if (responseData.results && Array.isArray(responseData.results)) {
                    allApplications = [...allApplications, ...responseData.results];
                    hasNext = responseData.has_next;
                    currentPage++;
                } else if (Array.isArray(responseData)) {
                    allApplications = [...allApplications, ...responseData];
                    hasNext = false;
                } else {
                    hasNext = false;
                }
            }

            setAllData(allApplications);
            setDataLoaded(true);

            // Extract unique nationalities and positions
            const uniqueNationalities = [...new Set(
                allApplications
                    .map(worker => getNationality(worker))
                    .filter(nationality => nationality && nationality.trim() !== '')
            )].sort();
            setNationalities(uniqueNationalities);

            const uniquePositions = [...new Set(
                allApplications
                    .map(worker => getPosition(worker))
                    .filter(position => position && position.trim() !== '')
            )].sort();
            setPositions(uniquePositions);

            return allApplications;
        } catch (error) {
            console.error('Error loading all data:', error);
            setError(error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [dataLoaded, allData]);

    // useEffect to fetch applications data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar todos los datos de una vez para que los filtros funcionen correctamente
                await loadAllData();
            }
            catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        fetchData();
    }, [loadAllData]);



    return (
        <ApplicationsContext.Provider
            value={{
                loading,
                data: allData, // Usar todos los datos para que los filtros funcionen correctamente
                error,
                nationalities,
                positions,
                pagination,
                setData,
                setLoading,
                setError,
                setNationalities,
                setPositions,
                setPagination,
                getApplications,
                loadAllData,
                allData
            }}
        >
            {children}
        </ApplicationsContext.Provider>
    );
};
