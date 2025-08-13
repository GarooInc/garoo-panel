import { createContext, useContext, useState } from "react";

const DataAgentContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useDataAgent = () => {
    const context = useContext(DataAgentContext);
    if (!context) {
        throw new Error("useDataAgent debe usarse dentro de un DataAgentProvider");
    }
    return context;
};


export const DataAgentProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(() => {
        return localStorage.getItem('dataAgent') || null;
    });



    const sendData = async (data) => {

        setLoading(true);
        setError(null);

        try {
            // Para FormData con archivos, no establecer Content-Type manualmente
            // El navegador lo configurará automáticamente con el boundary correcto
            const response = await fetch('https://n8n.srv853599.hstgr.cloud/webhook-test/11df5e92-2241-4ec2-ad9d-2ea881670562', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: data.message })
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


            console.log('Response data:', response);

            const result = await response.json();
            console.log('Response data:', result[0].response.response);

            localStorage.setItem('dataAgent', result[0].response.response);
            setResponse(result[0].response.response);
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
        <DataAgentContext.Provider
            value={{
                loading,
                error,
                response,
                setLoading,
                setError,
                sendData
            }}
        >
            {children}
        </DataAgentContext.Provider>
    );
};
