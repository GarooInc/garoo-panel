
import { Button } from "react-bootstrap";

// Props por defecto (opcional)

const RB_Button = ({ props }) => {
    // Destructuring con valores por defecto
    const { as, type, variant, onClick, size, bootstrap_classes, children } = props;

    return (
        <Button as={as} type={type} variant={variant} size={size} onClick={onClick} className={bootstrap_classes} >
            {children}
        </Button>
    );
};

export default RB_Button;