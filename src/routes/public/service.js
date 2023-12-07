const express = require("express");
const { getSingleService, getServicesByPagination } = require("../../controllers/admin/services");

const router = express.Router();
router.get("/get_service_by_pagination/:page", getServicesByPagination);
router.get("/get_service/:id", getSingleService);

module.exports = router;
