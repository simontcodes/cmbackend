const express = require("express");
const router = express.Router();
const Appointment = require("../../../models/Appointment");

// Route to get all appointments
router.get("/", async (req, res) => {
  try {
    //if user Id exist it will return only that persons appointments otherwise returns all appointments.
    //send a GET request to /appointments?userId=<user_id>
    if (req.query.userId) {
      const userId = req.query.userId;
      const appointments = await Appointment.find({ "client.id": userId });
      res.status(200).json(appointments);
    } else {
      const appointments = await Appointment.find();
      res.status(200).json(appointments);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve appointments" });
  }
});

module.exports = router;
