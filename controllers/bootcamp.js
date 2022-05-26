const slugify = require("slugify");

const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");

// @desc    Get all bootcamps
// @route   GET api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  if (!bootcamps) {
    throw error;
  }

  res.status(200).json({ success: true, data: bootcamps });
});

// @desc    Create bootcamp
// @route   POST api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Get bootcamp with id
// @route   GET api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Update bootcamp
// @route   PUT api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  if (Object.keys(req.body).includes("name")) {
    req.body.slug = slugify(req.body.name, { lower: true });
  }

  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});
