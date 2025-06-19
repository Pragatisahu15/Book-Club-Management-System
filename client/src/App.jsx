import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
import CreateClub from "./pages/CreateClub";
import ProtectedRoute from "./components/ProtectedRoute";
import ClubList from "./components/ClubList";
import ClubDetail from "./components/ClubDetail";
import UpdateBook from "./components/UpdateBook";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["organizer", "member"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clubs" element={<ClubList />} />
        <Route path="/clubs/:id" element={<ClubDetail />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["organizer", "member"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-club"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <CreateClub />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clubs/:clubId/update-book"
          element={
            <ProtectedRoute allowedRoles={["organizer"]}>
              <UpdateBook />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
