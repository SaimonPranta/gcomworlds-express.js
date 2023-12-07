const express = require("express");
const { addTaskToUser, clearAllTask } = require("../../controllers/user/task");
const userAuthGard = require("../../middleware/userAuthGard");

const router = express.Router();

router.post("/add_task_in_user", userAuthGard, addTaskToUser);
router.get("/clear_all_task", userAuthGard, clearAllTask);




module.exports = router;
