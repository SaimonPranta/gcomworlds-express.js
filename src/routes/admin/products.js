const express = require("express");
const { addProduct, getAllProducts, deleteProduct, updateProduct } = require("../../controllers/admin/products");
const router = express.Router();

router.post("/add_product", addProduct);
router.get("/all", getAllProducts);
router.delete("/delete_product/:id", deleteProduct);
router.patch("/update_product", updateProduct);



module.exports = router;
