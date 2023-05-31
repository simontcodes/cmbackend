const express = require('express');
const router = express.Router();
const Appointment = require('../../models/Appointment');

// Route to get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve appointments' });
  }
});

module.exports = router;