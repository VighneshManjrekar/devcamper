const path = require("path");
const slugify = require("slugify");
const mongoose = require("mongoose");

const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../middleware/geocode");

// @desc    Get all bootcamps
// @route   GET api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  return res.status(200).json(res.filterResults);
});

// @desc    Create bootcamp
// @route   POST api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  req.body.user = req.user._id;

  // Check if user already published a bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user._id });
  // allow only admin to published more than one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with id ${req.user._id} already published a bootcamp with the title '${publishedBootcamp.name}'`,
        400
      )
    );
  }
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Get bootcamp with id
// @route   GET api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorResponse(`Invalid Id ${req.params.id}`, 400));
  }
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
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorResponse(`Invalid Id ${req.params.id}`, 400));
  }
  // update slug while updating name
  if (Object.keys(req.body).includes("name")) {
    req.body.slug = slugify(req.body.name, { lower: true });
  }

  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id ${req.params.id}`, 400));
  }

  if (bootcamp.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User with id ${req.params.id} is not the owner of bootcamp`,
        401
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorResponse(`Invalid Id ${req.params.id}`, 400));
  }
  const bootcamp = await Bootcamp.findById(req.params.id);
  console.log(bootcamp)
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id ${req.params.id}`, 400));
  }

  if (bootcamp.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User with id ${req.params.id} is not the owner of bootcamp`,
        401
      )
    );
  }

  await bootcamp.remove()
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Get bootcamp within radius
// @route   GET api/v1/bootcamps/radius/:zipcode/:distance
// @access  Public
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

// @desc    Upload bootcamp banner
// @route   PUT api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ErrorResponse(`Invalid Id ${req.params.id}`, 400));
  }
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id ${req.params.id}`, 400));
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a photo`, 400));
  }

  const file = req.files.file;
  console.log(file);

  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload a photo less than ${process.env.MAX_FILE_SIZE}bytes`,
        400
      )
    );
  }

  if (
    !(
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/svg+xml"
    )
  ) {
    return next(
      new ErrorResponse(
        `Please upload a file with an image type (png, jpeg, svg)`,
        415
      )
    );
  }

  const fileName = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_PATH}/${fileName}`, (err) => {
    if (err) {
      return next(new ErrorResponse(`Internal error file not uploaded`, 500));
    }
  });

  await Bootcamp.findByIdAndUpdate(bootcamp._id, { photo: fileName });
  res.status(200).json({ success: true, data: fileName });
});
