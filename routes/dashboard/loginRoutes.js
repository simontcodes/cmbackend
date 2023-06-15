const express = require("express");
const router = express.Router();

const authenticate = require("../../middleware/auth");

const User = require("../../models/User");

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email not found");

    const token = await user.login(req.body.password);

    // Check if the user has changed their password
    if (!user.hasChangedPassword) {
      // Send a response indicating a password change is required
      return res.status(200).send({
        name: user.name,
        token,
        role: user.role,
        passwordChangeRequired: true,
      });
    }

    res
      .header("Authorization", `Bearer ${token}`)
      .send({ name: user.name, token, role: user.role });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Route to change user's password
router.post("/change-password", authenticate, async (req, res) => {
  console.log(req.body);
  try {
    const { newPassword } = req.body;
    //_id comes from the auth middleware
    const userId = req.userId;
    console.log(userId);

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Change the user's password
    await user.changePassword(newPassword);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
