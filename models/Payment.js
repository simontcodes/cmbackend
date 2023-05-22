const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Amount is required."],
  },
  transactionNumber: {
    type: String,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: [true, "Client is required."],
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
