const router = require("express").Router({ mergeParams: true });

const Review = require("../models/Review");

const {
  getReviews,
  getReview,
  postReview,
  updateReview,
  deleteReview,
} = require("../controllers/review");

const filterResults = require("../middleware/filter");
const { protect, authorization } = require("../middleware/auth");

router
  .route("/")
  .get(
    filterResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorization("user", "admin"), postReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorization("user", "admin"), updateReview)
  .delete(protect, authorization("user", "admin"), deleteReview);

module.exports = router;
