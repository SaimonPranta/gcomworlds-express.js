const express = require("express");
const { getSingleProduct, getProductsByPagination, flashSale, cartProducts, categoryProducts, searchProduct, getAllProducts } = require("../../controllers/admin/products");

const router = express.Router();

router.get("/get_product_by_pagination/:page", getProductsByPagination);
router.get("/get_product/:id", getSingleProduct);
router.get("/flash_sales", flashSale);
router.post("/cart-products", cartProducts);
router.post("/get_product_by_category", categoryProducts);
router.get("/search_product/:name", searchProduct);


module.exports = router;
