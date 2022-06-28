const router = require("express").Router({ mergeParams: true });

const {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/course");

// middlewares
const filterResults = require("../middleware/filter");
const { protect, authorization } = require("../middleware/auth");

// Course model
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
  .post(protect,authorization("publisher","admin"), addCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(protect,authorization("publisher","admin"), updateCourse)
  .delete(protect,authorization("publisher","admin"), deleteCourse);

module.exports = router;
