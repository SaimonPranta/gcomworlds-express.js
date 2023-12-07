const userCollection = require("../../db/models/userModel");
const configCollection = require("../../db/models/configModel");
const notificatioModel = require("../../db/models/notificatioModel");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.getPlacementID = async (req, res) => {
  try {
    const { userID } = await req.params;
    const referInfo = await userCollection.findOne(
      { userID },
      {
        myVolioms: 1,
        gender: 1,
      }
    );
    if (!referInfo) {
      return res.json({
        message: "Your provided Referral ID are invalid",
      });
    }
    if (!referInfo.myVolioms.voliomA || !referInfo.myVolioms.voliomB) {
      return res.json({
        message: "Your volume are not full yet",
        placementID: userID,
      });
    }
    const allMemberOFReferer = await userCollection.find(
      { referID: userID, isActive: true },
      {
        userID: 1,
        myVolioms: 1,
      }
    );
    if (allMemberOFReferer.length <= 0) {
      const allUser = await userCollection.find(
        { isActive: true },
        {
          userID: 1,
          myVolioms: 1,
        }
      );
      return res.json({
        data: allUser,
      });
    }
    const filterData = await allMemberOFReferer.filter((user) => {
      if (!user.myVolioms) {
        return true;
      } else {
        if (!user.myVolioms.voliomA || !user.myVolioms.voliomB) {
          return true;
        }
      }
    });
    if (filterData.length <= 0) {
      const allUser = await userCollection.find(
        { isActive: true },
        {
          userID: 1,
          myVolioms: 1,
        }
      );
      return res.json({
        data: allUser,
      });
    }
    res.json({
      data: filterData,
    });
  } catch (error) {
    res.json({
      message: "Something is wrong, please try letter",
    });
  }
};
exports.selectPlacementVolume = async (req, res) => {
  try { 
    const {placementID} = await req.query 
    const placementUser = await userCollection.findOne(
      { userID: placementID },
      {
        myVolioms: 1,
        isActive: 1,
      }
    );
    if (!placementUser) {
      return res.json({
        message: "Your provided Placement ID are invalid",
      });
    }
    if (!placementUser.isActive) {
      return res.json({
        message: "Your provided Placement ID are not active",
      });
    }
    
    if (!placementUser.myVolioms) {
      return res.json({
        data: "Sucessfull",
        voliomA: true,
        voliomB: true,
      });
    }
     res.json({
       data: "Sucessfull",
       voliomA: !placementUser.myVolioms.voliomA ? true : false,
       voliomB: !placementUser.myVolioms.voliomB ? true : false,
     });
  } catch (error) {
    res.json({
      message: "Something is wrong, please try letter",
    });
  }
};
exports.addSliderImg = async (req, res) => {
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

    const extention = await image.mimetype.split("/")[1];
    image.name =
      (await image.name.split(".")[0]) +
      Math.floor(Math.random() * 10) +
      Date.now() +
      "." +
      extention;
    const imageUpload = await image.mv(
      `${__dirname}/../../../images/config/${image.name}`
    );
    const data = await configCollection.findOneAndUpdate(
      {
        siteName: "GconWorld",
      },
      {
        $push: { sliderImg: { $each: [image.name], $position: 0 } },
      },
      {
        new: true,
      }
    );
   
    if (!data._id) {
      return res.join({ failed: "Failed to add image " });
    }
    // await fs.removeSync(exsitingImagePath);

    res.json({ data: data });
  } catch (error) {
    res.json({
      failed: "Failed to Edit Image",
    });
  }
};

exports.deleteSliderImg = async (req, res) => {
  try {

    const {img} = await req.body;
    const exsitingImagePath = await path.join(
      `${__dirname}/../../../images/config/${img}`
    );
    const data = await configCollection.findOneAndUpdate(
      {
        siteName: "GconWorld",
      },
      {
        $pull: { sliderImg: img },
      },
      {
        new: true,
      }
    );


    if (!data._id) {
      return res.join({ failed: "Failed to delete image " });
    }
    await fs.removeSync(exsitingImagePath);

    res.json({ data: data });
  } catch (error) {
    res.json({
      failed: "Failed to delete Slider Image",
    });
  }
};

