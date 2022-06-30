require("dotenv").config({ path: "./configs/config.env" });
require("colors");
const path = require("path");
const express = require("express");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
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
