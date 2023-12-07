const router = require("express").Router();
const userCollection = require("../../db/models/userModel");

router.get("/upgrade_to_affiliate", async (req, res) => {
  try {
    const userID = req.userID;
    console.log("userID", req.userID);

    const user = await userCollection.findOne({ userID }).select("accountType");
    if (!user || user.accountType === "buyer") {
      return res.json({
        success: false,
        message: "Something is wrong please try again letter",
      });
    }

    const updateInfo = {
      accountType: "affiliate_marketer",
      isActive: false,
    };
    const updateUser = await userCollection.findOneAndUpdate(
      {
        userID,
      },
      {
        ...updateInfo,
      },
      { new: true }
    );
    res.json({
      success: true,
      message:
        "Congratulation your user account successfully upgrade to affiliate account",
    });
  } catch (error) {
    console.log("error", error);
  }
});

module.exports = router;
