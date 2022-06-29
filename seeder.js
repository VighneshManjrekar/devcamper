require("dotenv").config({ path: "./configs/config.env" });
require("colors");

const path = require("path");
const fs = require("fs");

const mongoose = require("mongoose");

// connect db
mongoose.connect(process.env.MONGO_URI);

// load bootcamp model
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");

// load bootcamp data
const bootcampData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "bootcamps.json"))
);

const courseData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "courses.json"))
);

const userData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "users.json"))
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcampData);
    await Course.create(courseData);
    await User.create(userData);
    console.log("Data imported...".bgGreen);
  } catch (err) {
    console.error(err);
  }

  process.exit(0);
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    console.log("Data deleted".bgRed);
  } catch (error) {
    console.error(error);
  }

  process.exit(0);
};

if (process.argv[2] == "-i") {
  importData();
} else if (process.argv[2] == "-d") {
  deleteData();
}
