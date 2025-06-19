import React, { useState } from "react";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const ReviewForm = ({ clubId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const token = localStorage.getItem("token");

  const submitReview = async () => {
    try {
      await axios.post(
        `${baseUrl}/reviews/${clubId}`,
        {
          rating,
          comment: review,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRating(0);
      setReview("");
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review", error);
      alert("Failed to submit review");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md mb-4">
      <h3 className="text-lg font-semibold mb-2">Leave a Review:</h3>
      <div className="flex items-center mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${
              star <= rating ? "text-yellow-400" : "text-gray-400"
            }`}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        rows="3"
        placeholder="Write your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      ></textarea>
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={submitReview}
        disabled={rating === 0}
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewForm;
