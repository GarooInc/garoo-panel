
import Card_RB from "../components/Card_RB";
// import styles from "./home.module.css";

import { useNavigate } from 'react-router-dom';

const Services = () => {

    const navigateTo = useNavigate();

    const services = [
        { title: "RocknRolla Jobs", description: "Selección de talento calificado para tu empresa, adaptado a tus necesidades específicas." },
        { title: "Mundo Verde Form", description: "Envío rápido y seguro de datos de facturas para procesamiento eficiente." },
        { title: "Itzana Data Agent", description: "Agente inteligente para análisis y procesamiento automatizado de datos empresariales." },




    ];

    const handleButtonClick = (index) => {
        // Handle button click logic here

        if (index === 0) navigateTo('/applications');
        if (index === 1) navigateTo('/form');
        if (index === 2) navigateTo('/data-agent');
    };


    return (
        <div className="d-flex flex-wrap gap-5">
            {
                services.map((service, index) => (

                    <Card_RB
                        key={index}
                        title={service.title}
                        text={service.description}
                        buttonText="Entrar"
                        onButtonClick={() => handleButtonClick(index)}
                    />

                ))
            }
        </div>
    );
};

export default Services;