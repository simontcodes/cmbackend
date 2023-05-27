const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/User");

// GET route to retrieve client users
router.get("/", (req, res) => {
  User.find({ role: "client" })
    .then((clients) => {
      res.status(200).json(clients);
    })
    .catch((error) => {
      console.error("Error retrieving users:", error);
      res
        .status(500)
        .json({ error: "An error occurred while retrieving users" });
    });
});

// Create a new client
//dont know if i shoul keep this route yet
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    // Create a new client instance
    const newClient = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      role: "client",
      password,
      // password: User.generateRandomPassword(),
    });

    // Save the new client to the database
    const savedClient = await newClient.save();

    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
