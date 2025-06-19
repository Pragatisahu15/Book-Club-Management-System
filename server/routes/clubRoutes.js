const express = require("express");
const router = express.Router();

const {
  createClub,
  getOrganizerClubs,
  getAllClubs,
  joinClub,
  leaveClub,
  updateCurrentBook,
  getClubById,
  getJoinedClubs,
} = require("../controllers/clubController");

const {
  verifyToken,
  authorizeRoles,
  authenticate,
} = require("../middleware/authMiddleware"); // ✅ SINGLE LINE

// Organizer routes
router.post("/create", verifyToken, authorizeRoles("organizer"), createClub);
router.get(
  "/my-clubs",
  verifyToken,
  authorizeRoles("organizer"),
  getOrganizerClubs
);
router.patch(
  "/:clubId/update-book",
  verifyToken,
  authorizeRoles("organizer"),
  updateCurrentBook
);

// Member & public routes
router.get("/all", getAllClubs);
router.get("/:id", getClubById);
router.post("/join/:id", verifyToken, authorizeRoles("member"), joinClub);
router.post("/leave/:id", verifyToken, authorizeRoles("member"), leaveClub);

//  Member joined clubs
router.get(
  "/member/clubs",
  verifyToken,
  authorizeRoles("member"),
  getJoinedClubs
);

module.exports = router;
