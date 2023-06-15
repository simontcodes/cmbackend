require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//this middleware authenticate both types of user

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .send({ message: "No authorization header provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).send({ message: "Failed to authenticate token" });
    }

    const { _id, role } = decoded;
    req.userId = _id; // Attach _id to the req object

    next();
  });
}

module.exports = authenticateJWT;
