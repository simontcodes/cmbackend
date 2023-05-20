const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Client = require("../models/Client");

// Create a new client
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email } = req.body;

    // Create a new client instance
    const newClient = new Client({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: Client.generateRandomPassword(),
    });

    // Save the new client to the database
    const savedClient = await newClient.save();

    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
