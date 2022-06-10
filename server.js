require("dotenv").config({ path: "./configs/config.env" });
require("colors");
const express = require("express");
const connectDB = require("./configs/db");
const errorHandler = require("./middleware/error");

const PORT = process.env.PORT || 7000;

const app = express();
app.use(express.json());

// routes
const bootcamp = require("./routes/bootcamp");

// mount routers
app.use("/api/v1/bootcamps", bootcamp);
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
