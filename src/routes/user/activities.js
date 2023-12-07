const express = require("express");
const {
  pointTransfer,
  dailyWithdraw,
  regularWithdraw,
} = require("../../controllers/user/activities");

const router = express.Router();


router.post("/point_transfer", pointTransfer)
router.post("/daily_withdraw", dailyWithdraw);
router.post("/regular_withdraw", regularWithdraw);



module.exports = router;