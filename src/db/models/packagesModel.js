const mongoose = require("mongoose");

const package_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    dis: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    discountForUser: {
      type: Number,
      required: true,
      default: 0,
    },
    img: {
      type: String,
      required: true,
      unique: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    detailsArray: [
      new mongoose.Schema({
        property: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      }),
    ],
    trific: {
      type: Number,
      required: true,
      default: 0,
    },
    viewAs: {
      type: String,
      default: "general",
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const packageCollection = new mongoose.model(
  "packages_collectionss",
  package_schema
);

module.exports = packageCollection;
