import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function EventDetail() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.data.id;

  const fetchEvent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/users/${userId}/events/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEventData(response.data.data);
    } catch (err) {
      setError("Failed to fetch event data.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!eventData) return <p>Loading...</p>;
  return (
    <div className="p-4">
      <h2>{eventData.attributes.event_name}</h2>
      <p>{eventData.attributes.event_date}</p>
      <p>Location: {eventData.attributes.location}</p>
      <p>{eventData.attributes.book}</p>
      <p>{eventData.attributes.event_notes}</p>
    </div>
  );
}

export default EventDetail;
