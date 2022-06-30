const router = require("express").Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassowrd,
  updatePassword,
  updateUser,
} = require("../controllers/auth");

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login); 
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassowrd);
router.put("/update-user", protect, updateUser);
router.put("/update-password", protect, updatePassword);
router.get("/me", protect, getMe);

module.exports = router;
