function BookClubCard({ club, onClick }) {
  return (
    <div
      className="p-3 border rounded mb-2 shadow-sm"
      style={{ cursor: "pointer" }}
      onClick={() => onClick(club)}
    >
      <h5>{club.name}</h5>
      <p>{club.description}</p>
    </div>
  );
}

export default BookClubCard;
