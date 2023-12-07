const configCollection = require("../db/models/configModel"); 
const root = async (req, res) => {
  try {
    const config = await configCollection.findOne({});
    res.json({
      servarStatus: "Server are ok ",
      databaseConncetion: config ? "Sucessfull" : "Failed",
    });
  } catch (error) {
    res.json({
      servarStatus: "Something is wrong, check your server ",
    });
  }
};
module.exports = root;
