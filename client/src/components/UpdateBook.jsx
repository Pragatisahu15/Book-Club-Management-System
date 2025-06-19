import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function UpdateBook() {
  const { clubId } = useParams(); // clubId will come from URL param
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(
        `${baseUrl}/clubs/${clubId}/update-book`,
        { title, author },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Current book updated successfully!");
      navigate("/dashboard"); // after success go back to dashboard
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to update book");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Current Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Book Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Author Name</label>
          <input
            type="text"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Update Book
        </button>
      </form>
    </div>
  );
}

export default UpdateBook;
