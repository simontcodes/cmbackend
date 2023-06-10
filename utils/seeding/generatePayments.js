require("dotenv").config();
const mongoose = require('mongoose');
const { faker } = require("@faker-js/faker");
const Payment = require('../models/Payment');

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTOR, { useNewUrlParser: true });

const db = mongoose.connection;

// Error handling for MongoDB connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});
// Array of client IDs to choose at random
const clientIds = ['647163a4b14a2fb12f3791e3', '647270344e719f36ebfc8d87', '647270354e719f36ebfc8d8b', "647270354e719f36ebfc8d98", "647270354e719f36ebfc8da5", '647270354e719f36ebfc8e0c', '647270354e719f36ebfc8e18', '647270354e719f36ebfc8e24', '647270354e719f36ebfc8e31', '647270354e719f36ebfc8e97', '647270354e719f36ebfc8e9a', '647270364e719f36ebfc8e9d', '647270364e719f36ebfc8eaa', '647270364e719f36ebfc8f10', '647270364e719f36ebfc8f1c', '647270364e719f36ebfc8f28']; // Replace with your actual client IDs



async function createPayments() {
    try {
      for (let i = 0; i < 50; i++) {
        const randomClientId = clientIds[Math.floor(Math.random() * clientIds.length)];
  
        const payment = new Payment({
          amount: faker.number.int({ min: 10, max: 1000 }),
          transactionNumber: faker.string.uuid(),
          client: {
            id: randomClientId,
            fullName: `${faker.person.firstName()} ${faker.person.lastName()} `,
          },
          paymentSource: faker.helpers.arrayElement(["square", "paypal"]),
        });
  
        await payment.save();
        console.log(`Payment ${i + 1} created.`);
      }
  
      console.log("All payments created successfully.");
    } catch (error) {
      console.error("Error creating payments:", error);
    } finally {
      mongoose.disconnect();
    }
  }
  
  createPayments();