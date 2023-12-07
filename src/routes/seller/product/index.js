const productCollection = require("../../../db/models/productModel");
const imageValidation = require("../../../functions/imageValidation");

const router = require("express").Router();

router.post("/add_product", async (req, res) => {
  try {
    const image = req.files.img;
    const {
      title,
      dis,
      price,
      discount,
      discountForUser,
      category,
      rating,
      detailsArray,
      sellerPrice,
      mrpProduct,
    } = await JSON.parse(req.body.data);
    const images = Object.entries(req.files).map((item) => item[1]);
    const body = await await JSON.parse(req.body.data);

    if (
      !title &&
      !dis &&
      !price &&
      !discount &&
      !discountForUser &&
      !category &&
      !image &&
      !rating &&
      !detailsArray
    ) {
      return res.status(417).json({
        message: "failed to add product",
      });
    }

    const { validation, message } = await imageValidation(images);
    if (!validation) {
      return res.status(500).send({ failed: message });
    }

    const imgNameArray = await [];

    const updatedImgArray = await images.map((img, index) => {
      const extension = img.mimetype.split("/")[1];
      const name =
        img.name.split(".")[0] +
        Math.floor(Math.random() * 10) +
        Date.now() +
        "." +
        extension;
      imgNameArray.push(name);
      return {
        ...img,
        name: name,
      };
    });

    const productInfo = await {
      ...body,
      img: imgNameArray,
      sellerMetaData: {
        userID: req.userID,
        sellerPrice: Number(sellerPrice),
        mrpProduct: mrpProduct ? true : false,
      },
    };
    if (!body?.sealAs?.includes("Wholesale")) {
      delete productInfo["WholesaleCount"];
    }
    console.log("productInfo", productInfo);


    const documents = await new productCollection(productInfo);
    const data = await documents.save();

    if (data._id) {
        console.log("data ==>>",data)
      await updatedImgArray.forEach(async (img) => {
        await img.mv(`${__dirname}/../../../../images/products/${img.name}`);
      });

      res.status(201).json({
        data: data,
        message: "successfully added product",
      });
    } else {
      res.status(417).json({
        message: "failed to add product",
      });
    }
  } catch (error) {
    console.log("error", error);
    res.json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
