require("dotenv").config();
const express = require("express");
require("./utils/CronJobs/appointmentScheduler");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const authenticateAdmin = require("./middleware/authAdmin");
const authenticate = require("./middleware/auth");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTOR, { useNewUrlParser: true });

const db = mongoose.connection;

// Error handling for MongoDB connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

const userRoutes = require("./routes/dashboard/admin/userRoutes.js");
const appointmentRoutes = require("./routes/dashboard/admin/appointmentRoutes.js");
const paymentRoutes = require("./routes/dashboard/admin/paymentRoutes.js");
const firstAppointmentRoutes = require("./routes/landing/firstAppointmentRoutes.js");
const availableTimesRoutes = require("./routes/landing/availableTimesRoutes");
const loginRoutes = require("./routes/dashboard/loginRoutes");
const clientRoutes = require("./routes/dashboard/client/clientRoutes");

// const countersRoutes = require("./routes/counterRoutes.js"); // do i need counters?

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// Routes
//Landing page routes
app.use("/firstAppointment", firstAppointmentRoutes);
app.use("/availabletimes", availableTimesRoutes);

//Dashboard routes
app.use("/login", loginRoutes);

app.use("/users", authenticateAdmin, userRoutes);
app.use("/appointments", authenticateAdmin, appointmentRoutes);
app.use("/payments", authenticateAdmin, paymentRoutes);
app.use("/client", authenticate, clientRoutes);
// app.use("/clients", clientRoutes);

app.use(express.static(__dirname));

//backend home
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
