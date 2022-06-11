const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add course title"],
    // unique: [true,"Coursename already exists"]
  },
  description: {
    type: String,
    required: [true, "Please add course description"],
  },
  weeks: {
    type: Number,
    required: [true, "Please add duration"],
    min: [1, "Course duration must be atleast 1 week"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add tution fees"],
  },
  minimumSkill: {
    type: String,
    requried: [true, "Please add skill level required"],
    enum: ["beginner", "intermediate", "advance"],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    requried: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Courses", CourseSchema);
