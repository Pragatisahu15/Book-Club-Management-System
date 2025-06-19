import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ClubSearch from "./ClubSearch";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function ClubList() {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [averageRatings, setAverageRatings] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchOrganizer, setSearchOrganizer] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed) {
          if (!parsed._id && parsed.id) parsed._id = parsed.id;
          setUser(parsed);
        }
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get(`${baseUrl}/clubs/all`);
        setClubs(res.data);
        setFilteredClubs(res.data);
        fetchRatings(res.data);
      } catch (err) {
        setError("Failed to load clubs");
      } finally {
        setLoading(false);
      }
    };

    const fetchRatings = async (clubsData) => {
      try {
        const ratingsData = {};
        for (const club of clubsData) {
          const res = await axios.get(
            `${baseUrl}/reviews/${club._id}`
          );
          const reviews = res.data;
          if (reviews.length > 0) {
            const total = reviews.reduce((sum, r) => sum + r.rating, 0);
            ratingsData[club._id] = (total / reviews.length).toFixed(1);
          } else {
            ratingsData[club._id] = null;
          }
        }
        setAverageRatings(ratingsData);
      } catch (error) {
        console.error("Error fetching ratings", error);
      }
    };

    fetchClubs();
  }, []);

  const handleJoin = async (clubId) => {
    try {
      const res = await axios.post(
        `${baseUrl}/clubs/join/${clubId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.msg || "Successfully joined the club!");

      const updatedClub = res.data.club;

      setClubs((prev) =>
        prev.map((club) => (club._id === updatedClub._id ? updatedClub : club))
      );
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to join club");
    }
  };

  const handleLeave = async (clubId) => {
    try {
      const res = await axios.post(
        `${baseUrl}/clubs/leave/${clubId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.msg || "You have left the club.");

      const updatedClub = res.data.club;

      setClubs((prev) =>
        prev.map((club) => (club._id === updatedClub._id ? updatedClub : club))
      );
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to leave club");
    }
  };

  const handleCardClick = (id) => {
    navigate(`/clubs/${id}`);
  };

  useEffect(() => {
    const filtered = clubs.filter((club) => {
      const name = club?.name?.toLowerCase() || "";
      const category = club?.category?.toLowerCase() || "";
      const organizer = club?.organizer?.username?.toLowerCase() || "";

      return (
        name.includes(searchName.toLowerCase()) &&
        category.includes(searchCategory.toLowerCase()) &&
        organizer.includes(searchOrganizer.toLowerCase())
      );
    });

    setFilteredClubs(filtered);
  }, [searchName, searchCategory, searchOrganizer, clubs]);

  if (loading) return <p>Loading clubs...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Book Clubs</h2>

      <ClubSearch
        searchName={searchName}
        setSearchName={setSearchName}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
        searchOrganizer={searchOrganizer}
        setSearchOrganizer={setSearchOrganizer}
      />

      <div className="row">
        {filteredClubs.map((club) => {
          const openSpots = club.maxCapacity - club.members.length;

          const isMember =
            user && Array.isArray(club.members)
              ? club.members.some(
                  (m) =>
                    (typeof m === "object" ? m._id : m)?.toString() ===
                    user._id?.toString()
                )
              : false;

          const avgRating = averageRatings[club._id];

          return (
            <div className="col-md-4 mb-4" key={club._id}>
              <div className="card h-100">
                <div
                  onClick={() => handleCardClick(club._id)}
                  style={{ cursor: "pointer" }}
                >
                  {club.coverImage && (
                    <img
                      src={club.coverImage}
                      alt={club.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{club.name}</h5>
                    <p className="card-text">
                      {club.description.length > 100
                        ? club.description.slice(0, 100) + "..."
                        : club.description}
                    </p>
                    <p>
                      <strong>Category:</strong> {club.category}
                    </p>
                    <p>
                      <strong>Open Spots:</strong> {openSpots}
                    </p>
                    <p>
                      <strong>Organizer:</strong>{" "}
                      {club.organizer?.username || "N/A"}
                    </p>
                    <div className="mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`mx-1 ${
                            star <= Math.round(avgRating || 0)
                              ? "text-warning"
                              : "text-secondary"
                          }`}
                          style={{ fontSize: "1.5rem" }}
                        >
                          ★
                        </span>
                      ))}
                      {!avgRating && (
                        <span className="text-muted">No ratings yet</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card-footer text-center">
                  {user?.role === "member" &&
                    (isMember ? (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleLeave(club._id)}
                      >
                        Leave Club
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        disabled={openSpots <= 0}
                        onClick={() => handleJoin(club._id)}
                      >
                        {openSpots <= 0 ? "Club Full" : "Join Club"}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ClubList;
