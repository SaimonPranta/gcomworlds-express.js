const buyRequestCollection = require("../../db/models/buyRequestModel");
const dateProvider = require("../../functions/dateProvider");
const productCollection = require("../../db/models/productModel");
const serviceCollection = require("../../db/models/serviceModel");
const userCollection = require("../../db/models/userModel");

exports.GetAllBuyRequest = async (req, res) => {
  try {
    const data = await buyRequestCollection.find();
    if (data.length == 0) {
      return res.status(201).json({
        failed: "Failed to Load Purchase Request",
      });
    }
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    return res.status(200).json({
      failed: "Something is wrong, please try again latter",
    });
  }
};

exports.buyRequest = async (req, res) => {
  try {
    const processData = await new buyRequestCollection({
      ...req.body,
      requestDate: dateProvider(new Date()),
    });
    const cartArray = req.body.cartArray;

    const products = await Promise.all(
      cartArray.map(async (productInfo) => {
        if (productInfo.referID) {
          const product = await productCollection.findOne({
            _id: productInfo.id,
          });
          const service = await serviceCollection.findOne({
            _id: productInfo.id,
          });
          let findProduct = null;
          if (product) {
            findProduct = product;
          }
          if (service) {
            findProduct = service;
          }
          if (findProduct) {
            const finalInfo = {
              ...productInfo,
              price: findProduct.price,
              discount: findProduct.discount,
              discountForUser: findProduct.discountForUser,
              productType: product ? "product" : service ? "service" : "",
              date: new Date(),
            };

            return finalInfo;
          }
        }
      })
    );

    await products.forEach(async (product) => {
      if (product && product.referID) {
        const isExist = await userCollection.findOne({
          userID: product.referID,
        });
        if (isExist) {
          const updateUser = await userCollection.findOneAndUpdate(
            { userID: product.referID },
            {
              $push: {
                orderHistory: {
                  $each: [{ ...product }],
                  $position: 0,
                },
              },
            }
          );
        }
      }
    });

    const data = await processData.save();

    if (!data) {
      return res.status(201).json({
        failed: "Failed to create your Purchase Request",
      });
    }
    res.status(200).json({
      success: "Successfully submitted your Purchase Request",
    });
  } catch (error) {
    return res.status(200).json({
      failed: "Something is wrong, please try again latter",
    });
  }
};

exports.buyRequestDelete = async (req, res) => {
  try {
    const { id } = await req.params;
    const data = await buyRequestCollection.findOneAndDelete({ _id: id });

    if (!data) {
      return res.status(201).json({
        failed: "Failed to Delete Purchase Request",
      });
    }
    res.status(200).json({
      sucess: "Sucessfully Deleted Purchase Request",
    });
  } catch (error) {
    return res.status(200).json({
      failed: "Something is wrong, please try again latter",
    });
  }
};
