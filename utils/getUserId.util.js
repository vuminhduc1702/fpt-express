const jwt = require("jsonwebtoken");

const getUserId = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    return decoded.userId;
  } catch (err) {
    console.log("Invalid token: ", err.message);
    return null;
  }
};

module.exports = getUserId;
