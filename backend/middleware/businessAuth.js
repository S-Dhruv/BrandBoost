const jwt = require("jsonwebtoken");

const businessAuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_BUSINESS_SECRET);
    if (decoded) {
      req.userId = decoded.id;
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

module.exports = businessAuthMiddleware;
