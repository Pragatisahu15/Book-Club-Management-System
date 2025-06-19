const Club = require("../models/Club");
const User = require("../models/User"); // Assuming User model is needed for populating or future use.
// If not explicitly needed for the current logic, it's fine to keep for completeness.

//  Organizer creates a club
exports.createClub = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      coverImage,
      maxCapacity,
      currentBook,
    } = req.body;

    const newClub = new Club({
      name,
      description,
      category,
      coverImage,
      maxCapacity,
      currentBook,
      organizer: req.user._id,
    });

    await newClub.save();
    res.status(201).json({ msg: "Club created successfully", club: newClub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

//  Organizer views only their created clubs
exports.getOrganizerClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ organizer: req.user._id });
    res.status(200).json(clubs);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

//  Guest or Member views all clubs (with optional filters)
exports.getAllClubs = async (req, res) => {
  try {
    const { name, category, organizer } = req.query;
    const filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (organizer) {
      const organizerUser = await User.findOne({
        username: { $regex: organizer, $options: "i" },
        role: "organizer",
      });

      if (organizerUser) {
        filter.organizer = organizerUser._id;
      } else {
        return res.json([]); // No match found
      }
    }

    // Ensure 'username' is used for user display, assuming User model has a username field
    const clubs = await Club.find(filter)
      .populate("organizer", "username")
      .populate("members", "_id");
    res.json(clubs);
  } catch (error) {
    console.error(" Error fetching clubs:", error);
    res
      .status(500)
      .json({ msg: "Failed to fetch clubs", error: error.message });
  }
};

//  Get single club details
exports.getClubById = async (req, res) => {
  try {
    // Populate 'organizer' with just the username
    const club = await Club.findById(req.params.id).populate(
      "organizer",
      "username"
    );
    if (!club) {
      return res.status(404).json({ msg: "Club not found" });
    }
    res.json(club);
  } catch (error) {
    console.error(" Error fetching club by ID:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

//  Member joins a club
exports.joinClub = async (req, res) => {
  const clubId = req.params.id;
  const userId = req.user._id;

  try {
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ msg: "Club not found" });
    }

    // Convert ObjectIds to string for safe comparison
    const memberIdsAsString = club.members
      .filter((memberId) => memberId != null)
      .map((memberId) => memberId.toString());

    if (memberIdsAsString.includes(userId.toString())) {
      return res.status(400).json({ msg: "You have already joined this club" });
    }

    if (club.members.length >= club.maxCapacity) {
      return res.status(400).json({ msg: "No spots left in this club" });
    }

    club.members.push(userId); // Mongoose handles ObjectId
    await club.save();

    res.status(200).json({ msg: " Joined club successfully", club });
  } catch (err) {
    console.error(" Join Club Error:");
    res.status(500).json({ msg: "Failed to join club", error: err.message });
  }
};

exports.leaveClub = async (req, res) => {
  const clubId = req.params.id;
  const userId = req.user._id.toString();

  try {
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ msg: "Club not found" });
    }

    const membersBefore = club.members.map((member) =>
      typeof member === "object" && member !== null && member._id
        ? member._id.toString()
        : member.toString()
    );

    const updatedMembers = club.members.filter(
      (member) => (member?._id?.toString?.() || member?.toString?.()) !== userId
    );

    if (updatedMembers.length === club.members.length) {
      return res.status(400).json({ msg: "You are not a member of this club" });
    }

    club.members = updatedMembers;
    await club.save();

    res.status(200).json({ msg: " You have successfully left the club", club });
  } catch (err) {
    console.error(" Leave Club Error:", err);
    res.status(500).json({ msg: "Failed to leave club", error: err.message });
  }
};

//  Organizer updates current book
exports.updateCurrentBook = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { title, author } = req.body;

    const club = await Club.findOne({ _id: clubId, organizer: req.user._id });

    if (!club) {
      return res.status(404).json({ msg: "Club not found or unauthorized" });
    }

    club.currentBook = { title, author };
    await club.save();

    res.json({
      msg: "Current book updated successfully",
      currentBook: club.currentBook,
    });
  } catch (err) {
    console.error(" Update Book Error:", err);
    res
      .status(500)
      .json({ msg: "Failed to update current book", error: err.message });
  }
};

// route to fetch joined clubs
exports.getJoinedClubs = async (req, res) => {
  try {
    const userId = req.user._id;
    const clubs = await Club.find({ members: userId }).populate(
      "organizer",
      "username"
    );
    res.status(200).json(clubs);
  } catch (error) {
    console.error("Error fetching joined clubs:", error);
    res.status(500).json({ msg: "Failed to fetch joined clubs" });
  }
};
