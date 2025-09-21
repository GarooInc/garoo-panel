import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const RB_Toast = ({ showToast, onClose, toastVariant, toastTitle, toastMessage, position, custom_autohide, delay }) => {
    return (
        <ToastContainer position={position}>
            <Toast
                show={showToast}
                onClose={onClose}
                autohide={custom_autohide}
                delay={delay}
                className="toast-large shadow-md border"
                bg={toastVariant}
                style={{ minWidth: '350px', width: '600px' }}
            >
                <Toast.Header
                    className={toastVariant !== 'light' ? `text-light bg-${toastVariant} fs-6` : `text-dark bg-${toastVariant} fs-6`}>
                    {/* <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" /> */}
                    <strong className="me-auto">{toastTitle}</strong>
                    <small>Notificación</small>
                </Toast.Header>

                <Toast.Body className={toastVariant !== 'light' && 'text-white fs-6'}>
                    <p>{toastMessage}</p>
                </Toast.Body>
            </Toast>
        </ToastContainer >
    );
};

export default RB_Toast;