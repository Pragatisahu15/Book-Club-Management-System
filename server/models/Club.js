const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String },
    maxCapacity: { type: Number },
    currentBook: {
      title: { type: String },
      author: { type: String },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);
