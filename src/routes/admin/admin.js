const express = require("express");
const {
  allUser,
  userSummary,
  viewProfile,
  updateUser,
  addTask,
  getTask,
  editTask,
  deleteTask,
  pendingUser,
  deleteUser,
  approveUser,
  dailyWithdrawDecline,
  dailyWithdrawApprove,
  regularWithdrawDecline,
  regularWithdrawApprove,
  distributeRegualrPoints,
  addNotification,
  deleteNotification,
} = require("../../controllers/admin/admin");
const router = express.Router();

router.get("/all_user", allUser)
router.get("/user_summary", userSummary);
router.get("/view_profile/:id", viewProfile);
router.patch("/update_user/:id", updateUser);
router.post("/add_task", addTask);
router.get("/get_task", getTask);
router.post("/edit_task/:id", editTask);
router.delete("/delete_task/:id", deleteTask);
router.get("/pending-user", pendingUser);
router.delete("/delete_request/:id", deleteUser);
router.get("/approve_request/:id", approveUser);
router.post("/daily_withdraw_decline", dailyWithdrawDecline);
router.post("/daily_withdraw_approve", dailyWithdrawApprove);
router.post("/regular_withdraw_decline", regularWithdrawDecline);
router.post("/regular_withdraw_approve", regularWithdrawApprove);
router.get("/distribute_regualr_points/:points", distributeRegualrPoints);

router.post("/add_notification", addNotification);
router.delete("/delete_notification/:id", deleteNotification);












 



module.exports = router;
