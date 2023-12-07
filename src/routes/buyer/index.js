const userAuthGard = require("../../middleware/userAuthGard");

const router = require("express").Router();

router.use("/activities", userAuthGard, require("./activities"))

module.exports = router;
