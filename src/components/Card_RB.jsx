import { Button, Card } from "react-bootstrap";
import "./Card_RB.css";

const Card_RB = ({
    title = "Card Title",
    text = "Some quick example text to build on the card title and make up the bulk of the card's content.",
    imageSrc = null,
    imageAlt = null,
    onButtonClick,
    width = "100%",
    className = "",
    style = {},
}) => {
    return (
        <Card
            style={{ width, ...style }}
            className={`modern-card border-0 shadow-sm rounded-4 overflow-hidden ${className}`}
            onClick={onButtonClick}
        >
            {imageSrc && (
                <Card.Img variant="top" src={imageSrc} alt={imageAlt} />
            )}
            <Card.Body className="p-4">
                <div className="icon-circle mb-3">
                    <i className="bi bi-rocket-takeoff"></i>
                </div>
                <Card.Title className="fw-bold text-dark h5 mb-2">
                    {title}
                </Card.Title>
                <Card.Text className="text-secondary small mb-4">
                    {text}
                </Card.Text>
                <div className="d-flex align-items-center justify-content-between pt-2">
                    <span className="text-primary small fw-bold">Ver más</span>
                    <Button variant="link" className="p-0 text-primary">
                        <i className="bi bi-arrow-right-circle fs-4"></i>
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Card_RB;
