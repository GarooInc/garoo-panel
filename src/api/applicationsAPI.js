import { applicationsInstance } from "./axios.js";

export const get_applications = (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });

    // Agregar filtros si existen
    if (filters.search) params.append('search', filters.search);
    if (filters.nationality) params.append('nationality', filters.nationality);
    if (filters.position) params.append('position', filters.position);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    return applicationsInstance.get(`applications?${params.toString()}`);
};

//* Logout en el Backend
// export const logoutRequest = () => axios.post('/auth/logout');
