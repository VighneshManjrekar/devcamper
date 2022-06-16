const slugify = require("slugify");

const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../middleware/geocode");

// @desc    Get all bootcamps
// @route   GET api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  let queryParams = { ...req.query };

  // Remove fields that we don't wanna match like 'select' is not a "actual field" in database it is a filter to select sepcific fields only so we dont need that hence removing it from DUPLICATE req.query object
  let removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((field) => delete queryParams[field]);

  let queryString = JSON.stringify(queryParams);
  queryString = queryString.replace(
    // find pattern
    /\b(gt|gte|lt|lte|in)\b/g,
    // if found add prefix $
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryString));

  // Here we will check if we have select query from "ACTUAL" request if yes we will filter fields as needed
  if (req.query.select) {
    const selectStr = req.query.select.split(",").join(" ");
    // query.select(field1 field2 ... fieldN) is like SELECT col1,col2 from SQL <selecting speicific fields from fetched data>
    query.select(selectStr);
  }

  // Here we will sort results
  if (req.query.sort) {
    const sortStr = req.query.sort.split(",").join(" ");
    query.sort(sortStr);
  } else {
    query.sort("createdAt");
  }

  // Pagination
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 25;
  const startId = (page - 1) * limit;
  const endId = page * limit;
  const total = await Bootcamp.countDocuments();
  const pagination = { total };

  query.skip(startId).limit(limit);

  if (endId < total) {
    pagination.next = page + 1;
    pagination.limit = limit;
  }
  if (startId > 0) {
    pagination.prev = page - 1;
    pagination.limit = limit;
  }

  const bootcamps = await query;
  // To populate courses
  // const bootcamps = await query.populate({
  //   path:'courses',
  //   select: 'title',
  // });

  if (!bootcamps) {
    throw error;
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc    Create bootcamp
// @route   POST api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res
    .status(201)
    .json({ success: true, count: bootcamp.length, data: bootcamp });
});

// @desc    Get bootcamp with id
// @route   GET api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({ success: true, count: bootcamp.length, data: bootcamp });
});

// @desc    Update bootcamp
// @route   PUT api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  // update slug while updating name
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

  res
    .status(200)
    .json({ success: true, count: bootcamp.length, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  bootcamp.remove();
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id ${req.params.id}`, 404));
  }

  res
    .status(200)
    .json({ success: true, count: bootcamp.length, data: bootcamp });
});

// @desc    Get bootcamp within radius
// @route   GET api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const [loc] = await geocoder.geocode(zipcode);
  const lat = loc.latitude;
  const lng = loc.longitude;

  // Radius of earth 6371*100m
  const radius = distance / 6371;

  // const bootcamps = await Bootcamp.find({
  //   location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  // });

  //  Or

  const bootcamps = await Bootcamp.find()
    .where("location")
    .within({ center: [lng, lat], radius, spherical: true });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
