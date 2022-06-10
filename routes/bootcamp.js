const router = require("express").Router();
const {
  getBootcamp,
  getBootcamps,
  getBootcampInRadius,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamp");

router.route("/").get(getBootcamps).post(createBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
