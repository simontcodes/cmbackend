const express = require("express");
const router = express.Router();
// const multer = require('multer');
// const azure = require('azure-storage');

// const router = express.Router();
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// const blobService = azure.createBlobService(connectionString);

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

router.post("/upload", (req, res) => {
  console.log("this will be the upload route");
});

module.exports = router;
