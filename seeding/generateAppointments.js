require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Appointment = require("../models/Appointment");

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTOR, { useNewUrlParser: true });

const db = mongoose.connection;

// Error handling for MongoDB connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});
// Array of client IDs to choose at random
const clientIds = [
  "647163a4b14a2fb12f3791e3",
  "647270344e719f36ebfc8d87",
  "647270354e719f36ebfc8d8b",
  "647270354e719f36ebfc8d98",
  "647270354e719f36ebfc8da5",
  "647270354e719f36ebfc8e0c",
  "647270354e719f36ebfc8e18",
  "647270354e719f36ebfc8e24",
  "647270354e719f36ebfc8e31",
  "647270354e719f36ebfc8e97",
  "647270354e719f36ebfc8e9a",
  "647270364e719f36ebfc8e9d",
  "647270364e719f36ebfc8eaa",
  "647270364e719f36ebfc8f10",
  "647270364e719f36ebfc8f1c",
  "647270364e719f36ebfc8f28",
]; // Replace with your actual client IDs

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
  const date = faker.date.between({
    from: "2023-06-06T00:00:00.000Z",
    to: "2023-10-31T00:00:00.000Z",
  });
  const typeOfAppointment = faker.helpers.arrayElement([
    "Initial consultation",
    "One hour Consultation",
    "Two hour Consultation",
  ]);
  const client = {
    id: faker.helpers.arrayElement(clientIds),
    fullName: `${faker.person.firstName()} ${faker.person.lastName()} `,
  };

  return {
    time,
    date,
    typeOfAppointment,
    client,
    // payment,
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
    // Close the database connection after generating appointments
    mongoose.connection.close();
  }
};

// Call the function to generate appointments
generateAppointments();
