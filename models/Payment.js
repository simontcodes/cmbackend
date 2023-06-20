const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Amount is required."],
  },
  transactionNumber: {
    type: String, //this is orderId coming from square
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
  createdAt: {
    required: [true, "createdAt is required."],
    type: Date,
    default: Date.now,
    immutable: true,
  },
  paymentSource: {
    type: String,
    required: [true, "paymentSource is required."],
    enum: ["square", "paypal"],
  },
  status: {
    type: String,
    required: [true, "status is required."],
    enum: ["pending", "completed", "rejected"],
    default: "pending",
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
