import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import EditPollModal from "./components/EditPollModal";
import axios from "axios";

function PollDetail() {
  const { id } = useParams();
  const [pollData, setPollData] = useState(null);
  const [userVotes, setUserVotes] = useState([]);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.data.id;

  const fetchPoll = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/users/${userId}/polls/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPollData(response.data.data);
      setUserVotes(response.data.data.attributes.user_votes);
    } catch (err) {
      setError("Failed to fetch poll data.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!pollData) return <p>Loading...</p>;

  const hasVoted = (optionId) => {
    return userVotes.find((vote) => vote.option_id === optionId);
  };

  const handleVote = async (optionId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/users/${userId}/polls/${pollData.id}/options/${optionId}/votes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new vote to state
      const newVote = { option_id: optionId, vote_id: response.data.id };
      setUserVotes([...userVotes, newVote]);
      await fetchPoll();
    } catch (err) {
      console.error("Failed to vote:", err);
    }
  };

  const handleRemoveVote = async (optionId, voteId) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/v1/users/${userId}/polls/${pollData.id}/options/${optionId}/votes/${voteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the vote from state
      setUserVotes(userVotes.filter((v) => v.option_id !== optionId));
      await fetchPoll();
    } catch (err) {
      console.error("Failed to remove vote:", err);
    }
  };

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
    <div className="p-4">
      <h2>{pollData.attributes.poll_question}</h2>
      <p>{pollData.attributes.book_club_name}</p>
      <p>
        <strong>Expires:</strong>{" "}
        {formatExpirationDate(pollData.attributes.expiration_date)}
      </p>
      {pollData.attributes.multiple_votes ? (
        <p className="text-green-600 font-semibold">
          Can vote for multiple options
        </p>
      ) : (
        <p className="text-red-600 font-semibold">Can only vote once</p>
      )}
      <Button
        variant="warning"
        onClick={() => setShowEditModal(true)}
        className="mb-3"
      >
        Edit Poll
      </Button>
      <h4>Options</h4>
      <ul>
        {pollData.attributes.options.map((option) => {
          const userVote = hasVoted(option.id);

          return (
            <li key={option.id}>
              {option.option_text} - Votes: {option.votes_count}{" "}
              {userVote ? (
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm ml-2"
                  onClick={() => handleRemoveVote(option.id, userVote.vote_id)}
                >
                  Remove Vote
                </button>
              ) : (
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm ml-2"
                  onClick={() => handleVote(option.id)}
                >
                  Vote
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <EditPollModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        pollData={pollData}
        onPollUpdated={(updatedData) => {
          setPollData(updatedData);
          setUserVotes(updatedData.attributes.user_votes || []);
        }}
      />
    </div>
  );
}

export default PollDetail;
