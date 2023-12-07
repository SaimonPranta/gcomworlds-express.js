const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    messsasge: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
  }
);

const notificationCollection = new mongoose.model(
  "notification_collection",
  notificationSchema
);

module.exports = notificationCollection;
