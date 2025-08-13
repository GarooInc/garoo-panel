
import { Button } from "react-bootstrap";

const Button_back_RB = ({
    text = "Regresar",
    variant = "light",
    size = 'md',
    disabled = false,
    onClick,
    className,
    type = "button",
    showIcon = true,
    ...props
}) => {
    return (
        <Button
            variant={variant}
            size={size}
            disabled={disabled}
            onClick={onClick}
            className={className + " fw-bold"}
            type={type}
            {...props}
        >
            {showIcon && (
                <span className="me-2">
                    <i className="bi bi-lg bi-caret-left-fill"></i>
                </span>
            )}
            {text}
        </Button>
    );
};

export default Button_back_RB;