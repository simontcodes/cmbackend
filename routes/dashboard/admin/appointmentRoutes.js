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

// Route to cancel an appointment
router.patch("/cancel/:id", async (req, res) => {
  const appointmentId = req.params.id;

  try {
    // Find the appointment by ID
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if the appointment status is "upcoming"
    if (appointment.status === "upcoming") {
      // Update the appointment status to "cancelled"
      appointment.status = "cancelled";

      // Save the updated appointment
      await appointment.save();

      res.status(200).json({ message: "Appointment cancelled successfully" });
    } else {
      res.status(400).json({ error: "Cannot cancel appointment" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});

module.exports = router;
