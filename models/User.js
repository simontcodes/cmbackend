const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  number: {
    type: Number,
  },
  role: {
    type: String,
    enum: ["admin", "client"],
    required: [true, "Type of appointment is required."],
  },
  firstName: {
    type: String,
    required: [true, "First name is required."],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required."],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required."],
    // validate: {
    //   validator: function (value) {
    //     // Validate phone number format (e.g., XXX-XXX-XXXX)
    //     return /^\d{3}-\d{3}-\d{4}$/.test(value);
    //   },
    //   message:
    //     "Invalid phone number format. Please provide in XXX-XXX-XXXX format.",
    // },
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    validate: {
      validator: function (value) {
        // Validate email format
        return /\S+@\S+\.\S+/.test(value);
      },
      message: "Invalid email format. Please provide a valid email address.",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    validate: {
      validator: function (value) {
        // Validate password length (at least 6 characters)
        return value.length >= 6;
      },
      message: "Password must be at least 6 characters long.",
    },
  },
  payments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  ],
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
});

// Method to generate a random password
userSchema.statics.generateRandomPassword = function () {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const passwordLength = 8;
  let generatedPassword = "";

  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    generatedPassword += characters.charAt(randomIndex);
  }

  return generatedPassword;
};

userSchema.methods.login = async function (password) {
  console.log(password, this.password);
  const isPasswordValid = await bcrypt.compare(password, this.password);
  if (!isPasswordValid) return Promise.reject(new Error("Invalid password"));

  const payload = { _id: this._id, role: this.role };
  console.log(payload);

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Pre-save middleware to hash the password
userSchema.pre("save", async function (next) {
  try {
    // Generate a random password if not provided
    if (!this.password) {
      this.password = this.generateRandomPassword();
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
