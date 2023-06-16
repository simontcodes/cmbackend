const express = require("express");
const router = express.Router();
const User = require("../../../models/User");
const Appointment = require("../../../models/Appointment");
const Payment = require("../../../models/Payment");

// const multer = require('multer');
// const azure = require('azure-storage');

// const router = express.Router();
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const blobService = azure.createBlobService(connectionString);

//get a client by id
router.get("/profile/", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const appointments = await Appointment.find({ "client.id": req.userId });
    const payments = await Payment.find({ "client.id": req.userId });

    if (!user || !appointments || !payments) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.status(200).json({
      user,
      appointments,
      payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.post("/upload", upload.single("file"), (req, res) => {
//   const file = req.file;

//   if (!file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   const containerName = "files";
//   const blobName = file.originalname;

//   blobService.createBlockBlobFromText(
//     containerName,
//     blobName,
//     file.buffer,
//     (error) => {
//       if (error) {
//         console.error("Error uploading file:", error);
//         return res.status(500).json({ message: "Failed to upload file" });
//       }

//       return res.status(200).json({ message: "File uploaded successfully" });
//     }
//   );
// });

//client upload file
router.post("/upload", (req, res) => {
  console.log("this will be the upload route");
});

module.exports = router;
