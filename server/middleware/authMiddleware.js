const jwt = require("jsonwebtoken");

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded Token:", decoded);
    req.user = decoded;
    // req.user.id = decoded._id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to authorize specific roles (like "organizer", "member")
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden: Access denied" });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
