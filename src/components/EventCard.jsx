import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatEventDate } from "../utils/dateUtils";

function EventCard({ event, bookClubId }) {
  return (
    <Link
      to={`/book_clubs/${bookClubId}/event/${event.id}`}
      style={{ textDecoration: "none", color: "#058789" }}
    >
      <Card
        className="p-3 border rounded mb-2 shadow-sm h-100"
        style={{ backgroundColor: "#f0ecc9" }}
      >
        <Card.Body>
          <Card.Title>{event.event_name}</Card.Title>
          <Card.Text>{formatEventDate(event.event_date)}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default EventCard;
