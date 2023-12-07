const express = require("express");
const { addPackage, getAllPackages, deletepackage } = require("../../controllers/admin/packages");
 const adminAuthGard = require("../../middleware/adminAuthGard")
const router = express.Router();

router.post("/add_package", adminAuthGard, addPackage);
router.get("/all", getAllPackages);
router.delete("/delete_package/:id", deletepackage);
 

module.exports = router;
