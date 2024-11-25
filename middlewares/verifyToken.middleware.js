const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    if (req.path.startsWith("/auth") || req.path.startsWith("/docs")) {
      return next();
    }
    const hasToken = req.get("Authorization");
    if (!hasToken) {
      return res.status(403).send({
        error: "No token provided",
        success: false,
      });
    }

    const token = req.get("Authorization").split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          error: `Verify access token error: ${err?.message}`,
          success: false,
        });
      }
      req.user = decoded;
      next();
    });
  } catch (err) {
    err.status = 500;
    throw err;
  }
};

module.exports = authMiddleware;
