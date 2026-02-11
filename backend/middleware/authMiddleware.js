const jwt = require("jsonwebtoken");

/* ======================================================
   JWT AUTH MIDDLEWARE
====================================================== */
module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
