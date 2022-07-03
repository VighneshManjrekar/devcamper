const mongoose = require("mongoose");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const Review = require("../models/Review");

// @desc  Get all reviews
// @route GET api/v1/reviews
// @route GET api/v1/bootcamps/:bootcampId/reviews
// @access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  const bootcamp = req.params.bootcampId;
  if (bootcamp) {
    if (!mongoose.isValidObjectId(bootcamp)) {
      new ErrorResponse(`${bootcamp} Invalid id`, 400);
    }

    const reviews = await Review.find({ bootcamp });

    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json({ success: true, data: res.filterResults });
  }
});

// @desc  Get single review
// @route GET api/v1/reviews/:id
// @access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    new ErrorResponse(`Please provide review id`, 400);
  }

  if (!mongoose.isValidObjectId(id)) {
    new ErrorResponse(`${id} Invalid id`, 400);
  }

  const review = await Review.findById(id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    new ErrorResponse(`No review with id ${id}`, 404);
  }
  res.status(200).json({ success: true, data: review });
});

// @desc  Create review
// @route POST api/v1/bootcamps/:bootcampId/reviews
// @access Private
exports.postReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with id ${req.params.bootcampId}`, 404)
    );
  }

  const review = await Review.create(req.body);

  res.status(200).json({ success: true, data: review });
});

// @desc  Update review
// @route PUT api/v1/reviews/:id
// @access Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  let review = await Review.findById(id);

  if (!review) {
    return next(new ErrorResponse(`No review with id ${req.params.id}`, 404));
  }

  if (review.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update review ${id}`,
        401
      )
    );
  }

  review = await Review.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

// @desc  Delete review
// @route DELETE api/v1/reviews/:id
// @access Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const review = await Review.findById(id);

  if (!review) {
    return next(new ErrorResponse(`No review with id ${req.params.id}`, 404));
  }

  if (review.user.toString() != req.user.id && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update review ${id}`,
        401
      )
    );
  }

  await review.remove();

  res.status(200).json({ success: true, data: {} });
});
