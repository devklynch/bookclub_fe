function PollCard({ poll, onClick }) {
  return (
    <div
      className="p-3 border rounded mb-2 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={() => onClick(poll)}
    >
      <h5>{poll.question}</h5>
      <p>{poll.expiration_date}</p>
      <p>{poll.book_club.name}</p>
    </div>
  );
}
export default PollCard;
