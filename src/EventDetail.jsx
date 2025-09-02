import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import EditEventModal from "./components/EditEventModal";
import axios from "axios";
import { formatEventDate } from "./utils/dateUtils";

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
        `${
          import.meta.env.VITE_API_BASE_URL
        }/book_clubs/${bookClubId}/events/${id}`,
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
        `${
          import.meta.env.VITE_API_BASE_URL
        }/book_clubs/${bookClubId}/events/${id}/attendees/${
          attendee.attendee_id
        }`,
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
    <div
      className="container-fluid"
      style={{ maxWidth: "900px", margin: "0 auto" }}
    >
      {/* Event Header Card */}
      <div className="card event-card mb-4">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h1
                className="card-title mb-2"
                style={{ fontSize: "2.2rem", fontWeight: "600" }}
              >
                📚 {eventData.attributes.event_name}
              </h1>
              <p
                className="card-text mb-2"
                style={{ fontSize: "1.1rem", opacity: "0.9" }}
              >
                <i className="fas fa-calendar-alt me-2"></i>
                {formatEventDate(eventData.attributes.event_date)}
              </p>
              <p
                className="card-text mb-2"
                style={{ fontSize: "1.1rem", opacity: "0.9" }}
              >
                <i className="fas fa-map-marker-alt me-2"></i>
                {eventData.attributes.location}
              </p>
            </div>
            {eventData.attributes.user_is_admin && (
              <Button
                onClick={() => setShowEditModal(true)}
                className="btn-secondary"
                style={{ minWidth: "120px" }}
              >
                ✏️ Edit Event
              </Button>
            )}
          </div>

          {eventData.attributes.book && (
            <div
              className="p-3 rounded-3 mb-3"
              style={{
                background:
                  "linear-gradient(135deg, var(--burgundy) 0%, var(--warm-rust) 100%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              <h5 style={{ color: "#faf7f0", marginBottom: "0.5rem" }}>
                📖 Featured Book
              </h5>
              <p
                style={{
                  color: "#faf7f0",
                  fontSize: "1.1rem",
                  marginBottom: "0",
                  fontStyle: "italic",
                }}
              >
                {eventData.attributes.book}
              </p>
            </div>
          )}

          {eventData.attributes.event_notes && (
            <div className="mt-3">
              <h6 style={{ color: "#faf7f0", marginBottom: "0.5rem" }}>
                📝 Event Notes
              </h6>
              <p
                style={{ color: "#faf7f0", opacity: "0.9", lineHeight: "1.6" }}
              >
                {eventData.attributes.event_notes}
              </p>
            </div>
          )}
        </div>
      </div>

      <EditEventModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        eventData={eventData}
        onEventUpdated={(updatedEvent) => setEventData(updatedEvent)}
      />

      {/* RSVP Status Card */}
      <div className="card mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h5 className="card-title mb-3">
                <i
                  className="fas fa-user-check me-2"
                  style={{ color: "var(--forest-green)" }}
                ></i>
                Your RSVP Status
              </h5>
              <div className="d-flex align-items-center">
                <span
                  className="badge fs-6 px-3 py-2"
                  style={{
                    backgroundColor:
                      eventData.attributes.user_is_attending === true
                        ? "var(--success-color)"
                        : eventData.attributes.user_is_attending === false
                        ? "var(--warm-rust)"
                        : "var(--info-color)",
                    color: "#faf7f0",
                  }}
                >
                  {eventData.attributes.user_is_attending === true
                    ? "✅ Attending"
                    : eventData.attributes.user_is_attending === false
                    ? "❌ Not Attending"
                    : "❓ Undecided"}
                </span>
              </div>
            </div>

            {eventData.attributes.user_is_attending !== undefined && (
              <div className="col-md-6">
                <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                  {eventData.attributes.user_is_attending !== true && (
                    <button
                      onClick={() => updateAttending(true)}
                      className="btn btn-primary"
                      style={{ minWidth: "140px" }}
                    >
                      ✅ Mark Attending
                    </button>
                  )}
                  {eventData.attributes.user_is_attending !== false && (
                    <button
                      onClick={() => updateAttending(false)}
                      className="btn btn-rust"
                      style={{ minWidth: "140px" }}
                    >
                      ❌ Can't Attend
                    </button>
                  )}
                  {eventData.attributes.user_is_attending !== null && (
                    <button
                      onClick={() => updateAttending(null)}
                      className="btn btn-secondary"
                      style={{ minWidth: "120px" }}
                    >
                      ❓ Undecided
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendees Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card h-100 attendee-card-attending">
            <div className="card-body text-center">
              <div className="display-6 mb-2">✅</div>
              <h5 className="card-title" style={{ color: "#faf7f0" }}>
                Attending
              </h5>
              <p
                className="display-4 mb-0"
                style={{ color: "#faf7f0", fontWeight: "600" }}
              >
                {attendingYes.length}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 attendee-card-not-attending">
            <div className="card-body text-center">
              <div className="display-6 mb-2">❌</div>
              <h5 className="card-title" style={{ color: "#faf7f0" }}>
                Can't Attend
              </h5>
              <p
                className="display-4 mb-0"
                style={{ color: "#faf7f0", fontWeight: "600" }}
              >
                {attendingNo.length}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 attendee-card-pending">
            <div className="card-body text-center">
              <div className="display-6 mb-2">❓</div>
              <h5 className="card-title" style={{ color: "#faf7f0" }}>
                Pending
              </h5>
              <p
                className="display-4 mb-0"
                style={{ color: "#faf7f0", fontWeight: "600" }}
              >
                {attendingUnknown.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Attendee Lists */}
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div
              className="card-header"
              style={{
                backgroundColor: "var(--success-color)",
                color: "#faf7f0",
              }}
            >
              <h5 className="mb-0">
                <i className="fas fa-check-circle me-2"></i>
                Attending ({attendingYes.length})
              </h5>
            </div>
            <div className="card-body" style={{ backgroundColor: "#faf7f0" }}>
              <div className="list-group list-group-flush">
                {attendingYes.length > 0 ? (
                  attendingYes.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="list-group-item border-0 px-0 py-2"
                      style={{ backgroundColor: "#faf7f0" }}
                    >
                      <i
                        className="fas fa-user me-2"
                        style={{ color: "var(--success-color)" }}
                      ></i>
                      {attendee.name}
                    </div>
                  ))
                ) : (
                  <div
                    className="text-center py-3"
                    style={{ color: "var(--text-secondary)", opacity: 0.7 }}
                  >
                    <i className="fas fa-inbox me-2"></i>
                    No one is attending yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div
              className="card-header"
              style={{
                backgroundColor: "var(--warm-rust)",
                color: "#faf7f0",
              }}
            >
              <h5 className="mb-0">
                <i className="fas fa-times-circle me-2"></i>
                Can't Attend ({attendingNo.length})
              </h5>
            </div>
            <div className="card-body" style={{ backgroundColor: "#faf7f0" }}>
              <div className="list-group list-group-flush">
                {attendingNo.length > 0 ? (
                  attendingNo.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="list-group-item border-0 px-0 py-2"
                      style={{ backgroundColor: "#faf7f0" }}
                    >
                      <i
                        className="fas fa-user me-2"
                        style={{ color: "var(--warm-rust)" }}
                      ></i>
                      {attendee.name}
                    </div>
                  ))
                ) : (
                  <div
                    className="text-center py-3"
                    style={{ color: "var(--text-secondary)", opacity: 0.7 }}
                  >
                    <i className="fas fa-inbox me-2"></i>
                    No one has declined yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100">
            <div
              className="card-header"
              style={{
                backgroundColor: "var(--info-color)",
                color: "#faf7f0",
              }}
            >
              <h5 className="mb-0">
                <i className="fas fa-question-circle me-2"></i>
                Pending RSVP ({attendingUnknown.length})
              </h5>
            </div>
            <div className="card-body" style={{ backgroundColor: "#faf7f0" }}>
              <div className="list-group list-group-flush">
                {attendingUnknown.length > 0 ? (
                  attendingUnknown.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="list-group-item border-0 px-0 py-2"
                      style={{ backgroundColor: "#faf7f0" }}
                    >
                      <i
                        className="fas fa-user me-2"
                        style={{ color: "var(--info-color)" }}
                      ></i>
                      {attendee.name}
                    </div>
                  ))
                ) : (
                  <div
                    className="text-center py-3"
                    style={{ color: "var(--text-secondary)", opacity: 0.7 }}
                  >
                    <i className="fas fa-inbox me-2"></i>
                    No pending responses
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
