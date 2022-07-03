const Course = require("../models/Course");
const mongoose = require("mongoose");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");

// @desc    Get all courses
// @route   GET api/v1/bootcamps/:bootcampId/courses
// @route   GET api/v1/courses
// @access  Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
  // check if id valid , then find
  if (req.params.bootcampId) {
    if (!mongoose.Types.ObjectId.isValid(req.params.bootcampId)) {
      return next(
        new ErrorResponse(`Invalid Id ${req.params.bootcampId}`, 400)
      );
    }
  }

  const bootcamp = req.params.bootcampId;
  if (bootcamp) {
    const courses = await Course.find({ bootcamp });
    return res
      .status(200)
      .json({ success: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.filterResults);
  }
});

// @desc    Get single course
// @route   GET api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  // check if id valid , then find
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorResponse(`Invalid Id ${req.params.id}`, 400));
  }

  const course = await Course.findById(req.params.id).populate("bootcamp");

  if (!course) {
    return next(new ErrorResponse(`No Course with id ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: course });
});

// @desc    Create a course
// @route   POST api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  const bootcampId = req.params.bootcampId;
  req.body.user = req.user._id;

  // check if id valid , then find
  if (!mongoose.Types.ObjectId.isValid(bootcampId)) {
    return next(new ErrorResponse(`Invalid Id ${bootcampId}`, 400));
  }
  const bootcamp = await Bootcamp.findById(bootcampId);
  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with id ${bootcampId}`, 404));
  }

  // manually set bootcampId for course model
  req.body.bootcamp = bootcampId;
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to create a course in bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({ success: true, data: course });
});

// @desc    Update course
// @route   PUT api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return next(new ErrorResponse(`Invalid id ${courseId}`, 400));
  }
  const course = await Course.findById(courseId);
  if (!course) {
    return next(new ErrorResponse(`No course with id ${courseId}`, 400));
  }

  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update a course in bootcamp ${course._id}`,
        401
      )
    );
  }
  const courseUpdated = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  return res.json({ success: true, data: courseUpdated });
});

// @desc   Delete a course
// @route  DELETE api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return next(new ErrorResponse(`Invalid id ${courseId}`, 400));
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorResponse(`No course with id ${courseId}`, 400));
  }

  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete a course in bootcamp ${course._id}`,
        401
      )
    );
  }
  const courseDeleted = await course.remove();

  res.json({ success: true, data: courseDeleted });
});
