const router = require("express").Router({mergeParams:true});


const { getAllCourses } = require("../controllers/course");

router.route("/").get(getAllCourses);

module.exports = router;
