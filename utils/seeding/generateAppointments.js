require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Appointment = require("../../models/Appointment");
const fs = require("fs");

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTOR, { useNewUrlParser: true });

const db = mongoose.connection;

// Error handling for MongoDB connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Load users from users.json file
const usersData = fs.readFileSync("users.json", "utf8");
const users = JSON.parse(usersData);

// Array of client IDs to choose at random
const clientIds = users.map((user) => user._id); // Use user IDs from users.json

// Function to generate a random appointment
const generateAppointment = () => {
  const time = faker.helpers.arrayElement([
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ]);

  const fromDate = new Date("2023-06-23T00:00:00.000Z");
  const toDate = new Date("2023-11-30T00:00:00.000Z");
  let date = faker.date.between(fromDate, toDate);

  while (date.getDay() === 0 || date.getDay() === 6) {
    date = faker.date.between(fromDate, toDate);
  }

  const typeOfAppointment = faker.helpers.arrayElement([
    "Initial consultation",
    "One hour Consultation",
    "Two hour Consultation",
  ]);

  const user = faker.helpers.arrayElement(users);
  const client = {
    id: user._id,
    fullName: `${user.firstName} ${user.lastName}`,
  };

  const googleCalendar = {
    link: "this is where the link would go",
    eventId: faker.string.uuid(),
  };

  return {
    time,
    date,
    typeOfAppointment,
    client,
    googleCalendar,
    status: "UPCOMING",
  };
};

// Generate 50 appointments and save them to the database
const generateAppointments = async () => {
  try {
    const appointments = [];
    for (let i = 0; i < 50; i++) {
      const appointmentData = generateAppointment();
      const appointment = new Appointment(appointmentData);
      await appointment.save();
      appointments.push(appointment);
      console.log(appointment);
    }
    console.log("Appointments generated and saved successfully!");
  } catch (error) {
    console.error("Failed to generate and save appointments:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Call the function to generate appointments
generateAppointments();
