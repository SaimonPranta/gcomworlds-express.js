const express = require("express");
const { addService, getAllServices, deleteService, updateService } = require("../../controllers/admin/services");

const router = express.Router();

router.post("/add_service", addService); 
router.get("/all", getAllServices);;
router.delete("/delete_services/:id", deleteService);;
router.patch("/update_service", updateService);


module.exports = router;