exports.addHeroImg = async (req, res) => {
  try {
    const {objName} = await req.params;
    const image = await req.files.image;

    const fileType = await image.mimetype.split("/")[0];
    if (!fileType == "image") {
      return res.json({
        failed: "Only Images are allowed",
      });
    }
    if (image.size >= "1500012") {
      return res.status(500).json({ failed: "Image Size are too large" });
    }
    const getInfo = await configCollection.findOne({ siteName: "GconWorld" });
    if (!getInfo) {
      return res.json({
        failed: "Failed to Edit Image",
      });
    }
    const exsitingImagePath = await path.join(
      `${__dirname}/../../../images/config/${getInfo.heroImg[objName]}`
    );
    const extention = await image.mimetype.split("/")[1];
    image.name =
      (await image.name.split(".")[0]) +
      Math.floor(Math.random() * 10) +
      Date.now() +
      "." +
      extention;
    const imageUpload = await image.mv(
      `${__dirname}/../../../images/config/${image.name}`
    );



    const data = await configCollection.findOneAndUpdate(
      { siteName: "GconWorld" },
      {
        heroImg: {
          ...getInfo.heroImg,
          [objName]: image.name,
        },
      },
      {
        new: true,
      }
    );
    if (!data) {
      return res.join({ failed: "Failed to add image " });
    }
    await fs.removeSync(exsitingImagePath);

    res.json({ data: data });
  } catch (error) {
    res.json({
      failed: "Failed to Edit Image",
    });
  }
};
exports.addLaicence = async (req, res) => {
  try {
    const { title } = await req.body;
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

    const extention = await image.mimetype.split("/")[1];
    image.name =
      (await image.name.split(".")[0]) +
      Math.floor(Math.random() * 10) +
      Date.now() +
      "." +
      extention;
    const imageUpload = await image.mv(
      `${__dirname}/../../../images/config/${image.name}`
    );
    const data = await configCollection.findOneAndUpdate(
      {
        siteName: "GconWorld",
      },
      {
        $push: {
          licenceInfo: {
            $each: [{ title: title, img: image.name }],
            $position: 0,
          },
        },
      },
      {
        new: true,
      }
    );
    if (!data._id) {
      return res.join({ failed: "Failed to add image " });
    }
    // await fs.removeSync(exsitingImagePath);

    res.json({ data: data });
  } catch (error) {
    res.json({
      failed: "Failed to Edit Image",
    });
  }
};

exports.deleteLaicenceInfo = async (req, res) => {
  try {
    const { img } = await req.body;
    const exsitingImagePath = await path.join(
      `${__dirname}/../../../images/config/${img}`
    );
    const data = await configCollection.findOneAndUpdate(
      {
        siteName: "GconWorld",
      },
      {
        $pull: { licenceInfo: { img: img} },
      },
      {
        new: true,
      }
    );

    if (!data._id) {
      return res.join({ failed: "Failed to delete info " });
    }
    await fs.removeSync(exsitingImagePath);

    res.json({ data: data });
  } catch (error) {
    res.json({
      failed: "Failed to delete info",
    });
  }
};
exports.userIDVerifyer = async (req, res) => {
  try {
    const { id } = await req.params;
    const user = await userCollection.findOne({userID: id}, {_id: 1})
    console.log(user)
    if (!user) {
      return res.json({
        failed: "Your provided userID is wrong",
      });
    }
    res.json({ success: "Your userID are correct" });
  } catch (error) {
    console.log(error);
    res.json({
      failed: "Your provided userID is wrong",
    });
  }
};
exports.userIsExist = async (req, res) => {
  try {
    const { userID } = await req.params;
    console.log(userID);
    const user = await userCollection.findOne({ userID }, { phoneNumber: 1 });
    console.log(user);
    if (!user) {
      return res.json({
        failed: "Your provided userID is wrong",
      });
    }
    res.json({ data: user });
  } catch (error) {
    console.log(error);
    res.json({
      failed: "Your provided userID is wrong",
    });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { userID, newPassword } = await req.body;
console.log(userID, newPassword);
    if (userID && newPassword) {
      const user = await userCollection
        .findOne({ userID: userID })
        .select({
          password: 1,
          userID: 1,
        });

      if (user && user._id) {
        const hashingPassword = await bcrypt.hash(newPassword, 10);

        const updateUser = await userCollection.findOneAndUpdate(
          { userID: user.userID },
          {
            $set: {
              password: hashingPassword,
            },
          },
          {
            new: true,
          }
        );

        const token = await jwt.sign(
          {
            userID: user.userID,
            id: user._id,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "3d" }
        );

        if (updateUser._id) {
          updateUser.password = null;
          res.status(200).json({
            sucess: "New Password set Sucessfully !",
            data: updateUser,
            token: token,
          });
        } else {
          res
            .status(500)
            .json({ failed: "Failed to set New Password, Please Try Again !" });
        }
      } else {
        res.status(500).json({ failed: "Sorry, We con't Find Any Account !" });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ failed: "Failed to Set New Password, Please Try Again !" });
  }
};

exports.getNofication = async (req, res) => {
  try { 

    const data = await notificatioModel.find();
    const newData = await [];
    await data.map((item) => newData.unshift(item));
    console.log(newData);
    res.status(200).json({ data: newData });
  } catch (error) {
    res.status(500).json({ failed: "Faild to load Notification" });
  }
};