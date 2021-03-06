const NodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.MAP_PROVIDER,
  apiKey: process.env.MAP_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
