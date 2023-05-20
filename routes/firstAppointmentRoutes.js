const express = require("express");
const router = express.Router();
const Client = require("../models/Client");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");

// Create a client, appointment, and payment
router.post("/", async (req, res) => {
  try {
    // Extract client data from the request body
    const { firstName, lastName, phoneNumber, email } = req.body;

    // Create a new client instance
    const client = new Client({
      firstName,
      lastName,
      phoneNumber,
      email,
    });

    // Save the new client to the database
    const savedClient = await client.save(); // podria no guardar el client en una variable para no tener la clave

    // Extract payment data from the request body
    const { amount, transactionNumber } = req.body;

    // Create a new payment instance
    const payment = new Payment({
      amount,
      client: savedClient._id,
      transactionNumber,
    });

    // Save the new payment to the database
    const savedPayment = await payment.save();

    // Extract appointment data from the request body
    const { time, date, typeOfAppointment } = req.body;

    // Create a new appointment instance
    const appointment = new Appointment({
      time,
      date,
      typeOfAppointment,
      client: savedClient._id,
      payment: savedPayment._id,
    });

    // Save the new appointment to the database

    const savedAppointment = await appointment.save();

    res.status(201).json({
      client: {
        firstName: savedClient.firstName,
        lastName: savedClient.lastName,
        email: savedClient.email,
      },
      appointment: savedAppointment,
      payment: savedPayment,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
