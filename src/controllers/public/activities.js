const configCollection = require("../../db/models/configModel");

exports.getConfig = async (req, res) => {
  try {

    const data = await configCollection.findOne({siteName: "GconWorld"})
    if (!data) {
        return res.json({ failed: "Failed to load data" });
    }
    res.json({ data: data});

  } catch (error) {
    res.json({failed: "Failed to load data"})
  }
};
