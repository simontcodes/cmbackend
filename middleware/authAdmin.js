require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

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

    if (role === "admin") {
      console.log("the user is an Admin");
    }

    if (role !== "admin") {
      return res
        .status(403)
        .send({ message: "User is not admin, cannot access this route" });
    }

    next();
  });
}

module.exports = authenticateJWT;
