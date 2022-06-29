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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    requried: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    { $group: { _id: "$bootcamp", averageCost: { $avg: "$tuition" } } },
  ]);

  const averageCost = obj[0]
    ? Math.ceil(obj[0].averageCost / 10) * 10
    : undefined;
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost,
    });
  } catch (err) {
    console.log(err);
  }
};

CourseSchema.post("save", async (doc) => {
  await doc.constructor.getAverageCost(doc.bootcamp);
});

CourseSchema.post("remove", async (doc) => {
  await doc.constructor.getAverageCost(doc.bootcamp);
});

CourseSchema.post("findOneAndUpdate", async function (doc) {
  if (this.tuition != doc.tuition) {
    await doc.constructor.getAverageCost(doc.bootcamp);
  }
});
module.exports = mongoose.model("Course", CourseSchema);
