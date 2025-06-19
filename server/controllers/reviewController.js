const mongoose = require("mongoose");
const Review = require("../models/Review");
const Club = require("../models/Club");

exports.createOrUpdateReview = async (req, res) => {
  try {
    const { clubId, rating, comment } = req.body;
    const userId = req.user._id;

    const clubObjectId = new mongoose.Types.ObjectId(clubId);

    const existingReview = await Review.findOne({
      clubId: clubObjectId,
      userId,
    });

    if (existingReview) {
      // If review exists, update it
      existingReview.rating = rating;
      existingReview.comment = comment;

      await existingReview.save();

      return res
        .status(200)
        .json({
          message: "Review updated successfully",
          review: existingReview,
        });
    }

    // Else create new review
    const review = new Review({
      clubId: clubObjectId,
      userId,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a club
exports.getClubReviews = async (req, res) => {
  try {
    const { clubId } = req.params;

    const reviews = await Review.find({ clubId }).populate(
      "userId",
      "username"
    );

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get average rating for a club
exports.getAverageRating = async (req, res) => {
  try {
    const { clubId } = req.params;

    const result = await Review.aggregate([
      { $match: { clubId: new mongoose.Types.ObjectId(clubId) } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    const avgRating = result.length > 0 ? result[0].avgRating : 0;

    res.status(200).json({ avgRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
