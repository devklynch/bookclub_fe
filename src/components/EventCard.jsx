function EventCard({ event, onClick }) {
  return (
    <div
      className="p-3 border rounded mb-2 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={() => onClick(event)}
    >
      <h5>{event.event_name}</h5>
      <p>
        {new Date(event.event_date).toLocaleDateString()} at {event.location} –
        Book: <em>{event.book}</em>
      </p>
    </div>
  );
}

export default EventCard;
