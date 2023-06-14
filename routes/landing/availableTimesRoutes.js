const express = require("express");
const router = express.Router();
const Appointment = require("../../models/Appointment");

// Route to get available appointment times for a given date
router.get("/:date", async (req, res) => {
  const { date } = req.params;

  try {
    const existingAppointments = await Appointment.find({ date });
    const allTimes = [
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];

    const takenTimes = existingAppointments.map(
      (appointment) => appointment.time
    );
    const availableTimes = allTimes.filter(
      (time) => !takenTimes.includes(time)
    );

    res.json({ availableTimes });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching appointments." });
  }
});

module.exports = router;
