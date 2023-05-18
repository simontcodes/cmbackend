require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const authenticateJWT = require("./middleware/auth");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTOR, { useNewUrlParser: true });

const db = mongoose.connection;

// Error handling for MongoDB connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

const clientRoutes = require("./routes/clientRoutes.js");
const appointmentRoutes = require("./routes/appointmetRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");

// const countersRoutes = require("./routes/counterRoutes.js"); // do i need counters?

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// Routes
// app.use("/payments", authenticateJWT, productsRoutes);
// app.use("/clients", authenticateJWT, salesRoutes);
// app.use("/appointments", authenticateJWT, countersRoutes);
// app.use("/category", authenticateJWT, categoriesRoutes);
// app.use("/admin", adminsRoutes);
app.use(express.static(__dirname));

//backend home
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
