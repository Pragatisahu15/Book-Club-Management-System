import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaStar, FaRegStar } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function ClubDetail() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [newRating, setNewRating] = useState("");
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${baseUrl}/clubs/${id}`)
      .then((res) => setClub(res.data))
      .catch((err) => console.error("Error fetching club details:", err));

    axios
      .get(`${baseUrl}/reviews/${id}`)
      .then((res) => {
        setReviews(res.data);
        if (res.data.length > 0) {
          const total = res.data.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          setAverageRating((total / res.data.length).toFixed(1));
        }
      })
      .catch((err) => console.error("Error fetching reviews:", err));

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [id]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    axios
      .post(
        `${baseUrl}/reviews`,
        {
          clubId: id,
          rating: Number(newRating),
          comment: newComment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setMessage("Review submitted!");
        setNewRating("");
        setNewComment("");
        return axios.get(`${baseUrl}/reviews/${id}`);
      })
      .then((res) => {
        setReviews(res.data);
        if (res.data.length > 0) {
          const total = res.data.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          setAverageRating((total / res.data.length).toFixed(1));
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to submit review");
      });
  };

  if (!club)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );

  return (
    <div className="container my-5">
      <div className="card shadow p-4">
        <h2 className="mb-3 text-primary">{club.name}</h2>
        <p>
          <strong>Description:</strong> {club.description}
        </p>
        <p>
          <strong>Category:</strong> {club.category}
        </p>
        <p>
          <strong>Organizer:</strong> {club.organizer?.username || "N/A"}
        </p>
        <p>
          <strong>Current Book:</strong> {club.currentBook?.title || "None"}
        </p>
        {club.currentBook?.author && (
          <p>
            <strong>Author:</strong> {club.currentBook.author}
          </p>
        )}
        <p>
          <strong>Open Spots:</strong> {club.maxCapacity - club.members.length}
        </p>

        {message && <div className="alert alert-info">{message}</div>}

        <hr />

        <h4>Average Rating</h4>
        {averageRating ? (
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="me-1">
                {star <= Math.round(averageRating) ? (
                  <FaStar color="gold" />
                ) : (
                  <FaRegStar color="gray" />
                )}
              </span>
            ))}
            <span className="ms-2">({averageRating})</span>
          </div>
        ) : (
          <p className="text-muted">No ratings yet</p>
        )}

        <h4>Reviews</h4>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="list-group mb-4">
            {reviews.map((review) => (
              <li key={review._id} className="list-group-item">
                <strong>{review.user?.username || "User"}:</strong>{" "}
                {review.comment}
                <br />
                <span>Rating: {review.rating} ★</span>
              </li>
            ))}
          </ul>
        )}

        {user?.role === "member" && (
          <div className="mt-4">
            <h4>Leave a Review</h4>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label">Rating (1-5):</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="form-control"
                  value={newRating}
                  onChange={(e) => setNewRating(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Comment:</label>
                <textarea
                  className="form-control"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubDetail;
