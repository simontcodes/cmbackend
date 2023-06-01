const express = require('express');
const router = express.Router();
const Payment = require('../../models/Payment');

// Route to get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve payments' });
  }
});

module.exports = router;