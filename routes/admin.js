const router = require("express").Router();

const User = require("../models/User");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/admin");

const filterResults = require("../middleware/filter");
const { protect, authorization } = require("../middleware/auth");

router.use(protect);
router.use(authorization("admin"));

router.route("/").get(filterResults(User), getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
