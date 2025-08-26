import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import CreateEventModal from "./components/CreateEventModal";
import CreatePollModal from "./components/CreatePollModal";
import EditBookClubModal from "./components/EditBookClubModal";
import InviteMembersModal from "./components/InviteMembersModal";
import axios from "axios";
import { formatEventDate, formatPollDate } from "./utils/dateUtils";

function BookClubDetail() {
  const { id } = useParams(); // this is the bookclub_id
  const [clubData, setClubData] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.data.id;

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/users/${userId}/book_clubs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClubData(response.data.data);
      } catch (err) {
        setError("Failed to fetch book club data.");
        console.error(err);
      }
    };

    fetchClub();
  }, [id]);

  const handleEventCreated = (newEvent) => {
    setClubData((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        events: [...prevData.attributes.events, newEvent],
      },
    }));
  };

  const handlePollCreated = (newPoll) => {
    setClubData((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        polls: [...prevData.attributes.polls, newPoll],
      },
    }));
  };
  const handleBookClubUpdated = (updatedClub) => {
    setClubData(updatedClub); // ✅ Replace state with updated club data
  };

  if (error) return <p>{error}</p>;
  if (!clubData) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2>{clubData.attributes.name}</h2>
      <p>{clubData.attributes.description}</p>
      {clubData.attributes.user_is_admin && (
        <Button
          variant="warning"
          className="mb-3"
          onClick={() => setShowEditModal(true)}
          style={{
            backgroundColor: "#f0ecc9",
            borderColor: "#f0ecc9",
            color: "#503d2e",
          }}
        >
          ✏️ Edit Book Club
        </Button>
      )}

      <EditBookClubModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        bookClub={clubData}
        onBookClubUpdated={handleBookClubUpdated}
      />
      <h4>Members</h4>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span>Current members: {clubData.attributes.members.length}</span>
        {clubData.attributes.user_is_admin && (
          <Button
            variant="success"
            onClick={() => setShowInviteModal(true)}
            style={{ backgroundColor: "#058789", borderColor: "#058789" }}
          >
            ✉️ Invite Members
          </Button>
        )}
      </div>
      <ul>
        {clubData.attributes.members.map((member) => (
          <li key={member.id}>
            {member.display_name} ({member.email})
          </li>
        ))}
      </ul>
      <h4>Events</h4>
      <ul>
        {clubData.attributes.events.map((event) => (
          <li key={event.id}>
            <Link
              to={`/book_clubs/${id}/event/${event.id}`}
              style={{ color: "#058789" }}
            >
              {event.event_name} ({formatEventDate(event.event_date)}) (
              {event.book})
            </Link>
          </li>
        ))}
      </ul>
      {clubData.attributes.user_is_admin && (
        <Button
          variant="primary"
          onClick={() => setShowEventModal(true)}
          style={{ backgroundColor: "#058789", borderColor: "#058789" }}
        >
          Create New Event
        </Button>
      )}

      <CreateEventModal
        show={showEventModal}
        handleClose={() => setShowEventModal(false)}
        bookClubId={id}
        onEventCreated={handleEventCreated}
      />
      <h4>Polls</h4>
      <ul>
        {clubData.attributes.polls.map((poll) => (
          <li key={poll.id}>
            <Link to={`/poll/${poll.id}`} style={{ color: "#058789" }}>
              {poll.poll_question} ({formatPollDate(poll.expiration_date)})
            </Link>
          </li>
        ))}
      </ul>
      {clubData.attributes.user_is_admin && (
        <Button
          variant="primary"
          onClick={() => setShowPollModal(true)}
          style={{ backgroundColor: "#058789", borderColor: "#058789" }}
        >
          Create New Poll
        </Button>
      )}

      <CreatePollModal
        show={showPollModal}
        handleClose={() => setShowPollModal(false)}
        bookClubId={id}
        onPollCreated={handlePollCreated}
      />

      <InviteMembersModal
        show={showInviteModal}
        onHide={() => setShowInviteModal(false)}
        bookClubId={id}
        onInvitationSent={() => {
          // Optionally refresh the book club data to show new members
          // For now, we'll just close the modal
        }}
      />
    </div>
  );
}
export default BookClubDetail;
