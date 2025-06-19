const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/authMiddleware");

// Updated controller function name:
router.post("/", verifyToken, reviewController.createOrUpdateReview);

// Get all reviews for a club
router.get("/:clubId", reviewController.getClubReviews);

// Get average rating for a club
router.get("/:clubId/average", reviewController.getAverageRating);

module.exports = router;
