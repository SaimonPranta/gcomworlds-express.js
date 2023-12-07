const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversetionID: {
      type: String,
      require: true,
    },
    senderID: {
      type: String,
      require: true,
    },
    reciverID: {
      type: String,
      require: true,
    },
    message: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const messageCollection = new mongoose.model("messageCollection", messageSchema);

module.exports = messageCollection;
