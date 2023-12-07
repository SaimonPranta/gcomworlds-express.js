const mongoose = require("mongoose");

const product_schema = new mongoose.Schema(
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
      type: Array,
      required: true,
      unique: true,
      default: [],
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
      type: Array,
      required: true,
    },
    sealAs: {
      type: Array,
      required: true,
      default: ["Retail"],
      // enum: ["Retail", "Wholesale"]
    },
    WholesaleCount: {
      type: Number,
      required: true,
      default: 0,
    },
    adminCommission: {
      type: Number,
      required: true,
      default: 0,
    },
    colors: {
      type: Array,
      required: true,
      default: [],
    },
    deliveryCharge: {
      type: Number,
      required: true,
      default: 0,
    },
    sellerMetaData: {
      userID: {
        type: String,
      },
      sellerPrice: {
        type: Number,
      },
      mrpProduct: {
        type: Boolean,
      },
    },
    orders: {
      type: Number,
      require: true,
      default: 0,
    },
    stackOut: {
      type: Boolean,
      require: true,
      default: false,
    },
    buy: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const productCollection = new mongoose.model(
  "product_collectionss",
  product_schema
);

module.exports = productCollection;
