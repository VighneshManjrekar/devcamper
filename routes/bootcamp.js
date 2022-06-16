const router = require("express").Router();
const {
  getBootcamp,
  getBootcamps,
  getBootcampInRadius,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamp");

// Include another routes
const courseRoutes = require("./course");

router.route("/").get(getBootcamps).post(createBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

// Rerouting to another resource router
router.use("/:bootcampId/courses", courseRoutes);

module.exports = router;
