import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function BookClubCard({ club }) {
  return (
    <Link
      to={`/bookclub/${club.id}`}
      style={{ textDecoration: "none", color: "#058789" }}
    >
      <Card
        className="p-3 border rounded mb-2 shadow-sm h-100"
        style={{ backgroundColor: "#f0ecc9" }}
      >
        <Card.Body>
          <Card.Title>{club.name}</Card.Title>
          <Card.Text>{club.description}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default BookClubCard;
