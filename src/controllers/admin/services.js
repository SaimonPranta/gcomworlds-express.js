const fs = require("fs-extra");
const serviceCollection = require("../../db/models/serviceModel");
exports.addService = async (req, res) => {
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
        message: "failed to add service",
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
      const serviceInfo = await {
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
      if (viewAs) serviceInfo.viewAs = await viewAs;

      const documents = await new serviceCollection(serviceInfo);
      const data = await documents.save();

      if (data._id) {
        await image.mv(`${__dirname}/../../../images/services/${image.name}`);

        res.status(201).json({
          data: data,
          message: "sucessfully added service",
        });
      } else {
        res.status(417).json({
          message: "failed to add service",
        });
      }
    }
  } catch (error) {
    res.status(417).json({
      message: "failed to add service",
    });
  }
};
exports.getSingleService = async (req, res) => {
  try {
    const { id } = await req.params;
    if (!id) {
      return res.status(500).json({
        failed: "failed to provide service",
      });
    }
    const data = await serviceCollection.findOne({ _id: id });
    if (data._id)
      res.status(200).json({
        sucess: "sucessfully get service",
        data: data,
      });
  } catch (error) {
    res.status(500).json({
      failed: "failed to provide service",
    });
  }
};
exports.getAllServices = async (req, res) => {
  try {
    const data = await serviceCollection.find();
    if (data.length) {
      res.status(200).json({
        data: data,
        message: "sucessfully provided all service",
      });
    } else {
      res.status(412).json({
        message: "failed to load service",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "failed to load service",
    });
  }
};
exports.updateService = async (req, res) => {
  try {
    const {
      title,
      dis,
      price,
      discount,
      discountForUser,
      category,
      img,
      rating,
      detailsArray,
      viewAs,
      _id,
    } = await JSON.parse(req.body.data);
    const isImageExist = req.files ? true : false;
    const serviceInfo = await {
      title,
      dis,
      price,
      discount,
      discountForUser,
      category,
      rating,
      detailsArray,
    };

    if (_id) {
      if (isImageExist) {
        const image = req.files.newImg;
        if (
          image.mimetype !== "image/jpg" &&
          image.mimetype !== "image/png" &&
          image.mimetype !== "image/jpeg"
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

          serviceInfo["img"] = await image.name;

          const data = await serviceCollection.findOneAndUpdate(
            {
              _id,
            },
            {
              ...serviceInfo,
            }
          );
          if (!data) {
            return res.status(200).json({
              failed: "failed to deleted service",
            });
          }
          await image.mv(`${__dirname}/../../../images/services/${image.name}`);
          await fs.removeSync(
            `${__dirname}/../../../images/services/${data.img}`
          );

          res.status(200).json({
            sucess: "sucessfully updated service",
            data: data,
          });
        }
      } else {
        const data = await serviceCollection.findOneAndUpdate(
          {
            _id,
          },
          {
            ...serviceInfo,
          },
          {
            new: true,
          }
        );
        if (!data._id) {
          return res.status(200).json({
            failed: "failed to deleted service",
          });
        }
        res.status(200).json({
          sucess: "sucessfully updated service",
          data: data,
        });
      }
    } else {
      res.status(200).json({
        failed: "failed to update service",
      });
    }
  } catch (error) {
    res.status(200).json({
      failed: "failed to update service",
    });
  }
};
exports.deleteService = async (req, res) => {
  try {
    const { id } = await req.params;
    if (id) {
      const data = await serviceCollection.findOneAndDelete({ _id: id });
      if (!data._id) {
        return res.status(200).json({
          failed: "failed to deleted service",
        });
      }
      await fs.removeSync(`${__dirname}/../../../images/services/${data.img}`);
      res.status(200).json({
        sucess: "sucessfully deleted service",
        data: data,
      });
    }
  } catch (error) {
    res.status(200).json({
      failed: "failed to deleted service",
    });
  }
};

exports.getServicesByPagination = async (req, res) => {
  try {
    const page = await Number(req.params.page);
    const dataLength = await serviceCollection.find({}, { _id: 1 });
    const limite = 8;
    const skip =
      (await Number(dataLength.length)) > Number(limite * page)
        ? Number(dataLength.length) - Number(limite * page)
        : 0;
    const data = await serviceCollection.find().skip(skip).limit(limite);

    if (data.length) {
      res.status(200).json({
        data: data,
        message: "sucessfully provided all service",
        disable: skip == 0 ? true : false,
      });
    } else {
      res.status(412).json({
        message: "failed to load service",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "failed to load service",
    });
  }
};
