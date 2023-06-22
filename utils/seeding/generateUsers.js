require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const User = require("../../models/User");
const fs = require("fs");

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTOR, { useNewUrlParser: true });

const db = mongoose.connection;

// Error handling for MongoDB connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Function to generate a random user
const generateUser = () => {
  const user = new User({
    number: faker.number.int(),
    role: "client",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    clientInfo: {
      educationLevel: faker.word.conjunction(4),
      isMarried: faker.datatype.boolean(),
      hasBeenInCanada: faker.datatype.boolean(),
      hasEnglishTest: faker.datatype.boolean(),
      englishTest: "TOEFL",
      englishTestScore: {
        readingScore: faker.number.binary({ min: 1, max: 12 }),
        writingScore: faker.number.binary({ min: 1, max: 12 }),
        listeningScore: faker.number.binary({ min: 1, max: 12 }),
        speakingScore: faker.number.binary({ min: 1, max: 12 }),
      },
      jobExperience: Array.from(
        { length: faker.number.binary({ min: 1, max: 5 }) },
        () => ({
          workExp: {
            jobTitle: faker.person.jobTitle(),
            yearsOfExp: faker.number.binary({ min: 1, max: 10 }),
          },
        })
      ),
    },
  });

  return user.save();
};

// Generate 15 users
async function generateUsers() {
  try {
    const users = [];
    for (let i = 0; i < 15; i++) {
      const user = await generateUser();
      users.push(user);
    }
    console.log("Users created successfully!");

    // Write users to a JSON file
    const jsonUsers = JSON.stringify(users);
    fs.writeFile("users.json", jsonUsers, (err) => {
      if (err) throw err;
      console.log("Users saved to users.json");
    });
  } catch (error) {
    console.error("Error generating users:", error);
  } finally {
    mongoose.disconnect();
  }
}

generateUsers();
