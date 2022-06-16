const Course = require("../models/Course");
const asyncHandler = require("../middleware/async");
const errorHandler = require("../middleware/error");

// @desc    Get all courses
// @route   GET api/v1/bootcamps/:bootcampId/courses
// @route   GET api/v1/courses
// @access  Private
exports.getAllCourses = asyncHandler(async (req, res) => {
  let query;

  const bootcamp = req.params.bootcampId;
  if (bootcamp) {
    query = Course.find({ bootcamp });
  } else {
    query = Course.find();

    // For populating entire object
    // query = Course.find().populate('bootcamp');

    // For populating specific properties of an object
    // query = Course.find().populate({
    //   path:'bootcamp',
    //   select:'name description'
    // });
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});
