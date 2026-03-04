/**
 * Format date from various formats to localized string
 * @param {*} date - Date in various formats (Excel number, Date object, string)
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
    try {
        if (!date) return "—";

        let dateObj;

        // If already a string, try to parse
        if (typeof date === "string") {
            dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                // If it's already formatted, return as is
                return date;
            }
        }
        // If it's a number (Excel date)
        else if (typeof date === "number") {
            dateObj = new Date((date - 25569) * 86400 * 1000);
        }
        // If it's a Date object
        else if (date instanceof Date) {
            dateObj = date;
        } else {
            return "—";
        }

        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            return "—";
        }

        // Use provided options or default locale
        const defaultOptions =
            Object.keys(options).length > 0
                ? options
                : { day: "2-digit", month: "2-digit", year: "numeric" };
        return dateObj.toLocaleDateString("es-ES", defaultOptions);
    } catch (error) {
        console.error("Error formatting date:", date, error);
        return "—";
    }
};

/**
 * Format date and time to localized string
 * @param {*} date - Date to format
 * @returns {string} Formatted date and time string
 */
export const formatFullDate = (date) => {
    return formatDate(date, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * Format period (month/year) from various formats
 * @param {*} period - Period in various formats
 * @returns {string} Formatted period string
 */
export const formatPeriod = (period) => {
    try {
        if (!period) return "—";

        // If already in correct format
        if (typeof period === "string" && period.match(/\d{1,2}\/\d{4}/)) {
            return period;
        }

        // If it's a Date object
        if (period instanceof Date) {
            return `${period.getMonth() + 1}/${period.getFullYear()}`;
        }

        // If it's a number (Excel date)
        if (typeof period === "number") {
            const date = new Date((period - 25569) * 86400 * 1000);
            return isNaN(date.getTime())
                ? "—"
                : `${date.getMonth() + 1}/${date.getFullYear()}`;
        }

        return String(period);
    } catch (error) {
        console.error("Error formatting period:", period, error);
        return "—";
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
        if (!month || !year) return "—";
        return `${month}/${year}`;
    } catch (error) {
        console.error(
            "Error formatting experience date:",
            { month, year },
            error,
        );
        return "—";
    }
};

/**
 * Format salary with currency and locale
 * @param {number} salary - Salary amount
 * @param {string} currency - Currency symbol (default: 'Q')
 * @returns {string} Formatted salary string
 */
export const formatSalary = (salary, currency = "Q") => {
    try {
        if (!salary || isNaN(salary)) return `${currency} —`;
        return `${currency}${Number(salary).toLocaleString()}`;
    } catch (error) {
        console.error("Error formatting salary:", salary, error);
        return `${currency} —`;
    }
};
