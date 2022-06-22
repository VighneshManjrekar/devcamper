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

const filterResults = require("../middleware/filter");
const Bootcamp = require("../models/Bootcamp");

// Include another routes
const courseRoutes = require("./course");

router
  .route("/")
  .get(filterResults(Bootcamp, "courses"), getBootcamps)
  .post(createBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/:id/photo").put(bootcampPhotoUpload);

// Rerouting to another resource router
router.use("/:bootcampId/courses", courseRoutes);

module.exports = router;
