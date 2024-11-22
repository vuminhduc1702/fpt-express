const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  if (req.path.startsWith("/auth") || req.path.startsWith("/docs")) {
    return next();
  }
  const hasToken = req.get("Authorization");
  if (!hasToken) {
    const error = new Error("Not Authenticated");
    error.status = 401;
    throw error;
  }

  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    err.status = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error("Not Authenticated");
    error.status = 401;
    throw error;
  }

  req.user = decodedToken;
  next();
};

module.exports = authMiddleware;
