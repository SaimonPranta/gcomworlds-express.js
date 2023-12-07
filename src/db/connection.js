const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI).then((success) => {
  console.log("successfully connected with database.");
});
