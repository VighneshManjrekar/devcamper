const router = require("express").Router({ mergeParams: true });

const {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course");

const filterResults = require("../middleware/filter");
const Course = require("../models/Course");

router
  .route("/")
  .get(
    filterResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getAllCourses
  )
  .post(addCourse);

router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
