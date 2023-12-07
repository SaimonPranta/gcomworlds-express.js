const userAuthGard = require("../../middleware/userAuthGard");

const router = require("express").Router();

router.use("/product", userAuthGard, require("./product/index"))

module.exports = router;
