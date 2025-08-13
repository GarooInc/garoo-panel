import garooLogo from "../../assets/img/garoo-logo.png";

const Header = () => {
    return (
        <header className='border-bottom py-2 px-4 d-flex align-items-center gap-3 bg-light fixed-top'>
            <div>
                <img 
                    src={garooLogo} 
                    alt="Logo de Garoo Servicios" 
                    className="img-fluid rounded-circle" 
                    width="60" 
                    height="60" 
                />
            </div>

            <div className="d-flex flex-column">
                <b className="fs-2">Garoo Servicios</b>
            </div>

            <div className="ms-auto">
                <span className="text-muted small">
                    Bienvenido a Garoo Servicios
                </span>
            </div>
        </header>
    );
};

export default Header;