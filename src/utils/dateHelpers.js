// Date formatting utilities

/**
 * Format date from various formats to localized string
 * @param {*} date - Date in various formats (Excel number, Date object, string)
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    try {
        if (!date) return 'N/A';

        let dateObj;

        // If already a string, try to parse
        if (typeof date === 'string') {
            dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                // If it's already formatted, return as is
                return date;
            }
        }
        // If it's a number (Excel date)
        else if (typeof date === 'number') {
            dateObj = new Date((date - 25569) * 86400 * 1000);
        }
        // If it's a Date object
        else if (date instanceof Date) {
            dateObj = date;
        }
        else {
            return 'N/A';
        }

        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            return 'N/A';
        }

        // Use provided options or default locale
        const defaultOptions = Object.keys(options).length > 0 ? options : undefined;
        return dateObj.toLocaleDateString('es-GT', defaultOptions);

    } catch (error) {
        console.error('Error formatting date:', date, error);
        return 'N/A';
    }
};

/**
 * Format period (month/year) from various formats
 * @param {*} period - Period in various formats
 * @returns {string} Formatted period string
 */
export const formatPeriod = (period) => {
    try {
        if (!period) return 'N/A';

        // If already in correct format
        if (typeof period === 'string' && period.match(/\d{1,2}\/\d{4}/)) {
            return period;
        }

        // If it's a Date object
        if (period instanceof Date) {
            return `${period.getMonth() + 1}/${period.getFullYear()}`;
        }

        // If it's a number (Excel date)
        if (typeof period === 'number') {
            const date = new Date((period - 25569) * 86400 * 1000);
            return isNaN(date.getTime()) ? 'N/A' : `${date.getMonth() + 1}/${date.getFullYear()}`;
        }

        return String(period);
    } catch (error) {
        console.error('Error formatting period:', period, error);
        return 'N/A';
    }
};

/**
 * Format experience date from month and year
 * @param {*} month - Month value
 * @param {*} year - Year value
 * @returns {string} Formatted date string
 */
export const formatExperienceDate = (month, year) => {
    try {
        if (!month || !year) return 'N/A';
        return `${month}/${year}`;
    } catch (error) {
        console.error('Error formatting experience date:', { month, year }, error);
        return 'N/A';
    }
};

/**
 * Format salary with currency and locale
 * @param {number} salary - Salary amount
 * @param {string} currency - Currency symbol (default: 'Q')
 * @returns {string} Formatted salary string
 */
export const formatSalary = (salary, currency = 'Q') => {
    try {
        if (!salary || isNaN(salary)) return `${currency}N/A`;
        return `${currency}${Number(salary).toLocaleString()}`;
    } catch (error) {
        console.error('Error formatting salary:', salary, error);
        return `${currency}N/A`;
    }
};