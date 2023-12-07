const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    points: {
      type: String,
      require: true,
    },
    link: {
      type: String,
      require: true,
    },
    from: {
      type: String,
      require: true,
    },
    to: {
      type: String,
      require: true,
    },
  },
);

const taskCollection = new mongoose.model(
  "taskCollection",
  taskSchema
);

module.exports = taskCollection;
