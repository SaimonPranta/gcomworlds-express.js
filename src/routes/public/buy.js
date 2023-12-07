const express = require("express");
const router = express.Router();
const { buyRequest, buyRequestDelete, GetAllBuyRequest } = require("../../controllers/public/buy");


router.get("/get_all_buy_request", GetAllBuyRequest);

router.post("/buy_request", buyRequest);
router.delete("/buy_request_delete/:id", buyRequestDelete);

module.exports = router;
