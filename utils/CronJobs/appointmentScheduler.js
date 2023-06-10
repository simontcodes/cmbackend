const cron = require("node-cron");
const Appointment = require("../../models/Appointment");

// Function to update appointment status
async function updateAppointmentStatus() {
  const currentDate = new Date();
  const appointments = await Appointment.find({
    date: { $lt: currentDate },
    status: { $nin: ["completed", "cancelled"] },
  });

  for (const appointment of appointments) {
    appointment.status = "completed";
    await appointment.save();
  }

  console.log("Appointment statuses updated successfully.");
  // Additional code or logic after updating appointment statuses
}

// Schedule the task to run every hour (you can adjust the schedule as per your needs)
cron.schedule("0 * * * *", updateAppointmentStatus);

module.exports = cron;
