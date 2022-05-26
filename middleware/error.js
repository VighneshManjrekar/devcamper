const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  const error = { ...err };

  error.message = err.message;
  error.name = err.name;

  // castError handler
  if (error.name == "CastError") {
    error.message = `Bootcamp with id ${error.value} cannot be find`;
    new ErrorResponse(error.message, 404);
  }

  // Duplicate field error
  if (error.code == 11000) {
    error.message = "Duplicate field value entered";
    new ErrorResponse(error.message, 400);
  }

  // MongoError
  if (error.name == "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.properties.message);
    error.message = errors;
    new ErrorResponse(error.message, 400);
  }

  res
    .status(err.status || 500)
    .json({ success: false, error: error.message || "Internal Server Error" });
};

module.exports = errorHandler;
