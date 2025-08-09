import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function PollCard({ poll }) {
  const formatExpirationDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <Link
      to={`/poll/${poll.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card className="p-3 border rounded mb-2 shadow-sm h-100">
        <Card.Body>
          <Card.Title>{poll.poll_question}</Card.Title>
          <Card.Text>
            <strong>Expires:</strong>{" "}
            {formatExpirationDate(poll.expiration_date)}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default PollCard;
