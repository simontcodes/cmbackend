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
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming",
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
