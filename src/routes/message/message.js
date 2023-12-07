const express = require("express");
const userAuthGard = require("../../middleware/userAuthGard")
const adminAuthGard = require("../../middleware/adminAuthGard");

const {
  createMessage,
  getMessage,
  getAllMessage,
  createAdminMessage,
} = require("../../controllers/message");
const router = express.Router();

router.get("/get_all_message", adminAuthGard, getAllMessage); 
router.get("/get_message", userAuthGard, getMessage); 
router.post("/create_message", userAuthGard, createMessage); 
router.post("/create_admin_message", adminAuthGard, createAdminMessage); 


module.exports = router;
