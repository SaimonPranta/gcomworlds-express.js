const mongoose = require("mongoose");

const configShema = new mongoose.Schema({
  siteName: {
    type: String,
    default: "GconWorld"
  },
  sliderImg: {
    type: Array,
  },
  heroImg: {
    type: Object,
  },
  licenceInfo: {
    type: Array,
  },
});

const configCollection = new mongoose.model(
  "config_collection",
  configShema
);

module.exports = configCollection;
