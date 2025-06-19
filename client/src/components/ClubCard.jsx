import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ClubCard = ({ club }) => {
  const [averageRating, setAverageRating] = useState(null);

  useEffect(() => {
    fetchAverageRating();
  }, []);

  const fetchAverageRating = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/reviews/${club._id}`
      );
      const reviews = res.data;
      if (reviews.length > 0) {
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        setAverageRating((total / reviews.length).toFixed(1));
      } else {
        setAverageRating(null);
      }
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

  return (
    <div className="border rounded p-4 shadow bg-white">
      <h2 className="text-xl font-bold mb-2">{club.name}</h2>
      <p className="mb-2">{club.description}</p>

      <div className="flex items-center mb-2">
        {averageRating ? (
          <>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-xl ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({averageRating})
            </span>
          </>
        ) : (
          <span className="italic text-sm text-gray-500">No ratings yet</span>
        )}
      </div>

      <Link to={`/clubs/${club._id}`} className="text-blue-500 hover:underline">
        View Details
      </Link>
    </div>
  );
};

export default ClubCard;
