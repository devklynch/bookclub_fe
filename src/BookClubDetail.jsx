import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function BookClubDetail() {
  const { id } = useParams(); // this is the bookclub_id
  const [clubData, setClubData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClub = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.data.id;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/${userId}/book_clubs/${id}`,
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

  if (error) return <p>{error}</p>;
  if (!clubData) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2>{clubData.attributes.name}</h2>
      <p>{clubData.attributes.description}</p>
      <h4>Members</h4>
      <ul>
        {clubData.attributes.members.map((member) => (
          <li key={member.id}>
            {member.display_name} ({member.email})
          </li>
        ))}
      </ul>

      {/* You can add more details here like events, polls, etc. */}
    </div>
  );
}
export default BookClubDetail;
