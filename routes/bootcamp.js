const router = require("express").Router();
const {
  getBootcamp,
  getBootcamps,
  getBootcampInRadius,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload,
} = require("../controllers/bootcamp");

// middlewares
const filterResults = require("../middleware/filter");
const { protect, authorization } = require("../middleware/auth");

// Bootcamp model
const Bootcamp = require("../models/Bootcamp");

// Include another routes
const courseRoutes = require("./course");

router
  .route("/")
  .get(filterResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorization("publisher", "admin"), createBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorization("publisher", "admin"), updateBootcamp)
  .delete(protect, authorization("publisher", "admin"), deleteBootcamp);

router
  .route("/:id/photo")
  .put(protect, authorization("publisher", "admin"), bootcampPhotoUpload);

// Rerouting to another resource router
router.use("/:bootcampId/courses", courseRoutes);

module.exports = router;
