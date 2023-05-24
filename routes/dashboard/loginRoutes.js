const express = require("express");
const router = express.Router();

const User = require("../../models/User");

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email not found");

    const token = await user.login(req.body.password);
    res
      .header("Authorization", `Bearer ${token}`)
      .send({ name: user.name, token, role: user.role });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
