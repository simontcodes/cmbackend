require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");
const Payment = require("../../models/Payment");
const { google } = require("googleapis");
const { Client, Environment } = require("square");
const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Square API settings
const squareClient = new Client({
  environment: Environment.Sandbox, // Replace with Environment.Production for live payments
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);

function calculateEndTime(time) {
  const newTime = (parseInt(time.slice(0, -3)) + 1).toString() + ":00:00-04:00";
  return newTime;
}

// Create a user, appointment, and payment
router.post("/", async (req, res) => {
  try {
    // Extract user data from the request body
    const { firstName, lastName, phoneNumber, email } = req.body[0];

    // Create a new user instance
    const user = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      role: "client",
      password: User.generateRandomPassword(),
    });

    // Extract appointment data from the request body
    const { time, date, typeOfAppointment, amount } = req.body[1];

    // Create a new payment instance
    const payment = new Payment({
      amount,
      client: {
        id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
      },
      paymentSource: "square",
    });

    // Generate a unique identifier for the payment
    const paymentId = payment._id; // You can use any unique identifier here

    const response = await squareClient.checkoutApi.createPaymentLink({
      idempotencyKey: paymentId.toString(),
      quickPay: {
        name: `${typeOfAppointment} for ${user.firstName} ${user.lastName}`,
        priceMoney: {
          amount: 10000,
          currency: "CAD",
        },
        redirect_url: `http://localhost:3000/payment`,
        locationId: process.env.SQUARE_LOCATION_ID,
      },
    });

    if (response.statusCode !== 200) {
      throw new Error(
        "Square checkout failed: " +
          errors.map((error) => error.detail).join(", ")
      );
    }

    //the order id from square is used to set transaction number on payment
    //this way we can use the webhook event to change the payment status
    payment.transactionNumber = response.result.paymentLink.orderId;

    const checkoutUrl = response.result.paymentLink.url; //this is the link the user will be redirected to

    // Call Google Calendar API to create an appointment
    const startTime = time.slice(0, -3) + ":00:00-04:00";
    const endTime = calculateEndTime(time);
    const googleDate = date.slice(0, -14);

    const calendarResponse = await calendar.events.insert({
      auth: auth,
      calendarId: process.env.CALENDAR_ID,
      requestBody: {
        summary: `${typeOfAppointment} for ${user.firstName} ${user.lastName}`,
        start: {
          dateTime: `${googleDate}T${startTime}`,
          timeZone: "America/Toronto",
        },
        end: {
          dateTime: `${googleDate}T${endTime}`,
          timeZone: "America/Toronto",
        },
      },
    });

    if (calendarResponse.status !== 200) {
      throw new Error("Failed to create the appointment in Google Calendar.");
    }

    // Create a new appointment instance
    const appointment = new Appointment({
      time,
      date,
      typeOfAppointment,
      client: {
        id: user._id,
        fullName: `${user.firstName} ${user.lastName}`,
      },
      payment: payment._id,
      googleCalendar: {
        link: calendarResponse.data.htmlLink,
        eventId: calendarResponse.data.id,
      },
    });

    //here we add the appointment id to be able to change appointment status in the webhook route
    payment.appointment = appointment._id;

    // Save the new appointment to the database
    // const savedAppointment = await appointment.save();

    // Save the new user and payment to the database
    await Promise.all([user.save(), payment.save(), appointment.save()]);

    res.status(201).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      // appointment: savedAppointment,
      checkoutUrl: checkoutUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/square-webhook", async (req, res) => {
  // Retrieve the event data from the request body
  const event = req.body;
  const transactionNumber = req.body.data.object.payment.order_id;

  // Find the payment based on the transaction number
  try {
    const payment = await Payment.findOne({
      transactionNumber: transactionNumber,
    });
    const appointment = await Appointment.findOne({
      payment: payment._id,
    });

    if (payment && appointment) {
      console.log("Payment found:", payment);
      // Process the payment or perform relevant actions
      if (event.data.object.payment.status === "COMPLETED") {
        payment.status = "COMPLETED";
        appointment.status = "UPCOMING";

        console.log(payment.status);
        console.log(appointment.status);
      } else if (event.data.object.payment.status === "REJECTED") {
        payment.status = "REJECTED";
        appointment.status = "CANCELLED";

        //the calendar event gets deleted if payment is not completed
        const calendarResponse = await calendar.events.delete({
          auth: auth,
          calendarId: process.env.CALENDAR_ID,
          eventId: appointment.googleCalendar.eventId,
        });
        console.log(calendarResponse.status);
      }
    } else {
      console.log("Payment or Appointment not found");
      // Handle the case where payment is not found
    }
  } catch (error) {
    console.error("Error finding payment:", error);
    // Handle the error
  }

  // ... rest of the code

  // Respond with a 200 status to acknowledge the webhook event
  res.sendStatus(200);
});

module.exports = router;
