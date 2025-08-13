import { Button, Card } from "react-bootstrap";
import "./Card_RB.css";

const Card_RB = ({
    title = "Card Title",
    text = "Some quick example text to build on the card title and make up the bulk of the card's content.",
    imageSrc = null,
    imageAlt = null,
    buttonText = "Go somewhere",
    buttonVariant = "primary",
    onButtonClick,
    width = "18rem",
    className = "",
    style = {}
}) => {
    const cardStyle = {
        width,
        cursor: "pointer",
        ...style
    };

    return (
        <Card
            style={cardStyle}
            className={className + " shadow-sm bg-light card-hover-effect"}
        >
            <Card.Img variant="top" src={imageSrc} alt={imageAlt} />

            <Card.Body>
                <Card.Title className="fw-bold">{title}</Card.Title>
                <Card.Text className="text-secondary">
                    {text}
                </Card.Text>
                <Button
                    variant={buttonVariant}
                    onClick={onButtonClick}
                    size="sm"
                >
                    {buttonText}
                </Button>
            </Card.Body>
        </Card>
    );
};

export default Card_RB;