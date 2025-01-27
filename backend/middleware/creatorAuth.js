const jwt = require("jsonwebtoken");
const creatorModel = require("../models/creatorSchema");
const creatorAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        message: "JWT token must be provided",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_CREATOR_SECRET);
    console.log(decoded);
    if (decoded) {
      req.userId = decoded.userId;
      const creatorUsername = await creatorModel.findById(decoded.userId);
      if (!creatorUsername) {
        return res.status(403).json({
          message: "Creator not found",
        });
      }
      req.username = creatorUsername.username;
      console.log(creatorUsername.username);
      next();
    } else {
      res.status(403).json({
        message: "You are not signed in",
      });
    }
  } catch (err) {
    res.status(403).json({
      message: err.message,
    });
  }
};

module.exports = creatorAuthMiddleware;
