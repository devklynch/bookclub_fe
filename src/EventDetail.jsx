import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import EditEventModal from "./components/EditEventModal";
import axios from "axios";

function EventDetail() {
  const { id, bookClubId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.data.id;

  const fetchEvent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/book_clubs/${bookClubId}/events/${id}`,
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

  // Function to update attending status for the current user
  const updateAttending = async (newStatus) => {
    try {
      // Find the current user's attendee record
      const attendee = eventData.attributes.attendees.find(
        (a) => Number(a.id) === Number(userId)
      );

      if (!attendee) {
        alert("You are not listed as an attendee for this event.");
        return;
      }

      // Send PATCH request to update attending
      await axios.patch(
        `http://localhost:3000/api/v1/book_clubs/${bookClubId}/events/${id}/attendees/${attendee.attendee_id}`,
        { attendee: { attending: newStatus } },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state immediately to reflect change
      setEventData((prevData) => {
        const updatedAttendees = prevData.attributes.attendees.map((a) =>
          a.attendee_id === attendee.attendee_id
            ? { ...a, attending: newStatus }
            : a
        );

        return {
          ...prevData,
          attributes: {
            ...prevData.attributes,
            attendees: updatedAttendees,
            // Also update user_is_attending if needed
            user_is_attending: newStatus,
          },
        };
      });
    } catch (error) {
      console.error("Failed to update attendance:", error);
      setError("Failed to update attendance.");
    }
  };

  if (error) return <p>{error}</p>;
  if (!eventData) return <p>Loading...</p>;

  const attendees = eventData.attributes.attendees;
  // Find current user attendee to show buttons accordingly

  const attendingYes = attendees.filter((a) => a.attending === true);
  const attendingNo = attendees.filter((a) => a.attending === false);
  const attendingUnknown = attendees.filter(
    (a) => a.attending !== true && a.attending !== false
  );

  return (
    <div className="p-4">
      <h2>{eventData.attributes.event_name}</h2>
      <p>
        {new Date(eventData.attributes.event_date).toLocaleString(undefined, {
          dateStyle: "long",
          timeStyle: "short",
        })}
      </p>
      <p>Location: {eventData.attributes.location}</p>
      <p>{eventData.attributes.book}</p>
      <p>{eventData.attributes.event_notes}</p>
      <Button
        onClick={() => setShowEditModal(true)}
        className="mb-3"
        style={{
          backgroundColor: "#f0ecc9",
          borderColor: "#f0ecc9",
          color: "#503d2e",
        }}
      >
        ✏️ Edit Event
      </Button>

      <EditEventModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        eventData={eventData}
        onEventUpdated={(updatedEvent) => setEventData(updatedEvent)}
      />
      <div className="flex items-center gap-2">
        <span>
          Attending:{" "}
          {eventData.attributes.user_is_attending === true
            ? "Yes"
            : eventData.attributes.user_is_attending === false
            ? "No"
            : "Undecided"}
        </span>
      </div>

      {eventData.attributes.user_is_attending !== undefined && (
        <div className="my-4">
          {eventData.attributes.user_is_attending === true && (
            <>
              <button
                onClick={() => updateAttending(false)}
                style={{
                  backgroundColor: "#f0ecc9",
                  borderColor: "#f0ecc9",
                  color: "#503d2e",
                  marginRight: "10px",
                  padding: "5px 10px",
                  borderRadius: "4px",
                }}
              >
                ❌ Mark as Not Attending
              </button>
              <button
                onClick={() => updateAttending(null)}
                style={{
                  backgroundColor: "#f0ecc9",
                  borderColor: "#f0ecc9",
                  color: "#503d2e",
                  marginRight: "10px",
                  padding: "5px 10px",
                  borderRadius: "4px",
                }}
              >
                ❓ Mark as Undecided
              </button>
            </>
          )}
          {eventData.attributes.user_is_attending === null && (
            <>
              <button
                onClick={() => updateAttending(true)}
                style={{
                  backgroundColor: "#f0ecc9",
                  borderColor: "#f0ecc9",
                  color: "#503d2e",
                  marginRight: "10px",
                  padding: "5px 10px",
                  borderRadius: "4px",
                }}
              >
                ✅ Mark as Attending
              </button>
              <button
                onClick={() => updateAttending(false)}
                style={{
                  backgroundColor: "#f0ecc9",
                  borderColor: "#f0ecc9",
                  color: "#503d2e",
                  marginRight: "10px",
                  padding: "5px 10px",
                  borderRadius: "4px",
                }}
              >
                ❌ Mark as Not Attending
              </button>
            </>
          )}
          {eventData.attributes.user_is_attending === false && (
            <>
              <button
                onClick={() => updateAttending(true)}
                style={{
                  backgroundColor: "#f0ecc9",
                  borderColor: "#f0ecc9",
                  color: "#503d2e",
                  marginRight: "10px",
                  padding: "5px 10px",
                  borderRadius: "4px",
                }}
              >
                ✅ Mark as Attending
              </button>
              <button
                onClick={() => updateAttending(null)}
                style={{
                  backgroundColor: "#f0ecc9",
                  borderColor: "#f0ecc9",
                  color: "#503d2e",
                  marginRight: "10px",
                  padding: "5px 10px",
                  borderRadius: "4px",
                }}
              >
                ❓ Mark as Undecided
              </button>
            </>
          )}
        </div>
      )}

      <div className="mt-4">
        <h4>✅ Attending</h4>
        <ul>
          {attendingYes.map((attendee) => (
            <li key={attendee.id}>{attendee.name}</li>
          ))}
        </ul>

        <h4>❌ Not Attending</h4>
        <ul>
          {attendingNo.map((attendee) => (
            <li key={attendee.id}>{attendee.name}</li>
          ))}
        </ul>

        <h4>❓ No RSVP</h4>
        <ul>
          {attendingUnknown.map((attendee) => (
            <li key={attendee.id}>{attendee.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EventDetail;
