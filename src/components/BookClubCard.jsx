import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function BookClubCard({ club }) {
  return (
    <Link
      to={`/bookclub/${club.id}`}
      style={{ textDecoration: "none" }}
      className="warm-glow"
    >
      <Card
        className="p-3 border rounded mb-2 shadow-sm h-100 cozy-container book-club-card"
        style={{
          borderColor: "var(--border-color)",
          transition: "all 0.3s ease",
          position: "relative",
        }}
      >
        <div
          className="corner-accent top-left"
          style={{
            position: "absolute",
            top: "5px",
            left: "5px",
            width: "25px",
            height: "8px",
            background: "var(--forest-green)",
            borderRadius: "0 0 8px 0",
            opacity: "0.5",
            transition: "all 0.3s ease",
          }}
        ></div>
        <div
          className="corner-accent bottom-right"
          style={{
            position: "absolute",
            bottom: "5px",
            right: "5px",
            width: "25px",
            height: "8px",
            background: "var(--sage-green)",
            borderRadius: "8px 0 0 0",
            opacity: "0.5",
            transition: "all 0.3s ease",
          }}
        ></div>
        <Card.Body>
          <Card.Title
            style={{
              color: "var(--primary-text)",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontWeight: "600",
              marginBottom: "1rem",
            }}
          >
            📖 {club.name}
          </Card.Title>
          <Card.Text
            style={{
              color: "var(--primary-text)",
              lineHeight: "1.6",
            }}
          >
            {club.description}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default BookClubCard;
