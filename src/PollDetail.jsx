import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import EditPollModal from "./components/EditPollModal";
import axios from "axios";
import { formatPollDate } from "./utils/dateUtils";

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
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/polls/${id}`,
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
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/polls/${
          pollData.id
        }/options/${optionId}/votes`,
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
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to vote. Please try again.");
      }
      console.error("Failed to vote:", err);
    }
  };

  const handleRemoveVote = async (optionId, voteId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/polls/${
          pollData.id
        }/options/${optionId}/votes/${voteId}`,
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
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to remove vote. Please try again.");
      }
      console.error("Failed to remove vote:", err);
    }
  };

  // Calculate total votes for percentage calculations
  const totalVotes = pollData.attributes.options.reduce(
    (sum, option) => sum + option.votes_count,
    0
  );

  return (
    <div
      className="container-fluid poll-detail-container"
      style={{ maxWidth: "900px", padding: "2rem" }}
    >
      {/* Display error messages */}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show mb-4"
          role="alert"
          style={{
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 4px 12px rgba(139, 69, 19, 0.2)",
          }}
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Poll Header Card */}
      <div
        className="card poll-card mb-4"
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative corner accents */}
        <div
          className="poll-header-decoration"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "60px",
            height: "20px",
            background:
              "linear-gradient(135deg, var(--golden-amber) 0%, var(--warm-rust) 100%)",
            borderRadius: "0 0 20px 0",
            opacity: "0.8",
          }}
        />
        <div
          className="poll-header-decoration"
          style={{
            position: "absolute",
            bottom: "0",
            right: "0",
            width: "60px",
            height: "20px",
            background:
              "linear-gradient(135deg, var(--warm-rust) 0%, var(--golden-amber) 100%)",
            borderRadius: "20px 0 0 0",
            opacity: "0.8",
            animationDelay: "1.5s",
          }}
        />

        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div className="flex-grow-1">
              <h1
                className="mb-3"
                style={{
                  color: "#faf7f0",
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontWeight: "600",
                  fontSize: "2.2rem",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  lineHeight: "1.3",
                }}
              >
                🗳️ {pollData.attributes.poll_question}
              </h1>
              <div className="d-flex flex-wrap gap-3 mb-3">
                <div
                  className="badge"
                  style={{
                    backgroundColor: "rgba(250, 247, 240, 0.2)",
                    color: "#faf7f0",
                    fontSize: "0.9rem",
                    padding: "8px 12px",
                    borderRadius: "20px",
                    fontWeight: "500",
                  }}
                >
                  📚 {pollData.attributes.book_club_name}
                </div>
                <div
                  className="badge"
                  style={{
                    backgroundColor: pollData.attributes.expired
                      ? "rgba(139, 69, 19, 0.3)"
                      : "rgba(45, 80, 22, 0.3)",
                    color: "#faf7f0",
                    fontSize: "0.9rem",
                    padding: "8px 12px",
                    borderRadius: "20px",
                    fontWeight: "500",
                  }}
                >
                  {pollData.attributes.expired ? "⏰ Expired" : "🕐 Active"}
                </div>
              </div>
              <div className="mb-3">
                <div
                  style={{
                    color: "#faf7f0",
                    fontSize: "1rem",
                    opacity: "0.9",
                  }}
                >
                  <strong>Expires:</strong>{" "}
                  {formatPollDate(pollData.attributes.expiration_date)}
                </div>
              </div>
            </div>

            {pollData.attributes.user_is_admin && (
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(true)}
                style={{
                  backgroundColor: "rgba(250, 247, 240, 0.2)",
                  borderColor: "rgba(250, 247, 240, 0.3)",
                  color: "#faf7f0",
                  borderRadius: "10px",
                  padding: "8px 16px",
                  fontWeight: "500",
                  backdropFilter: "blur(10px)",
                }}
              >
                ✏️ Edit Poll
              </Button>
            )}
          </div>

          {/* Voting Rules */}
          <div
            className="alert mb-0"
            style={{
              backgroundColor: "rgba(250, 247, 240, 0.15)",
              border: "1px solid rgba(250, 247, 240, 0.3)",
              borderRadius: "10px",
              color: "#faf7f0",
              padding: "12px 16px",
            }}
          >
            {pollData.attributes.multiple_votes ? (
              <span>✅ You can vote for multiple options</span>
            ) : (
              <span>🎯 You can only vote for one option</span>
            )}
            {totalVotes > 0 && (
              <span className="ms-3">
                📊 {totalVotes} total vote{totalVotes !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Show expired poll message */}
      {pollData.attributes.expired && (
        <div
          className="alert alert-warning mb-4"
          style={{
            borderRadius: "12px",
            border: "none",
            backgroundColor: "var(--warning-color)",
            color: "var(--dark-color)",
            boxShadow: "0 4px 12px rgba(218, 165, 32, 0.3)",
            fontSize: "1.1rem",
            fontWeight: "500",
          }}
        >
          <strong>
            ⚠️ This poll has expired and is no longer accepting votes.
          </strong>
        </div>
      )}

      {/* Voting Options */}
      <div className="mb-4">
        <h3
          className="mb-4"
          style={{
            color: "var(--primary-text)",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontWeight: "600",
            fontSize: "1.8rem",
          }}
        >
          Voting Options
        </h3>

        <div className="row g-3">
          {pollData.attributes.options.map((option, index) => {
            const userVote = hasVoted(option.id);
            const percentage =
              totalVotes > 0 ? (option.votes_count / totalVotes) * 100 : 0;

            return (
              <div key={option.id} className="col-12">
                <div
                  className="card h-100 poll-option-card"
                  style={{
                    borderRadius: "15px",
                    border: userVote
                      ? "2px solid var(--forest-green)"
                      : "1px solid var(--border-color)",
                    background: userVote
                      ? "linear-gradient(135deg, rgba(45, 80, 22, 0.1) 0%, rgba(135, 169, 107, 0.1) 100%)"
                      : "var(--card-bg)",
                    boxShadow: userVote
                      ? "0 6px 20px rgba(45, 80, 22, 0.2)"
                      : "0 4px 12px rgba(61, 47, 42, 0.1)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Progress bar background */}
                  {totalVotes > 0 && (
                    <div
                      className="poll-progress-bar"
                      style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        width: `${percentage}%`,
                        height: "100%",
                        background: userVote
                          ? "linear-gradient(135deg, rgba(45, 80, 22, 0.15) 0%, rgba(135, 169, 107, 0.15) 100%)"
                          : "linear-gradient(135deg, rgba(160, 120, 90, 0.1) 0%, rgba(212, 196, 176, 0.1) 100%)",
                        borderRadius: "15px",
                        transition: "width 0.6s ease",
                      }}
                    />
                  )}

                  <div className="card-body p-4 position-relative">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1">
                        <h5
                          className="mb-2"
                          style={{
                            color: "var(--primary-text)",
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                            fontWeight: "500",
                            fontSize: "1.2rem",
                          }}
                        >
                          {String.fromCharCode(65 + index)}.{" "}
                          {option.option_text}
                        </h5>
                        <div className="d-flex align-items-center gap-3">
                          <span
                            style={{
                              color: "var(--text-secondary)",
                              fontSize: "0.95rem",
                              fontWeight: "500",
                            }}
                          >
                            {option.votes_count} vote
                            {option.votes_count !== 1 ? "s" : ""}
                          </span>
                          {totalVotes > 0 && (
                            <span
                              style={{
                                color: "var(--accent-color)",
                                fontSize: "0.9rem",
                                fontWeight: "600",
                              }}
                            >
                              {percentage.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ms-3">
                        {userVote ? (
                          <button
                            className="btn poll-vote-button"
                            style={{
                              backgroundColor: pollData.attributes.expired
                                ? "#cccccc"
                                : "var(--sage-green)",
                              borderColor: pollData.attributes.expired
                                ? "#cccccc"
                                : "var(--sage-green)",
                              color: pollData.attributes.expired
                                ? "#666666"
                                : "#faf7f0",
                              cursor: pollData.attributes.expired
                                ? "not-allowed"
                                : "pointer",
                              borderRadius: "10px",
                              padding: "8px 16px",
                              fontWeight: "500",
                              transition: "all 0.3s ease",
                              boxShadow: pollData.attributes.expired
                                ? "none"
                                : "0 2px 8px rgba(135, 169, 107, 0.3)",
                            }}
                            onClick={() =>
                              handleRemoveVote(option.id, userVote.vote_id)
                            }
                            disabled={pollData.attributes.expired}
                            title={
                              pollData.attributes.expired
                                ? "Cannot remove votes from expired poll"
                                : "Remove your vote"
                            }
                          >
                            ✓ Voted
                          </button>
                        ) : (
                          (() => {
                            // Check if user has voted for any option in single-vote poll
                            const hasVotedAnywhere = userVotes.length > 0;
                            const isDisabled =
                              pollData.attributes.expired ||
                              (!pollData.attributes.multiple_votes &&
                                hasVotedAnywhere);

                            let buttonText = "🗳️ Vote";
                            let buttonTitle = "Vote for this option";
                            let buttonColor = "var(--forest-green)";

                            if (pollData.attributes.expired) {
                              buttonText = "⏰ Expired";
                              buttonTitle = "This poll has expired";
                              buttonColor = "#cccccc";
                            } else if (
                              !pollData.attributes.multiple_votes &&
                              hasVotedAnywhere
                            ) {
                              buttonText = "🚫 Can't Vote";
                              buttonTitle =
                                "You can only vote for one option. Remove your current vote to vote for this option.";
                              buttonColor = "#8b4513"; // Saddle brown from the design system
                            }

                            return (
                              <button
                                className="btn poll-vote-button"
                                style={{
                                  backgroundColor: isDisabled
                                    ? buttonColor
                                    : "var(--forest-green)",
                                  borderColor: isDisabled
                                    ? buttonColor
                                    : "var(--forest-green)",
                                  color: isDisabled
                                    ? pollData.attributes.expired
                                      ? "#666666"
                                      : "#faf7f0"
                                    : "#faf7f0",
                                  cursor: isDisabled
                                    ? "not-allowed"
                                    : "pointer",
                                  borderRadius: "10px",
                                  padding: "8px 16px",
                                  fontWeight: "500",
                                  transition: "all 0.3s ease",
                                  boxShadow: isDisabled
                                    ? "none"
                                    : "0 2px 8px rgba(45, 80, 22, 0.3)",
                                  opacity: isDisabled ? 0.7 : 1,
                                }}
                                onClick={() => handleVote(option.id)}
                                disabled={isDisabled}
                                title={buttonTitle}
                                onMouseEnter={(e) => {
                                  if (!isDisabled) {
                                    e.target.style.transform =
                                      "translateY(-1px)";
                                    e.target.style.boxShadow =
                                      "0 4px 12px rgba(45, 80, 22, 0.4)";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isDisabled) {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow =
                                      "0 2px 8px rgba(45, 80, 22, 0.3)";
                                  }
                                }}
                              >
                                {buttonText}
                              </button>
                            );
                          })()
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button
          variant="outline-secondary"
          href="/polls"
          style={{
            borderColor: "var(--accent-color)",
            color: "var(--accent-color)",
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: "500",
            transition: "all 0.3s ease",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "var(--accent-color)";
            e.target.style.color = "#faf7f0";
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 4px 12px rgba(160, 120, 90, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "var(--accent-color)";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          ← Back to All Polls
        </Button>

        <Button
          variant="outline-primary"
          href="/dashboard"
          style={{
            borderColor: "var(--forest-green)",
            color: "var(--forest-green)",
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: "500",
            transition: "all 0.3s ease",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.target.style.background =
              "linear-gradient(135deg, var(--forest-green) 0%, var(--sage-green) 100%)";
            e.target.style.color = "#faf7f0";
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 4px 12px rgba(45, 80, 22, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "var(--forest-green)";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          🏠 Dashboard
        </Button>
      </div>

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
