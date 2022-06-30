const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: [100, "Max length is 100 characters"],
    required: [true, "Please enter title for the review"],
  },
  text: {
    type: String,
    trim: true,
    maxlength: [500, "Max length is 500 characters"],
    required: [true, "Please enter text for the review"],
  },
  rating: {
    type: Number,
    min: [1, "Please provide rating between 1-10"],
    max: [10, "Please provide rating between 1-10"],
    required: [true, "Please give honest ratings"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Types.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAvgRating = async function (bootcampId) {
  const obj = await this.aggregate([
    { $match: { bootcamp: bootcampId } },
    { $group: { _id: "$bootcamp", averageRating: { $avg: "$rating" } } },
  ]);

  const averageRating = obj[0] ? Math.round(obj[0].averageRating) : undefined;
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating,
    });
  } catch (err) {
    console.log(err);
  }
};

ReviewSchema.post("save", async (doc) => {
  await doc.constructor.getAvgRating(doc.bootcamp);
});

ReviewSchema.post("remove", async (doc) => {
  await doc.constructor.getAvgRating(doc.bootcamp);
});

ReviewSchema.post("findOneAndUpdate", async function (doc) {
  if (this.rating != doc.rating) {
    await doc.constructor.getAvgRating(doc.bootcamp);
  }
});

module.exports = mongoose.model("Review", ReviewSchema);
