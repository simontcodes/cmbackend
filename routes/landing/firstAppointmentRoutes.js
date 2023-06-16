require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../../models/User");
const Appointment = require("../../models/Appointment");
const Payment = require("../../models/Payment");
// const getNextSequenceValue = require("../../middleware/getCounter");
const { google } = require("googleapis");
// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Google calendar API settings
const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });

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

    // const nextSequenceValue = await getNextSequenceValue("users");

    // Create a new user instance
    const user = new User({
      // number: nextSequenceValue,
      firstName,
      lastName,
      phoneNumber,
      email,
      role: "client",
      password: User.generateRandomPassword(),
    });

    console.log(user.password, "this is the password");
    // Save the new user to the database
    const saveduser = await user.save();
    // Extract payment data from the request body
    const { amount, transactionNumber } = req.body[1];

    // nextSequenceValue = await getNextSequenceValue("payments");

    // Create a new payment instance
    const payment = new Payment({
      // number: nextSequenceValue,
      amount,
      client: {
        id: saveduser._id,
        fullName: `${saveduser.firstName} ${saveduser.lastName}`,
      },
      transactionNumber,
      paymentSource: "square",
    });

    // Save the new payment to the database
    const savedPayment = await payment.save();

    console.log(savedPayment);

    // Extract appointment data from the request body
    const { time, date, typeOfAppointment } = req.body[1];
    console.log(time);
    // Call Google Calendar API to create an appointment
    const startTime = time.slice(0, -3) + ":00:00-04:00";
    console.log(startTime);
    const endTime = calculateEndTime(time);
    console.log(endTime);
    const googleDate = date.slice(0, -14);

    const calendarResponse = await calendar.events.insert({
      auth: auth,
      calendarId: process.env.CALENDAR_ID,
      requestBody: {
        summary: `${typeOfAppointment} for ${saveduser.firstName} ${saveduser.lastName}`,
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

    // Check if the event was created successfully
    if (calendarResponse.status === 200) {
      // The appointment was successfully created in Google Calendar
      // Proceed to save the appointment in your database
      // Create a new appointment instance
      const appointment = new Appointment({
        // number: nextSequenceValue,
        time,
        date,
        typeOfAppointment,
        client: {
          id: saveduser._id,
          fullName: `${saveduser.firstName} ${saveduser.lastName}`,
        },
        payment: savedPayment._id,
        googleCalendar: {
          link: calendarResponse.data.htmlLink,
          eventId: calendarResponse.data.id,
        },
      });

      const savedAppointment = await appointment.save();
      console.log(savedAppointment);

      res.status(201).json({
        user: {
          firstName: saveduser.firstName,
          lastName: saveduser.lastName,
          email: saveduser.email,
        },
        appointment: savedAppointment,
        payment: savedPayment,
      });
    } else {
      // Failed to create the appointment in Google Calendar
      res.status(400).json({
        error: "Failed to create the appointment in Google Calendar.",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

// require("dotenv").config();
// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// const User = require("../../models/User");
// const Appointment = require("../../models/Appointment");
// const Payment = require("../../models/Payment");
// // const getNextSequenceValue = require("../../middleware/getCounter");
// const { google } = require("googleapis");
// const { Client, Environment } = require("square");
// // Provide the required configuration
// const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// // Square API settings
// const squareClient = new Client({
//   environment: Environment.Sandbox, // Replace with Environment.Production for live payments
//   accessToken: process.env.SQUARE_ACCESS_TOKEN,
// });

// // Google calendar API settings
// const SCOPES = "https://www.googleapis.com/auth/calendar";
// const calendar = google.calendar({ version: "v3" });

// const auth = new google.auth.JWT(
//   CREDENTIALS.client_email,
//   null,
//   CREDENTIALS.private_key,
//   SCOPES
// );

// function calculateEndTime(time) {
//   const newTime =
//     (parseInt(time.slice(0, -3)) + 1).toString() + ":00:00-04:00";
//   return newTime;
// }

// // Create a user, appointment, and payment
// router.post("/", async (req, res) => {
//   try {
//     // Extract user data from the request body
//     const { firstName, lastName, phoneNumber, email } = req.body[0];

//     // const nextSequenceValue = await getNextSequenceValue("users");

//     // Create a new user instance
//     const user = new User({
//       // number: nextSequenceValue,
//       firstName,
//       lastName,
//       phoneNumber,
//       email,
//       role: "client",
//       password: User.generateRandomPassword(),
//     });

//     console.log(user.password, "this is the password");
//     // Save the new user to the database
//     const saveduser = await user.save();

//     // Extract appointment data from the request body
//     const { time, date, typeOfAppointment } = req.body[1];

//     // Generate a unique identifier for the payment
//     const paymentId = saveduser._id; // You can use any unique identifier here

//     // Create a new payment instance
//     const payment = new Payment({
//       amount,
//       client: {
//         id: saveduser._id,
//         fullName: `${saveduser.firstName} ${saveduser.lastName}`,
//       },
//       paymentSource: "square",
//     });

//     // Save the new payment to the database
//     const savedPayment = await payment.save();

//     console.log(savedPayment);

//     // Generate a Square payment URL
//     const paymentRequest = {
//       locationId: process.env.SQUARE_LOCATION_ID,
//       amount: Math.round(amount * 100), // Convert amount to cents
//       currency: "USD",
//       sourceId: paymentId, // Use the paymentId as the sourceId for tracking
//       redirectUrl: `${process.env.BASE_URL}/payment-redirect`, // The URL where Square will redirect after payment
//     };

//     const { result: paymentResult } = await squareClient.paymentsApi.createPayment(
//       paymentRequest
//     );

//     if (paymentResult.status !== "COMPLETED") {
//       throw new Error("Square payment failed.");
//     }

//     // Call Google Calendar API to create an appointment
//     const startTime = time.slice(0, -3) + ":00:00-04:00";
//     const endTime = calculateEndTime(time);
//     const googleDate = date.slice(0, -14);

//     const calendarResponse = await calendar.events.insert({
//       auth: auth,
//       calendarId: process.env.CALENDAR_ID,
//       requestBody: {
//         summary: `${typeOfAppointment} for ${saveduser.firstName} ${saveduser.lastName}`,
//         start: {
//           dateTime: `${googleDate}T${startTime}`,
//           timeZone: "America/Toronto",
//         },
//         end: {
//           dateTime: `${googleDate}T${endTime}`,
//           timeZone: "America/Toronto",
//         },
//       },
//     });

//     // Check if the event was created successfully
//     if (calendarResponse.status === 200) {
//       // The appointment was successfully created in Google Calendar
//       // Proceed to save the appointment in your database
//       // Create a new appointment instance
//       const appointment = new Appointment({
//         time,
//         date,
//         typeOfAppointment,
//         client: {
//           id: saveduser._id,
//           fullName: `${saveduser.firstName} ${saveduser.lastName}`,
//         },
//         payment: savedPayment._id,
//         googleCalendar: {
//           link: calendarResponse.data.htmlLink,
//           eventId: calendarResponse.data.id,
//         },
//       });

//       const savedAppointment = await appointment.save();
//       console.log(savedAppointment);

//       res.status(201).json({
//         user: {
//           firstName: saveduser.firstName,
//           lastName: saveduser.lastName,
//           email: saveduser.email,
//         },
//         appointment: savedAppointment,
//         payment: savedPayment,
//         paymentUrl: paymentResult.paymentUrl, // Send the Square payment URL to the frontend
//       });
//     } else {
//       // Failed to create the appointment in Google Calendar
//       res.status(400).json({
//         error: "Failed to create the appointment in Google Calendar.",
//       });
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// module.exports = router;
