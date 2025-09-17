import { createContext, useContext, useState } from "react";

const FormContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useFormData = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormData debe usarse dentro de un FormProvider");
    }
    return context;
};


export const FormProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);



    const sendData = async (form_data) => {

        setLoading(true);
        setError(null);

        try {
            // Para FormData con archivos, no establecer Content-Type manualmente
            // El navegador lo configurará automáticamente con el boundary correcto
            const response = await fetch('https://n8n.srv853599.hstgr.cloud/webhook/8481ab6d-c964-41f6-86a4-17f7e0f84788', {
                method: 'POST',
                body: form_data // Enviar FormData directamente, sin JSON.stringify
            });

            if (!response.ok) {
                // Intentar obtener más detalles del error
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorText = await response.text();
                    if (errorText) {
                        errorMessage += ` - ${errorText}`;
                    }
                }
                // eslint-disable-next-line no-unused-vars
                catch (e) {

                    // Si no se puede leer el texto del error, usar el mensaje básico
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setData(result);
            return result;
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };



    return (
        <FormContext.Provider
            value={{
                loading,
                data,
                error,
                setData,
                setLoading,
                setError,
                sendData
            }}
        >
            {children}
        </FormContext.Provider>
    );
};
