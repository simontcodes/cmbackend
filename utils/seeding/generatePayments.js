require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Payment = require("../../models/Payment");
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

async function createPayments() {
  try {
    for (let i = 0; i < 50; i++) {
      const randomClientId = faker.helpers.arrayElement(clientIds);

      const user = users.find((user) => user._id === randomClientId);
      const fullName = `${user.firstName} ${user.lastName}`;

      const payment = new Payment({
        amount: faker.number.int({ min: 10, max: 1000 }),
        transactionNumber: faker.string.uuid(),
        client: {
          id: randomClientId,
          fullName: fullName,
        },
        paymentSource: faker.helpers.arrayElement(["square", "paypal"]),
        status: "COMPLETED",
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
