const express = require("express");
const router = express.Router();
const {
  user,
  getUser,
  userRegistration,
  login,
  updateUser,
  resetPassword,
  addImage,
  deleteUser,
  registationExistingInfoVerification,
  readUserByTokenInfo,
  getTask,
  temaMembers,
  getPlacementUser,
  volumeCount,
  buyerRegistration,
  sellerRegistration,
} = require("../../controllers/user/user");
const adminAuthGard = require("../../middleware/adminAuthGard");

const userAuthGard = require("../../middleware/userAuthGard");

router.get("/get_user", userAuthGard, getUser);
router.get("/read_user_by_cooki_info", userAuthGard, readUserByTokenInfo);

router.post(
  "/registation/data_verification",
  registationExistingInfoVerification
);
router.post("/registation", userRegistration);
router.post("/buyer-registration", buyerRegistration);
router.post("/seller-registration", sellerRegistration);
router.post("/login", login);
router.patch("/update/:id", updateUser);
router.patch("/reset_password/:id", resetPassword);
router.patch("/add_image/:id", addImage);
router.delete("/delete/:id", deleteUser);
router.get("/get_task", getTask);
router.get("/team_members", userAuthGard, temaMembers);
router.get("/volume_count", userAuthGard, volumeCount);

router.get("/get_placement_user/:id", getPlacementUser);

router.use("/task", require("./task"));





module.exports = router;
