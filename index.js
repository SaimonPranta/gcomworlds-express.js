const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("./src/db/connection");
const path = require("path");
const userAuthGard = require("./src/middleware/userAuthGard");
const adminAuthGard = require("./src/middleware/adminAuthGard");
const root = require("./src/routes/root");
const productCollection = require("./src/db/models/productModel");
const app = express();
const port = process.env.PORT || 8000;



app.use(cors())
app.use(express.json())
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "/images/user/profile picture")));
app.use(express.static(path.join(__dirname, "/images/config")));
app.use(express.static(path.join(__dirname, "/images/products")));
app.use(express.static(path.join(__dirname, "/images/services")));
app.use(express.static(path.join(__dirname, "/images/packages")));



app.get("/", root);

// app.get("/get-all-product", async (req, res) => {
//     try {
//         const product = await productCollection.find()

//         // await product.forEach(async (item) => {
//         //     await productCollection.findOneAndUpdate(
//         //       { _id: item._id },
//         //       {
//         //         img: [...item.img[0]],
//         //       }
//         //     );
//         // })
//         console.log("product", product[0]);
//         res.json({})
//     } catch (error) { 
// console.log("error", error);
//     }
// })

app.use("/public", require("./src/routes/public/public"));
app.use("/user", require("./src/routes/user/user"));
app.use("/activities", userAuthGard, require("./src/routes/user/activities"));
app.use("/admin", adminAuthGard, require("./src/routes/admin/admin"));
app.use("/products", adminAuthGard, require("./src/routes/admin/products"));
app.use("/public_product", require("./src/routes/public/products"));
app.use("/services", adminAuthGard, require("./src/routes/admin/services"));
app.use("/public_service", require("./src/routes/public/service"));
app.use("/buy_product", require("./src/routes/public/buy"));
app.use("/packages", require("./src/routes/admin/packages"));
app.use("/message", require("./src/routes/message/message"));
app.use("/seller", require("./src/routes/seller/index"));
app.use("/buyer", require("./src/routes/buyer/index"));




// ====== Error Handling Middleware ======
app.use((error, req, res, next) => {
    if (error.message) {
        res.status(500).send({ error: error.message })
    } else if (error) {
        res.status(500).send({ error: "Something is wrong, please try out letter" })
    }
});


app.listen(port, () => {
  console.log(`Server are listening on PORT ${port}`);
});

