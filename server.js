// env
require("dotenv").config({ path: "./configs/config.env" });

const express = require("express");
const morgan = require("morgan");

const PORT = process.env.PORT || 7000;

const app = express();

// routes
const bootcamp = require("./routes/bootcamp");

// mount routers
app.use("/api/v1/bootcamps", bootcamp);

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on ${PORT} port...`)
);
