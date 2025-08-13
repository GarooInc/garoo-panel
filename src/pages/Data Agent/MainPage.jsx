import { useNavigate } from "react-router-dom";
import Button_back_RB from "../../components/Button_back_RB";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDataAgent } from "../../config/DataAgentProvider";
import Spinner_RB from "../../components/Spinner_RB";
import { useEffect } from "react";


const MainPage = () => {

    const { sendData, loading, response } = useDataAgent();

    const { register, handleSubmit } = useForm();

    const onSubmit = handleSubmit((dataForm) => {
        sendData(dataForm);;
    });


    useEffect(() => {
        console.log('Response updated:', response);
    }, [response]);

    const navigateTo = useNavigate();

    const goToDashboard = () => {
        navigateTo('/services');
    };



    // if (loading) return <div className="w-100 min-vh-100 text-center"><Spinner_RB animation="grow" variant="primary" /></div>;



    return (
        <div className="container-fluid min-vh-100 position-relative">
            {/* Header with back button and title */}
            <div className="row align-items-center py-3 px-2 px-md-3">
                <div className="col-auto">
                    <Button_back_RB onClick={goToDashboard} />
                </div>
                <div className="col text-center">
                    <h2 className="fs-3 fw-bold text-secondary mb-0">Data Agent</h2>
                </div>
                <div className="col-auto">
                    {/* Empty column for balance */}
                </div>
            </div>

            {/* Main content */}
            <div className="bg-secondary-subtle min-vh-100 p-3 p-md-5">
                {/* Response display */}
                <div className="row justify-content-center mb-4 mb-md-5">
                    <div className="col-12 col-lg-8">
                        <div className="text-center">
                            <p className="text-secondary"> {response} </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <Form onSubmit={onSubmit}>
                            <textarea
                                {...register('message', { required: true })}
                                id="message"
                                className="form-control mb-3"
                                style={{ resize: 'none', overflow: 'hidden' }}
                                rows={1}
                                required
                                onInput={(e) => {
                                    e.target.style.height = 'auto';
                                    e.target.style.height = e.target.scrollHeight + 'px';
                                }}
                                placeholder="Escribe aquí..."
                            />

                            <div className="d-flex justify-content-end">
                                <Button
                                    type="submit"
                                    variant="dark"
                                    className="px-4"
                                >
                                    {loading ? <Spinner_RB animation="grow" variant="primary" size="sm" /> : "Enviar"}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPage;