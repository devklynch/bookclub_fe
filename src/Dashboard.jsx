import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [clubData, setClubData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/users/2/all_club_data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClubData(response.data.data.attributes);
      } catch (err) {
        setError("Failed to fetch club data");
        console.error(err);
      }
    };

    fetchClubData();
  }, []);

  if (error) return <p>{error}</p>;
  if (!clubData) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2>Welcome, {clubData.display_name}</h2>

      <h3>Book Clubs</h3>
      <ul>
        {clubData.book_clubs.map((club) => (
          <li key={club.id}>
            <strong>{club.name}</strong>: {club.description}
          </li>
        ))}
      </ul>

      <h3>Upcoming Events</h3>
      <ul>
        {clubData.upcoming_events.map((event) => (
          <li key={event.id}>
            <strong>{event.event_name}</strong> on{" "}
            {new Date(event.event_date).toLocaleDateString()} at{" "}
            {event.location} – Book: <em>{event.book}</em>
          </li>
        ))}
      </ul>

      <h3>Active Polls</h3>
      <ul>
        {clubData.active_polls.map((poll) => (
          <li key={poll.id}>
            <strong>{poll.question}</strong> (expires on{" "}
            {new Date(poll.expiration_date).toLocaleDateString()}) – Club:{" "}
            {poll.book_club.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
