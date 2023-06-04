const express = require("express");
const router = express.Router();
const Payment = require("../../../models/Payment");

// Route to get all payments

router.get("/", async (req, res) => {
  try {
    //if user Id exist it will return only that persons appointments otherwise returns all appointments.
    //send a GET request to /appointments?userId=<user_id>
    if (req.query.userId) {
      const userId = req.query.userId;
      const payments = await Payment.find({ "client.id": userId });
      res.status(200).json(payments);
    } else {
      const payments = await Payment.find();
      res.status(200).json(payments);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve payments" });
  }
});

module.exports = router;
