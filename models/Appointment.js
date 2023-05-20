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
    type: Number,
    enum: [1, 2, 3],
    required: [true, "Type of appointment is required."],
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: [true, "Client is required."],
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
