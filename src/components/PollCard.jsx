import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatPollDate } from "../utils/dateUtils";

function PollCard({ poll }) {
  return (
    <Link
      to={`/poll/${poll.id}`}
      style={{ textDecoration: "none", color: "#058789" }}
    >
      <Card
        className="p-3 border rounded mb-2 shadow-sm h-100"
        style={{ backgroundColor: "#f0ecc9" }}
      >
        <Card.Body>
          <Card.Title>{poll.poll_question}</Card.Title>
          <Card.Text>
            <strong>Expires:</strong> {formatPollDate(poll.expiration_date)}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default PollCard;
