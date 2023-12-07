const mongoose = require("mongoose");

const buyRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: true,
  },
  userID: {
    type: String,
  },
  phoneNumber: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    require: true,
  },
  upazila: {
    type: String,
    require: true,
  },
  streets: {
    type: String,
    require: true,
  },
  provider: {
    type: String,
    require: true,
  },
  mobileBankNumber: {
    type: String,
    require: true,
  },
  transitionID: {
    type: String,
    require: true,
  },
  amountOfTK: {
    type: String,
    require: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  cartArray: {
    type: Array,
    require: true,
  },
  productCostInfo: {
    type: Object,
    require: true,
  },
  requestDate: {
    type: String,
    require: true,
  },
  userMetaData: {
    userID: {
      type: String,
      required: false,
    },
    accountType: {
      type: String,
      required: false,
    },
  },
  affiliateMetaData: {
    userID: {
      type: String,
      required: false,
    },
  },
});

const buyRequestCollection = new mongoose.model(
  "buy_request_collection",
  buyRequestSchema
);

module.exports = buyRequestCollection;
