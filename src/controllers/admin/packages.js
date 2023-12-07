const packageCollection = require("../../db/models/packagesModel");
const fs = require("fs-extra");

exports.getAllPackages = async (req, res) => {
  try {
    const data = await packageCollection.find();
    if (data.length) {
      res.status(200).json({
        data: data,
        message: "sucessfully provided all product",
      });
    } else {
      res.status(412).json({
        message: "failed to load product",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "failed to load product",
    });
  }
};

exports.addPackage = async (req, res) => {
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
      viewAs,
    } = await JSON.parse(req.body.data);

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
    if (
      image.mimetype !== "image/jpg" &&
      image.mimetype !== "image/png" &&
      image.mimetype !== "image/jpeg" &&
      id
    ) {
      res
        .status(500)
        .send({ failed: "Only .jpg .png or .jpeg format allowed !" });
    } else if (image.size >= "1500012") {
      res.status(500).send({ failed: "Image Size are too large !" });
    } else {
      const extention = await image.mimetype.split("/")[1];
      image.name =
        (await image.name.split(".")[0]) +
        Math.floor(Math.random() * 10) +
        Date.now() +
        "." +
        extention;
      const productInfo = await {
        title,
        dis,
        price,
        discount,
        discountForUser,
        category,
        img: image.name,
        rating,
        detailsArray,
      };
      if (viewAs) productInfo.viewAs = await viewAs;

      const documents = await new packageCollection(productInfo);
      const data = await documents.save();

      if (data._id) {
        await image.mv(`${__dirname}/../../../images/packages/${image.name}`);

        res.status(201).json({
          data: data,
          message: "sucessfully added product",
        });
      } else {
        res.status(417).json({
          message: "failed to add product",
        });
      }
    }
  } catch (error) {
    res.status(417).json({
      message: "failed to add product",
    });
  }
};

exports.deletepackage = async (req, res) => {
  try {
    const { id } = await req.params;
    if (id) {
      const data = await packageCollection.findOneAndDelete({ _id: id });
      if (!data._id) {
        return res.status(200).json({
          failed: "failed to deleted product",
        });
      }
      await fs.removeSync(`${__dirname}/../../../images/packages/${data.img}`);
      res.status(200).json({
        sucess: "sucessfully deleted product",
        data: data,
      });
    }
  } catch (error) {
    res.status(200).json({
      failed: "failed to deleted product",
    });
  }
};

