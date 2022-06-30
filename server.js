require("dotenv").config({ path: "./configs/config.env" });
require("colors");
const path = require("path");
const express = require("express");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// Security pkgs
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors")

const connectDB = require("./configs/db");
const errorHandler = require("./middleware/error");

const PORT = process.env.PORT || 7000;

const app = express();

app.use(express.json());

// Filehandling express middleware
app.use(
  fileupload({
    createParentPath: true,
  })
);

// cookie parser
app.use(cookieParser());

// Remove data using these defaults:
app.use(mongoSanitize());

// Security headers
app.use(helmet());

// Prevent XSS
app.use(xss());

// Limit req rate
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100, // Each ip maximum 100 requests per 15 minutes
});
app.use(limiter);

// Protect against HTTP Parameter Pollution attacks
app.use(hpp());

// Enable CORS
app.use(cors())

// Serving static files
app.use(express.static(path.join(__dirname, "public")));

// routes
const bootcamp = require("./routes/bootcamp");
const course = require("./routes/course");
const review = require("./routes/review");
const auth = require("./routes/auth");
const admin = require("./routes/admin");

// mount routers
app.use("/api/v1/bootcamps", bootcamp);
app.use("/api/v1/courses", course);
app.use("/api/v1/reviews", review);
app.use("/api/v1/auth", auth);
app.use("/api/v1/auth/admin", admin);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} on ${PORT} port...`.bgCyan.black
  );
  connectDB();
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Err: ${err.message}`.bgRed);
  server.close(() => process.exit(1));
});
