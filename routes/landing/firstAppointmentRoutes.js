const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");
const Payment = require("../../models/Payment");
const getNextSequenceValue = require("../../middleware/getCounter");

// Create a user, appointment, and payment
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    // Extract user data from the request body
    const { firstName, lastName, phoneNumber, email } = req.body[0];

    const nextSequenceValue = await getNextSequenceValue("users");

    // Create a new user instance
    const user = new User({
      number: nextSequenceValue,
      firstName,
      lastName,
      phoneNumber,
      email,
      role: "client",
      password: user.generateRandomPassword(),
    });

    // Save the new user to the database
    const saveduser = await user.save(); // podria no guardar el user en una variable para no tener la clave

    // Extract payment data from the request body
    const { amount, transactionNumber } = req.body[1];

    nextSequenceValue = await getNextSequenceValue("payments");

    // Create a new payment instance
    const payment = new Payment({
      number: nextSequenceValue,
      amount,
      user: saveduser._id,
      transactionNumber,
    });

    // Save the new payment to the database
    const savedPayment = await payment.save();

    // Extract appointment data from the request body
    const { time, date, typeOfAppointment } = req.body[1];

    nextSequenceValue = await getNextSequenceValue("appointments");

    // Create a new appointment instance
    const appointment = new Appointment({
      number: nextSequenceValue,
      time,
      date,
      typeOfAppointment,
      user: saveduser._id,
      payment: savedPayment._id,
    });

    // Save the new appointment to the database

    const savedAppointment = await appointment.save();

    res.status(201).json({
      user: {
        firstName: saveduser.firstName,
        lastName: saveduser.lastName,
        email: saveduser.email,
      },
      appointment: savedAppointment,
      payment: savedPayment,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
