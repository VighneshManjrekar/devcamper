const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV == "development") {
    console.log(err);
  }
  const error = { ...err };

  error.message = err.message;
  error.name = err.name;

  // castError handler
  if (error.name == "CastError") {
    error.message = `Invalid Resource Id`;
    new ErrorResponse(error.message, 404);
  }

  // Duplicate field error
  if (error.code == 11000) {
    error.message = `${Object.keys(error.keyValue).join("")} already exists`;
    if (Object.keys(error.keyValue).includes("user")) {
      error.message =
        "One user can only write single review on an each bootcamp";
    }
    error.status = 400;
    new ErrorResponse(error.message, error.status);
  }

  // MongoError
  if (error.name == "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.properties.message);
    error.message = errors;
    error.status = 400;
    console.log(error.message);
    new ErrorResponse(error.message, error.status);
  }

  if (error.name == "JsonWebTokenError" && error.message == "jwt malformed") {
    error.message = "Invalid token";
    error.status = 401;
    new ErrorResponse(error.message, error.status);
  }

  res
    .status(error.status || 500)
    .json({ success: false, error: error.message || "Internal Server Error" });
};

module.exports = errorHandler;
