const crypto = require("crypto");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const sendMail = require("../utils/mail");

// helper function
const sendToken = (user, statusCode, res) => {
  const token = user.getSignToken();

  const secure = process.env.NODE_ENV == "production" ? true : false;
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};

// @desc    Register a user
// @route   POST api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, role, password } = req.body;

  const user = await User.create({
    name,
    email,
    role,
    password,
  });

  sendToken(user, 200, res);
});

// @desc    Login user
// @route   POST api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  sendToken(user, 200, res);
});

// @desc    Forgot password
// @route   POST api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorResponse(`No user with email ${email}`));
  }

  const resetToken = user.createHashPassword();
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/reset-password/${resetToken}`;
  const text = `
  Hi ${user.name},
  You recently requested to reset the password for your DevCamper account. Follow this link to proceed:
  ${resetUrl}.

  Thanks, DevCamper team
  `;
  const option = {
    to: user.email,
    subject: "Reset Password",
    text,
  };

  user = await user.save({ validateBeforeSave: true });

  try {
    await sendMail(option);
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordDate = undefined;
    await user.save();
    return next(new ErrorResponse("Email not sent", 500));
  }

  res.status(200).json({ success: true, data: "Email sent" });
});

// @desc    Reset password
// @route   PUT api/v1/auth/reset-password/:resetToken
// @access  Public
exports.resetPassowrd = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  let user = await User.findOne({
    resetPasswordToken,
    resetPasswordDate: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 401));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordDate = undefined;

  user = await user.save();

  sendToken(user, 200, res);
});

// @desc    Update password
// @route   PUT api/v1/auth/update-password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  let user = await User.findById(req.user.id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse("Incorrect password", 400));
  }

  user.password = newPassword;
  user = await user.save();

  sendToken(user, 200, res);
});

// @desc    Update user
// @route   PUT api/v1/auth/update-user
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { email, name } = req.body;
  console.log(email,name)
  const updateDetails = {
    email,
    name,
  };
  let user = await User.findByIdAndUpdate(req.user.id, updateDetails, {
    new: true,
    runValidators: true,
  });

  // if(!user){
  //   return next(new ErrorResponse("Incorrect password", 400))
  // }

  res.status(200).json({ success: true, data: user });
});

// @desc    Get user
// @route   POST api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: user });
});
