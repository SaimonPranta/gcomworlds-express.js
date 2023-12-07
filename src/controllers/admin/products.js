const fs = require("fs-extra");
const serviceCollection = require("../../db/models/serviceModel");
const productCollection = require("../../db/models/productModel");
const imageValidation = require("../../functions/imageValidation");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productCollection.find();
    res.json({ success: true, data: [] });
  } catch (error) {
    console.log("error", error);
  }
};

exports.addProduct = async (req, res) => {
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
      colorArray,
      sealAs,
      deliveryCharge,
    } = await JSON.parse(req.body.data);
    const images = Object.entries(req.files).map((item) => item[1]);

    // throw Error("hello")

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
      title,
      dis,
      price,
      discount,
      discountForUser,
      category,
      img: imgNameArray,
      rating,
      detailsArray,
    };

    if (viewAs) productInfo.viewAs = await viewAs;
    if (colorArray) productInfo.colorArray = await colorArray;
    if (sealAs) productInfo.sealAs = await sealAs;
    if (deliveryCharge) productInfo.deliveryCharge = await deliveryCharge;

    const documents = await new productCollection(productInfo);
    const data = await documents.save();

    if (data._id) {
      await updatedImgArray.forEach(async (img) => {
        await img.mv(`${__dirname}/../../../images/products/${img.name}`);
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
    res.status(417).json({
      message: "failed to add product",
    });
  }
};
exports.getSingleProduct = async (req, res) => {
  try {
    const { id } = await req.params;
    if (!id) {
      return res.status(500).json({
        failed: "failed to provide product",
      });
    }
    const data = await productCollection.findOne({ _id: id });
    if (data._id)
      res.status(200).json({
        sucess: "successfully get product",
        data: data,
      });
  } catch (error) {
    res.status(500).json({
      failed: "failed to provide product",
    });
  }
};
exports.getProductsByPagination = async (req, res) => {
  try {
    const page = await Number(req.params.page);
    const dataLength = await productCollection.find({}, { _id: 1 });
    const limite = 8;
    const skip =
      (await Number(dataLength.length)) > Number(limite * page)
        ? Number(dataLength.length) - Number(limite * page)
        : 0;
    const data = await productCollection.find().skip(skip).limit(limite);

    if (data.length) {
      res.status(200).json({
        data: data,
        message: "sucessfully provided all product",
        disable: skip == 0 ? true : false,
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
exports.getAllProducts = async (req, res) => {
  try {
    const data = await productCollection.find();
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
exports.updateProduct = async (req, res) => {
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
      oldImgArray,
      deleteArray,
      deliveryCharge,
      _id,
    } = await JSON.parse(req.body.data);
    const body = await JSON.parse(req.body.data);
    const isImageExist = req.files ? true : false;
    // const productInfo = await {
    //   title,
    //   dis,
    //   price,
    //   discount,
    //   discountForUser,
    //   category,
    //   rating,
    //   detailsArray,
    // };

    const productInfo = await {
      ...body,
    };
    let images = [];
    if (req.files) {
      images = await Object.entries(req.files).map((item) => item[1]);
    }
    let isValid = {
      validation: true,
    };
    if (images.length) {
      isValid = await imageValidation(images);
    }
    if (!isValid.validation) {
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
    productInfo["img"] = await [...imgNameArray, ...oldImgArray];
    if (true) {
      const data = await productCollection.findOneAndUpdate(
        {
          _id,
        },
        {
          ...productInfo,
        },
        {
          new: true,
        }
      );

      if (!data._id) {
        return res.status(200).json({
          failed: "failed to deleted product",
        });
      }
      await updatedImgArray.forEach(async (image) => {
        await image.mv(`${__dirname}/../../../images/products/${image.name}`);
      });
      if (deleteArray && deleteArray.length) {
        await deleteArray.forEach(async (img) => {
          await fs.removeSync(`${__dirname}/../../../images/products/${img}`);
        });
      }
      res.status(200).json({
        success: "Successfully updated product",
        data: data,
      });
    }
  } catch (error) {
    res.status(200).json({
      failed: "failed to update product",
    });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = await req.params;
    if (id) {
      const data = await productCollection.findOneAndDelete({ _id: id });
      if (!data._id) {
        return res.status(200).json({
          failed: "failed to deleted product",
        });
      }
      await data.img.forEach(async (img) => {
        await fs.removeSync(`${__dirname}/../../../images/products/${img}`);
      });

      res.status(200).json({
        success: "successfully deleted product",
        data: data,
      });
    }
  } catch (error) {
    res.status(200).json({
      failed: "failed to deleted product",
    });
  }
};

exports.flashSale = async (req, res) => {
  try {
    const totalProduct = await [];
    const product = await productCollection.find({ viewAs: "Flash Sales" });
    const service = await serviceCollection.find({ viewAs: "Flash Sales" });
    await product.map((pd) => {
      totalProduct.push(pd);
    });
    await service.map((pd) => {
      totalProduct.push(pd);
    });
    if (totalProduct.length) {
      res.status(200).json({
        data: totalProduct,
        sucess: "sucessfully provided all product",
      });
    } else {
      res.status(412).json({
        failed: "failed to load product",
      });
    }
  } catch (error) {
    res.status(500).json({
      failed: "failed to load product",
    });
  }
};
exports.cartProducts = async (req, res) => {
  try {
    const cartArray = await req.body;

    const idArray = await cartArray.map((data) => {
      if (data.id) {
        return data.id;
      }
    });
    let totalProduct = await [];

    const product = await productCollection.find(
      {
        _id: { $in: [...idArray] },
      },
      {
        title: 1,
        price: 1,
        discount: 1,
        discountForUser: 1,
        img: 1,
        detailsArray: 1,
        category: 1,
      }
    );
    const service = await serviceCollection.find(
      {
        _id: { $in: [...idArray] },
      },
      {
        title: 1,
        price: 1,
        discount: 1,
        discountForUser: 1,
        img: 1,
        detailsArray: 1,
        category: 1,
      }
    );
    const modifyProduct = await product.map((pd) => {
      for (let i = 0; i < cartArray.length; i++) {
        const element = cartArray[i];
        if (element.id == pd._id) {
          const newPd = {
            quantity: 0,
            title: pd.title,
            price: pd.price,
            discount: pd.discount,
            discountForUser: pd.discountForUser,
            img: pd.img,
            detailsArray: pd.detailsArray,
            category: pd.category,
            _id: pd._id,
          };
          newPd.quantity = element.quantity;
          return newPd;
        }
      }
    });
    const modifyservices = await service.map((pd) => {
      for (let i = 0; i < cartArray.length; i++) {
        const element = cartArray[i];
        if (element.id == pd._id) {
          const newPd = {
            quantity: 0,
            title: pd.title,
            price: pd.price,
            discount: pd.discount,
            discountForUser: pd.discountForUser,
            img: pd.img,
            detailsArray: pd.detailsArray,
            category: pd.category,
            _id: pd._id,
          };
          newPd.quantity = element.quantity;
          return newPd;
        }
      }
    });
    totalProduct = await [...modifyProduct, ...modifyservices];
    if (totalProduct.length) {
      res.status(200).json({
        data: totalProduct,
        sucess: "sucessfully provided all product",
      });
    } else {
      res.status(412).json({
        failed: "failed to load product",
      });
    }
  } catch (error) {
    res.status(500).json({
      failed: "failed to load product",
    });
  }
};

exports.categoryProducts = async (req, res) => {
  try {
    const { categoryName } = await req.body;
    const path = await req.path;
   
    const totalProduct = await [];
    let product = await productCollection.find({
      category: {
        $in: [...categoryName],
      },
    });
    // let product = await productCollection.find({ category: categoryName });

    let service = await serviceCollection.find({
      category: {
        $in: [...categoryName],
      },
    });
    if (product.length == 0 && service.length == 0) {
      let limite = 4;
      let pd = await productCollection.find({}, { _id: 1 });
      let sr = await serviceCollection.find({}, { _id: 1 });
      product = await productCollection
        .find()
        .skip(pd.length - limite)
        .limit(limite);
      service = await serviceCollection
        .find()
        .skip(sr.length - limite)
        .limit(limite);
    }
    await product.map((pd) => {
      totalProduct.push(pd);
    });
    await service.map((pd) => {
      totalProduct.push(pd);
    });
    if (totalProduct.length) {
      res.status(200).json({
        data: totalProduct,
        success: "Successfully provided all product",
      });
    } else {
      res.status(412).json({
        failed: "failed to load product",
      });
    }
  } catch (error) {
    res.status(500).json({
      failed: "failed to load product",
    });
  }
};
exports.searchProduct = async (req, res) => {
  try {
    const { name } = await req.params;

    if (!name) {
      return res.status(200).json({
        data: [],
      });
    }
    const products = await productCollection.find();
    const services = await serviceCollection.find();

    const allProducts = await [...products, ...services];

    let inputValue =
      (await name.toString().length) > 0 ? name.toString().toLowerCase() : "0";

    if (inputValue == 0) {
      return res.status(200).json({
        data: [],
      });
    }

    let currentUser = await allProducts.filter((valuee) => {
      let stringValue = valuee.title.toString();
      let title = stringValue.length > 0 ? stringValue.toLowerCase() : "";

      let varifiying = title.includes(inputValue);
      return varifiying;
    });

    return res.status(200).json({
      data: [...currentUser],
    });
  } catch (error) {
    res.status(500).json({
      data: [],
    });
  }
};
