const userCollection = require("../../db/models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");
const path = require("path");
const { dirname } = require("path");
const dateProvider = require("../../functions/dateProvider");
const taskCollection = require("../../db/models/taskModel");

exports.user = async (req, res) => {
  try {
  } catch (error) {}
};

exports.registationExistingInfoVerification = async (req, res) => {
  try {
    const {
      fullName,
      fatherName,
      motherName,
      gender,
      phoneNumber,
      userID,
      email,
      address,
      country,
      nid,
      referID,
      placementID,
      password,
      placementVolume,
    } = req.body;
    if (
      !fullName ||
      !fatherName ||
      !motherName ||
      !gender ||
      !phoneNumber ||
      !userID ||
      !email ||
      !address ||
      !country ||
      !nid ||
      !referID ||
      !password ||
      !placementVolume
    ) {
      return res
        .status(200)
        .json({ failed: "Please fill the full form and then try again" });
    }
    if (placementVolume !== "Volume A" && placementVolume !== "Volume B") {
      return res
        .status(200)
        .json({ failed: "Please select Placement Volume and then try again" });
    }
    const checkisUserIDExist = await userCollection.findOne(
      {
        userID,
      },
      {
        _id: 1,
      }
    );

    const checkIsRefferIDExist = await userCollection.findOne(
      {
        userID: referID,
      },
      {
        _id: 1,
        isActive: 1,
      }
    );
    const checkIsPlacementIDExist = await userCollection.findOne(
      {
        userID: placementID,
      },
      {
        _id: 1,
        isActive: 1,
        myVolioms: 1,
      }
    );

    if (checkisUserIDExist) {
      return res.status(200).json({
        failed: "Sorry, Your provided User ID is already exist.",
      });
    }

    if (!checkIsRefferIDExist) {
      return res.status(200).json({
        failed:
          "Please provide correct Refferal ID, Your provided Refferal ID is not exist.",
      });
    }
    if (!checkIsRefferIDExist.isActive) {
      return res.status(200).json({
        failed: "Sorry, your Refferal ID isn't active",
      });
    }
    if (!checkIsPlacementIDExist) {
      return res.status(200).json({
        failed:
          "Please provide correct Placement ID, Your provided Placement ID is not exist.",
      });
    }

    if (!checkIsPlacementIDExist.isActive) {
      return res.status(200).json({
        failed: "Sorry, your Placement ID isn't active",
      });
    }
    if (placementVolume == "Volume A") {
      if (checkIsPlacementIDExist.myVolioms.voliomA) {
        return res.status(200).json({
          failed: "Sorry, Your selected Placement Volume isn't empty",
        });
      }
    }
    if (placementVolume == "Volume B") {
      if (checkIsPlacementIDExist.myVolioms.voliomB) {
        return res.status(200).json({
          failed: "Sorry, Your selected Placement Volume isn't empty",
        });
      }
    }
    return res.status(200).json({
      sucess: true,
    });
  } catch (error) {
    return res.status(200).json({
      failed: "Something is wrong please try again letter.",
    });
  }
};
exports.userRegistration = async (req, res) => {
  try {
    const { password, productID } = await req.body;
    let oldUser = null;


    if (!req.body.paymentMehod) {
      return res.status(200).json({
        failed: "Please provide all payment infomation then try again",
      });
    }
    let packages = await {
      paymentMehod: req.body.paymentMehod,
      productID: req.body.productID,
      ...req.body[req.body.paymentMehod],
    };

    if (req.body.paymentMehod === "accessPoint") {
      packages = await {
        paymentMehod: req.body.paymentMehod,
        productID: req.body.productID,
        accessPoint: 20,
      };
      oldUser = await userCollection.findOne(
        {
          userID: req.body.accessPoint.olduserID,
        },
        { accessPoints: 1, password: 1 }
      );
      if (!oldUser) {
        return res.status(200).json({
          failed: "User ID or Password invalid, please try again",
        });
      }
      const hashing = await bcrypt.compare(
        req.body.accessPoint.oldIDPassword,
        oldUser.password
      );
      if (!hashing) {
        return res.status(200).json({
          failed: "User ID or Password invalid, please try again",
        });
      }
      if (oldUser.accessPoints < 20) {
        return res.status(200).json({
          failed: "Sorry, user have insufficient Access Points",
        });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const processData = await new userCollection({
      ...req.body,
      joinDate: dateProvider(Date.now()),
      packages: [packages],
      password: hashedPassword,
    });
    const data = await processData.save();
    if (data) {
      if (req.body.paymentMehod === "accessPoint") {
        await userCollection.findOneAndUpdate(
          {
            userID: req.body.accessPoint.olduserID,
          },
          {
            accessPoints: oldUser.accessPoints - 20,
          }
        );
      }
      const token = await jwt.sign(
        {
          userID: data.userID,
          id: data._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3d" }
      );
      data.password = null;

      return res.status(201).json({
        data: data,
        sucess: "sucessfully created your accout",
        token: token,
      });
    }
    res.status(200).json({
      failed: "Failed to create your account, please try again latter",
    });
  } catch (error) {

    return res.status(200).json({
      failed: "Something is wrong, please try again latter",
    });
  }
};
exports.buyerRegistration = async (req, res) => {
  try {
    const { password, userID } = await req.body;
    const user = await userCollection.findOne({ userID }).select("userID");
    const buyerMetaData = {
      referID: "",
      lifeTimeIncome: 0,
      lifeTimeCost: 0,
    };
    if (user) {
      return res.json({
        success: false,
        message: "This userID are already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const processData = await new userCollection({
      ...req.body,
      joinDate: dateProvider(Date.now()),
      isActive: true,
      buyerMetaData: buyerMetaData,
      password: hashedPassword,
    });
    const data = await processData.save();
    if (data) {
      const token = await jwt.sign(
        {
          userID: data.userID,
          id: data._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3d" }
      );
      data.password = null;

      return res.status(201).json({
        data: data,
        message: "Successfully created your account",
        token: token,
      });
    }
    res.status(200).json({
      message: "Failed to create your account, please try again latter",
    });
  } catch (error) {

    return res.status(200).json({
      message: "Something is wrong, please try again latter",
    });
  }
};
exports.sellerRegistration = async (req, res) => {
  try {
    const { password, userID, referID } = await req.body;
    const body = await req.body;
    const user = await userCollection.findOne({ userID }).select("userID");
    const sellerMetaData = {
      referID: "",
      lifeTimeIncome: 0,
      lifeTimeCost: 0,
    };

    if (user) {
      return res.json({
        success: false,
        message: "This userID are already exist",
      });
    }
    if (referID) {
      sellerMetaData.referID = await referID;
      const seller = await userCollection
        .findOne({ userID: referID, accountType: "seller" })
        .select("userID");
      if (!seller) {
        return res.json({
          success: false,
          message: "This referID are not exist",
        });
      }
      delete body["referID"];
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const processData = await new userCollection({
      ...req.body,
      joinDate: dateProvider(Date.now()),
      sellerMetaData: sellerMetaData,
      password: hashedPassword,
    });
    const data = await processData.save();
    if (data) {
      const token = await jwt.sign(
        {
          userID: data.userID,
          id: data._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3d" }
      );
      data.password = null;

      return res.status(201).json({
        data: data,
        message: "Successfully created your account",
        token: token,
      });
    }
    res.status(200).json({
      message: "Failed to create your account, please try again latter",
    });
  } catch (error) {
    return res.status(200).json({
      message: "Something is wrong, please try again latter",
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { userID, password } = await req.body;
    const user = await userCollection.findOne({ userID });
    if (!user._id) {
      return res.json({
        failed: "User or Password are invalid, please try again",
      });
    }
    const hashing = await bcrypt.compare(password, user.password);
    if (hashing && user) {
      user.password = await "";
      const token = await jwt.sign(
        {
          userID: user.userID,
          id: user._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3d" }
      );
      return res.json({
        data: user,
        token: token,
      });
    }
    res.json({
      failed: "User or Password are invalid, please try again",
    });
  } catch (error) {
    res.json({
      failed: "User or Password are invalid, please try again",
    });
  }
};
exports.getUser = async (req, res) => {
  try {
    const id = await req.id;
    const userID = await req.userID;
  } catch (error) {}
};
exports.updateUser = async (req, res) => {
  try {
    const { id } = await req.params;
    const userInfo = await req.body;

    const data = await userCollection.findOneAndUpdate(
      { _id: id },
      {
        ...userInfo,
      },
      {
        new: true,
      }
    );
    if (!data._id) {
      return res.status(500).json({ failed: "Failed to update information" });
    }
    res.status(200).json({ data: data });
  } catch (error) {
    res.json({
      failed: "Failed to update information",
    });
  }
};
exports.addImage = async (req, res) => {
  try {
    const { id } = await req.params;

    const image = await req.files.image;
    const fileType = await image.mimetype.split("/")[0];
    if (!fileType == "image") {
      return res.json({
        failed: "Only Image is allowed",
      });
    }
    if (image.size >= "1500012") {
      return res.status(500).json({ failed: "Image Size are too large" });
    }
    const user = await userCollection.findOne(
      { _id: id },
      {
        img: 1,
      }
    );
    if (!user._id) {
      return res.status(500).json({ failed: "Your account doesn't exist " });
    }
    const exsitingImagePath = await path.join(
      `${__dirname}/../../../images/user/profile picture/${user.img}`
    );
    const extention = await image.mimetype.split("/")[1];
    image.name =
      (await image.name.split(".")[0]) +
      Math.floor(Math.random() * 10) +
      Date.now() +
      "." +
      extention;
    const imageUpload = await image.mv(
      `${__dirname}/../../../images/user/profile picture/${image.name}`
    );

    const data = await userCollection.findOneAndUpdate(
      { _id: id },
      {
        img: image.name,
      },
      {
        new: true,
      }
    );
    if (!data._id) {
      return res.join({ failed: "Failed to add image " });
    }
    await fs.removeSync(exsitingImagePath);

    res.json({ data: data });
  } catch (error) {
    res.join({ failed: "Failed to add image " });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { id } = await req.params;
    const userInfo = await req.body;
    const user = await userCollection.findOne(
      { _id: id },
      {
        password: 1,
      }
    );
    const result = await bcrypt.compare(userInfo.password, user.password);
    if (!result) {
      return res
        .status(500)
        .json({ failed: "Your Password are wrong, please try again" });
    }
    const hashedPassword = await bcrypt.hash(userInfo.newPassword, 10);
    const data = await userCollection.findOneAndUpdate(
      { _id: id },
      {
        password: hashedPassword,
      }
    );
    if (!data._id) {
      return res.status(500).json({ failed: "Failed to update password" });
    }
    res.status(200).json({ data: data });
  } catch (error) {
    res.json({
      failed: "Failed to update password",
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
  } catch (error) {}
};
exports.readUserByTokenInfo = async (req, res) => {
  try {
    const id = await req.id;
    const userID = await req.userID;
    const user = await userCollection.findOne({ _id: id, userID });
    user.password = await null;
    res.json({ data: user, sucess: "Your user info are valid" });
  } catch (error) {
    res.json({ failed: "Failed to provide user info" });
  }
};

exports.getTask = async (req, res) => {
  try {
    const data = await taskCollection.find();
    if (data.length < 1) {
      return res.status(401).json({ failed: "Failed to load Task" });
    }
    res.json({ data });
  } catch (error) {
    res.status(401).json({ failed: "Failed to load Task" });
  }
};

exports.temaMembers = async (req, res) => {
  try {
    const userID = await req.userID;
    const allSuser = await userCollection.find(
      { referID: userID },
      { password: 0 }
    );
    if (allSuser.length == 0) {
      return res.status(200).json({ failed: "You have no members yet" });
    }
    res.json({ data: allSuser });
  } catch (error) {
    res
      .status(500)
      .json({ failed: "Something is wrong, please try again letter" });
  }
};
exports.volumeCount = async (req, res) => {
  try {
    const userID = await req.userID;
    const volumeA = await userCollection.find({
      placementID: userID,
      placementVolume: "Volume A",
    });
    const volumeB = await userCollection.find({
      placementID: userID,
      placementVolume: "Volume B",
    });
    res.json({ data: "" });
  } catch (error) {
    res
      .status(500)
      .json({ failed: "Something is wrong, please try again letter" });
  }
};
exports.getPlacementUser = async (req, res) => {
  try {
    const { id } = await req.params;
    const user = await userCollection.findOne(
      { userID: id },
      { fullName: 1, userID: 1, myVolioms: 1, img: 1 }
    );
    if (!user) {
      return res.json({ failed: "" });
    }
    res.json({ data: user });
  } catch (error) {
    res.json({ failed: "" });
  }
};
