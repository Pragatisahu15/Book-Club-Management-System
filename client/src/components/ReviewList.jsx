import React, { useEffect, useState } from "react";
import axios from "axios";


const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ReviewList = ({ clubId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/reviews/${clubId}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

  if (reviews.length === 0) {
    return <p className="italic text-gray-500">No reviews yet.</p>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Reviews:</h3>
      {reviews.map((rev) => (
        <div key={rev._id} className="mb-3 p-3 border rounded bg-white shadow">
          <div className="flex items-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-xl ${
                  star <= rev.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-gray-700">{rev.review}</p>
          <p className="text-sm text-gray-400">
            Posted on: {new Date(rev.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
