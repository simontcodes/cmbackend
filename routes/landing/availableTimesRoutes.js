const express = require("express");
const router = express.Router();
const Appointment = require("../../models/Appointment");

// Route to get available appointment times for a given date
router.get("/:date", async (req, res) => {
  const { date } = req.params;

  try {
    const existingAppointments = await Appointment.find({ date });

    const allTimes = [
      "10:00am",
      "11:00am",
      "12:00pm",
      "01:00pm",
      "02:00pm",
      "03:00pm",
      "04:00pm",
      "05:00pm",
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
