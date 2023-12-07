const express = require("express");
const { getConfig } = require("../../controllers/public/activities");
const {
  getPlacementID,
  addHeroImg, 
  addSliderImg,
  deleteSliderImg,
  addLaicence,
  deleteLaicenceInfo,
  selectPlacementVolume,
  userIDVerifyer,
  userIsExist,
  forgotPassword,
  getNofication, 
} = require("../../controllers/public/user");

const router = express.Router();
router.get("/get_config", getConfig);
router.get("/get_placement_id/:userID", getPlacementID);
router.get("/select_placement_volume/:volume", selectPlacementVolume);

router.post("/eddit_hero_img/:objName", addHeroImg);
router.post("/add_hero_img", addSliderImg);
router.delete("/delete_img", deleteSliderImg);
router.post("/add_laicence", addLaicence);
router.delete("/delete_laicence", deleteLaicenceInfo);
router.get("/user_verifier/:id", userIDVerifyer);

router.get("/is_user_exist/:userID", userIsExist);
router.post("/forgot_password", forgotPassword);

router.get("/notification", getNofication);







module.exports = router;