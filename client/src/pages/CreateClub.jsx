import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function CreateClub() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    coverImage: "",
    maxCapacity: "",
    currentBookTitle: "",
    currentBookAuthor: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clubData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      coverImage: formData.coverImage,
      maxCapacity: parseInt(formData.maxCapacity),
      currentBook: {
        title: formData.currentBookTitle,
        author: formData.currentBookAuthor,
      },
    };

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${baseUrl}/clubs/create`,
        clubData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.msg || "Club created!");
      setFormData({
        name: "",
        description: "",
        category: "",
        coverImage: "",
        maxCapacity: "",
        currentBookTitle: "",
        currentBookAuthor: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to create club");
      console.error("Create Club Error:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create a New Book Club</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label>Club Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="form-control"
          ></textarea>
        </div>

        <div className="mb-3">
          <label>Category (Genre)</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Cover Image URL</label>
          <input
            type="text"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Maximum Member Capacity</label>
          <input
            type="number"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Current Book Title</label>
          <input
            type="text"
            name="currentBookTitle"
            value={formData.currentBookTitle}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label>Current Book Author</label>
          <input
            type="text"
            name="currentBookAuthor"
            value={formData.currentBookAuthor}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Club
        </button>
      </form>
    </div>
  );
}

export default CreateClub;
