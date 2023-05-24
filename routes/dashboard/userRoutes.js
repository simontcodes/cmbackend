const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/User");

router.get("/", async (req, res) => {
  res.status(200).json({ message: "it is protected!" });
});

// Create a new client
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    // Create a new client instance
    const newClient = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      role: "admin",
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
