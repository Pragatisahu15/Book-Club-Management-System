import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    role: "member",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, username, email, password } = formData;

    if (!fullName || !username || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post(
        `${baseUrl}/auth/register`,
        formData
      );
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            className="form-control"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Role</label>
          <select
            name="role"
            className="form-select"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="member">Member</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Sign Up
        </button>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
