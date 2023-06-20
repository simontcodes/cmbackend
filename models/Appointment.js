const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  time: {
    type: String,
    required: [true, "Time is required."],
  },
  date: {
    type: Date,
    required: [true, "Date is required."],
  },
  typeOfAppointment: {
    type: String,
    enum: [
      "Initial consultation",
      "One hour Consultation",
      "Two hour Consultation",
    ],
    required: [true, "Type of appointment is required."],
  },
  client: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Client ID is required."],
    },
    fullName: {
      type: String,
      required: [true, "Client full name is required."],
    },
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  createdAt: {
    required: [true, "createdAt is required."],
    type: Date,
    default: Date.now,
    immutable: true,
  },
  status: {
    type: String,
    required: [true, "Status is required."],
    enum: ["PENDING", "UPCOMING", "COMPLETED", "CANCELLED"],
    default: "PENDING",
  },
  googleCalendar: {
    link: { type: String },
    eventId: { type: String },
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
