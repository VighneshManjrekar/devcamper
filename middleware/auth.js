const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  let authToken = req.headers.authorization;
  
  if (authToken && authToken.startsWith("Bearer")) {
    token = authToken.split(" ")[1];
  }
  //    else if (req.cookies.token) {
  //     token = req.cookies.token;
  //   }

  if (!token) {
    return next(new ErrorResponse("Unauthorized", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});

exports.authorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Access to this route is forbidden for '${req.user.role}' role`,
          403
        )
      );
    }
    next();
  };
};
