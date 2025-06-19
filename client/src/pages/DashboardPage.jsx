import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaBook,
  FaPlus,
  FaSignOutAlt,
  FaBookOpen,
  FaUsers,
  FaLayerGroup,
} from "react-icons/fa";
import { MdLibraryBooks } from "react-icons/md";
import { BiSolidEditAlt } from "react-icons/bi";
import { GiPartyPopper } from "react-icons/gi";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myClubs, setMyClubs] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "organizer" || user?.role === "member") {
      fetchMyClubs();
    }
  }, [user]);

  const fetchMyClubs = async () => {
    try {
      const token = localStorage.getItem("token");
      const url =
        user?.role === "organizer"
          ? `${baseUrl}/clubs/my-clubs`
          : `${baseUrl}/clubs/member/clubs`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMyClubs(res.data);
    } catch (err) {
      console.error("Error fetching clubs", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleUpdateBook = (clubId) => {
    navigate(`/clubs/${clubId}/update-book`);
  };

  return (
    <div className="container py-5">
      <div className="mb-4 text-center">
        <h2 className="fw-bold mb-3">
          <MdLibraryBooks className="me-2" size={30} />
          Welcome to Book Club Dashboard!
        </h2>
        <p className="lead">
          You’re now logged in{" "}
          <GiPartyPopper className="ms-2 text-warning" size={24} />
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Link to="/clubs">
            <button className="btn btn-primary">
              <FaBookOpen className="me-2" /> View All Clubs
            </button>
          </Link>
          <button className="btn btn-danger" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>
      </div>

      {/*  Member Section */}
      {user?.role === "member" && (
        <>
          <h3 className="fw-bold mb-3 mt-5">
            <FaLayerGroup className="me-2" />
            Clubs You Have Joined
          </h3>
          {myClubs.length === 0 ? (
            <p className="text-muted">You have not joined any clubs yet.</p>
          ) : (
            <div className="row">
              {myClubs.map((club) => (
                <div className="col-md-4 mb-4" key={club._id}>
                  <div className="card h-100 shadow-sm">
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
                      <p className="card-text">{club.description}</p>
                      <p>
                        <strong>Category:</strong> {club.category}
                      </p>
                      <p>
                        <strong>Organizer:</strong>{" "}
                        {club.organizer?.username || "Unknown"}
                      </p>
                      <p>
                        <strong>Open Spots:</strong>{" "}
                        {club.maxCapacity - club.members.length}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/*  Organizer Section */}
      {user?.role === "organizer" && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
            <h3 className="fw-bold">
              <FaLayerGroup className="me-2" />
              My Managed Book Clubs
            </h3>
            <button
              className="btn btn-success"
              onClick={() => navigate("/create-club")}
            >
              <FaPlus className="me-2" /> Create New Club
            </button>
          </div>

          {myClubs.length === 0 ? (
            <p className="text-muted">You are not managing any clubs yet.</p>
          ) : (
            <div className="row">
              {myClubs.map((club) => (
                <div className="col-md-4 mb-4" key={club._id}>
                  <div className="card h-100 shadow-sm">
                    {club.coverImage && (
                      <img
                        src={club.coverImage}
                        alt="cover"
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title fw-bold">
                        <FaBook className="me-2" />
                        {club.name}
                      </h5>
                      <p className="card-text">{club.description}</p>
                      <p>
                        <strong>Category:</strong> {club.category}
                      </p>
                      <p>
                        <strong>Current Book:</strong>{" "}
                        {club.currentBook?.title || "No book selected"}
                      </p>
                      <p>
                        <FaUsers className="me-2" /> Members Joined:{" "}
                        {club.members.length}
                      </p>
                      <p>
                        Open Spots: {club.maxCapacity - club.members.length}
                      </p>

                      <div className="d-grid">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleUpdateBook(club._id)}
                        >
                          <BiSolidEditAlt className="me-2" /> Update Current
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardPage;
