const bcrypt = require("bcrypt");
const userCollection = require("../../db/models/userModel");
const taskCollection = require("../../db/models/taskModel");
const notificatioModel = require("../../db/models/notificatioModel");

const dateProvider = require("../../functions/dateProvider");

exports.allUser = async (req, res) => {
  try {
    const allUser = await userCollection.find();
    if (allUser.length < 1) {
      return res.status(500).json({
        failed: "No user exist in your database",
      });
    }
    res.status(200).json({
      data: allUser,
    });
  } catch (error) {
    res.status(500).json({
      failed: "Internal server error, please try again letter",
    });
  }
};

exports.userSummary = async (req, res) => {
  try {
    let totalPendingDailyWithdrawRequest = 0;
    let totalPendingRegularWithdrawRequest = 0;

    const allUser = await userCollection.find();
    if (allUser.length < 1) {
      return res.status(200).json({
        failed: "Didn't find any user",
      });
    }
    await allUser.forEach((user) => {
      if (user.dailyWithdroawHistory.length > 0) {
        user.dailyWithdroawHistory.forEach((item) => {
          if (!item.approve) {
            totalPendingDailyWithdrawRequest =
              totalPendingDailyWithdrawRequest + 1;
          }
        });
      }
      if (user.regularWithdroawHistory.length > 0) {
        user.regularWithdroawHistory.forEach((item) => {
          if (!item.approve) {
            totalPendingRegularWithdrawRequest =
              totalPendingRegularWithdrawRequest + 1;
          }
        });
      }
    });
    res.status(200).json({
      data: {
        totalPendingDailyWithdrawRequest,
        totalPendingRegularWithdrawRequest,
      },
    });
  } catch (error) {
    res.status(500).json({
      failed: "Something is wrong, please try again letter",
    });
  }
};

exports.viewProfile = async (req, res) => {
  try {
    const { id } = await req.params;
    if (!id) {
      return res
        .status(200)
        .json({ failed: "Something is wrond please try agian letter" });
    }

    const user = await userCollection.findOne({ _id: id }, { password: 0 });
    res.status(200).json({ data: user });
  } catch (error) {
    res
      .status(200)
      .json({ failed: "Something is wrond please try agian letter" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = await req.params;
    let hashedPassword = null;
    if (!id) {
      return res
        .status(200)
        .json({ failed: "Something is wrond please try agian letter" });
    }
    if (req.body.password) {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    }

    if (hashedPassword) {
      const user = await userCollection.findOneAndUpdate(
        { _id: id },
        {
          ...req.body,
          password: hashedPassword,
        }
      );
      if (!user) {
        res.status(200).json({ failed: "Failed to update user information" });
      }
      return res
        .status(200)
        .json({ sucess: "Sucessfully user information updated" });
    } else {
      const user = await userCollection.findOneAndUpdate(
        { _id: id },
        {
          ...req.body,
        }
      );
      if (!user) {
        res.status(200).json({ failed: "Failed to update user information" });
      }
      return res
        .status(200)
        .json({ sucess: "Sucessfully user information updated" });
    }
  } catch (error) {
    res
      .status(200)
      .json({ failed: "Something is wrond please try agian letter" });
  }
};

exports.addTask = async (req, res) => {
  try {
    const taskInfo = await new taskCollection({ ...req.body });
    const data = await taskInfo.save();
    if (!data) {
      return res.status(401).json({ failed: "Failed to create task" });
    }
    const allTask = await taskCollection.find();
    res.json({ data: allTask });
  } catch (error) {
    res.status(401).json({ failed: "Failed to create task" });
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

exports.editTask = async (req, res) => {
  try {
    const { id } = await req.params;
    const data = await taskCollection.findOneAndUpdate(
      { _id: id },
      { ...req.body }
    );
    if (!data) {
      return res.status(401).json({ failed: "Failed to create task" });
    }
    const allTask = await taskCollection.find();

    res.json({ data: allTask });
  } catch (error) {
    res.status(401).json({ failed: "Failed to Edit task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = await req.params;
    const data = await taskCollection.findOneAndDelete({ _id: id });
    if (!data) {
      return res.status(401).json({ failed: "Failed to create task" });
    }
    const allTask = await taskCollection.find();

    res.json({ data: allTask });
  } catch (error) {
    res.status(401).json({ failed: "Failed to Delete task" });
  }
};

exports.pendingUser = async (req, res) => {
  try {
    const allPendingUser = await userCollection.find(
      { isActive: false },
      {
        userID: 1,
        fullName: 1,
        referID: 1,
        placementID: 1,
        packages: 1,
        joinDate: 1,
        accountType: 1,
      }
    );

    res.status(200).json({ data: allPendingUser });
  } catch (error) {
    res
      .status(500)
      .json({ failed: "Something is wrong, please try again letter" });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = await req.params;
    const user = await userCollection.findOne({ _id: id });
    if (!user) {
      return res
        .status(200)
        .json({ failed: "Something is wrong, please try again letter" });
    }
    if (user.isActive) {
      return res
        .status(200)
        .json({ failed: "Sorry, this account are already active" });
    }
    const deleteUser = await userCollection.findOneAndDelete({ _id: id });
    if (!deleteUser) {
      return res
        .status(500)
        .json({ failed: "Failed to delete user, please try again letter" });
    }
    res.status(200).json({ sucess: "Successfully Deleted user" });
  } catch (error) {
    res
      .status(500)
      .json({ failed: "Something is wrong, please try again letter" });
  }
};
exports.approveUser = async (req, res) => {
  try {
    const { id } = await req.params;
    const user = await userCollection.findOne({ _id: id });
    if (!user) {
      return res
        .status(500)
        .json({ failed: "Something is wrong, please try again letter" });
    }
    if (user.isActive) {
      return res
        .status(200)
        .json({ failed: "Sorry, this account are already active" });
    }

    if (user.accountType === "user" || user.accountType === "admin") {
      const referUser = await userCollection.findOne({ userID: user.referID });
      const placementUser = await userCollection.findOne({
        userID: user.placementID,
      });
      if (!referUser || !placementUser) {
        return res.status(500).json({
          failed: `Sorry, your ${
            referUser ? "Placement User" : "Refer User"
          } user doesn't exist`,
        });
      }

      if (
        placementUser &&
        placementUser.myVolioms &&
        placementUser.myVolioms.voliomA &&
        placementUser.myVolioms.voliomB
      ) {
        return res.status(500).json({
          failed: "Sorry, this user placement volume are full, try another one",
        });
      }
      let updatedPlacementUser = null;
      if (placementUser.myVolioms) {
        if (user.placementVolume == "Volume A") {
          if (!placementUser.myVolioms.voliomA) {
            if (placementUser.myVolioms.voliomB) {
              updatedPlacementUser = await userCollection.findOneAndUpdate(
                {
                  userID: user.placementID,
                },
                {
                  myVolioms: {
                    voliomA: user.userID,
                    voliomB: placementUser.myVolioms.voliomB,
                  },
                }
              );
            } else {
              updatedPlacementUser = await userCollection.findOneAndUpdate(
                {
                  userID: user.placementID,
                },
                {
                  myVolioms: {
                    voliomA: user.userID,
                  },
                }
              );
            }
          } else {
            return res.status(500).json({
              failed:
                "Sorry, this user placement volume are full, try another one",
            });
          }
        }
        if (user.placementVolume == "Volume B") {
          if (!placementUser.myVolioms.voliomB) {
            if (placementUser.myVolioms.voliomA) {
              updatedPlacementUser = await userCollection.findOneAndUpdate(
                {
                  userID: user.placementID,
                },
                {
                  myVolioms: {
                    voliomA: placementUser.myVolioms.voliomA,
                    voliomB: user.userID,
                  },
                }
              );
            } else {
              updatedPlacementUser = await userCollection.findOneAndUpdate(
                {
                  userID: user.placementID,
                },
                {
                  myVolioms: {
                    voliomB: user.userID,
                  },
                }
              );
            }
          } else {
            return res.status(500).json({
              failed:
                "Sorry, this user placement volume are full, try another one",
            });
          }
        }
      }

      if (!updatedPlacementUser) {
        return res.status(500).json({
          failed: "Failed to Activ account, please try agian letter",
        });
      }
      const updatedRefertUser = await userCollection.findOneAndUpdate(
        {
          userID: user.referID,
        },
        {
          regularPoints: Number(referUser.regularPoints) + 100,
          $push: {
            teamMembers: {
              $each: [
                {
                  userID: user.userID,
                  joinDate: dateProvider(Date.now()),
                },
              ],
              $position: 0,
            },
          },
        }
      );
      const updatedUser = await userCollection.findOneAndUpdate(
        { _id: id },
        {
          isActive: true,
        }
      );

      if (!updatedRefertUser || !updatedUser) {
        return res.status(500).json({
          failed: "Failed to Activ account, please try agian letter",
        });
      }
    } else {
      const updateuser = await userCollection.findOneAndUpdate(
        { _id: id },
        {
          isActive: true,
        }
      );
    }

    res.status(200).json({ sucess: "Successfully Activated account" });
  } catch (error) {
    console.log("error", error);
    res
      .status(500)
      .json({ failed: "Something is wrong, please try again letter" });
  }
};

exports.dailyWithdrawDecline = async (req, res) => {
  try {
    const { userID, requestID } = req.body;
    const userVarifing = await userCollection.findOne({ userID: userID });
    if (userVarifing._id) {
      const currentUser = await userCollection.findOneAndUpdate(
        {
          userID: userID,
          "dailyWithdroawHistory.requestID": requestID,
        },
        {
          $pull: { dailyWithdroawHistory: { requestID: requestID } },
        }
      );

      if (currentUser._id) {
        res.status(200).json({ sucess: "sucessfuly approved" });
      } else {
        res.status(500).json({ failed: "Faild to approved" });
      }
    } else {
      res.status(500).json({ failed: "Faild to approved" });
    }
  } catch (error) {
    res.status(500).json({ failed: "Faild to approved" });
  }
};

exports.dailyWithdrawApprove = async (req, res) => {
  try {
    const {
      userID,
      requestID,
      dailyPoints,
      dailyPointCharge,
      accessPointCharge,
    } = await req.body;

    if (
      userID &&
      requestID &&
      dailyPoints &&
      dailyPointCharge &&
      accessPointCharge
    ) {
      const floorDailyPoints = Number(dailyPoints);
      const floorDdailyPointCharge = Number(dailyPointCharge);
      const floorAccessPointCharge = Number(accessPointCharge);

      const userVarifing = await userCollection.findOne({ userID: userID });
      if (!userVarifing) {
        return res.status(500).json({ failed: "User are invalid" });
      }
      if (
        userVarifing.dailyPoints <
        floorDailyPoints + floorDdailyPointCharge
      ) {
        return res
          .status(500)
          .json({ failed: "User Daily Points is Unsufficient" });
      }
      if (userVarifing.accessPoints < floorAccessPointCharge) {
        return res
          .status(500)
          .json({ failed: "User Access Points is Unsufficient" });
      }
      const user = await userCollection.updateOne(
        {
          userID: userID,
          "dailyWithdroawHistory.requestID": requestID,
        },
        {
          $set: {
            dailyPoints:
              userVarifing.dailyPoints -
              Number(floorDailyPoints + floorDdailyPointCharge),
            accessPoints: userVarifing.accessPoints - floorAccessPointCharge,
            "dailyWithdroawHistory.$.approve": true,
          },
        }
      );
      if (user.modifiedCount > 0) {
        res.status(200).json({ sucess: "sucessfuly approved" });
      } else {
        res.status(500).json({ failed: "Faild to approved" });
      }
    } else {
      res.status(500).json({ failed: "Faild to approved" });
    }
  } catch (error) {
    res.status(500).json({ failed: "Faild to approved" });
  }
};

exports.regularWithdrawDecline = async (req, res) => {
  try {
    const { userID, requestID } = req.body;
    const userVarifing = await userCollection.findOne({ userID: userID });
    if (userVarifing._id) {
      const currentUser = await userCollection.findOneAndUpdate(
        {
          userID: userID,
          "regularWithdroawHistory.requestID": requestID,
        },
        {
          $pull: { regularWithdroawHistory: { requestID: requestID } },
        }
      );

      if (currentUser._id) {
        res.status(200).json({ sucess: "sucessfuly approved" });
      } else {
        res.status(500).json({ failed: "Faild to approved" });
      }
    } else {
      res.status(500).json({ failed: "Faild to approved" });
    }
  } catch (error) {
    res.status(500).json({ failed: "Faild to approved" });
  }
};
exports.regularWithdrawApprove = async (req, res) => {
  try {
    const { userID, requestID, regularPoints, regularPointCharge } =
      await req.body;

    if (userID && requestID && regularPoints && regularPointCharge) {
      const floorRegularPoints = Number(regularPoints);
      const floorRegularPointCharge = Number(regularPointCharge);

      const userVarifing = await userCollection.findOne({ userID: userID });
      if (!userVarifing) {
        return res.status(500).json({ failed: "User are invalid" });
      }

      if (
        userVarifing.regularPoints <
        floorRegularPoints + floorRegularPointCharge
      ) {
        return res
          .status(500)
          .json({ failed: "User Regular Points is Unsufficient" });
      }

      const user = await userCollection.updateOne(
        {
          userID: userID,
          "regularWithdroawHistory.requestID": requestID,
        },
        {
          $set: {
            regularPoints:
              userVarifing.regularPoints -
              Number(floorRegularPoints + floorRegularPointCharge),
            "regularWithdroawHistory.$.approve": true,
          },
        }
      );
      if (user.modifiedCount > 0) {
        res.status(200).json({ sucess: "sucessfuly approved" });
      } else {
        res.status(500).json({ failed: "Faild to approved" });
      }
    } else {
      res.status(500).json({ failed: "Faild to approved" });
    }
  } catch (error) {
    res.status(500).json({ failed: "Faild to approved" });
  }
};
exports.distributeRegualrPoints = async (req, res) => {
  try {
    const points = await Number(req.params.points);
    if (!Number(req.params.points)) {
      return res.status(200).json({ failed: "Please provde a vilid number" });
    }

    const allUser = await userCollection.find({}, { regularPoints: 1 });
    if (allUser.length < 1) {
      return res
        .status(200)
        .json({ failed: "Something is wrong, please try again letter" });
    }
    await allUser.map(async (user) => {
      return await userCollection.findOneAndUpdate(
        { _id: user._id },
        { regularPoints: user.regularPoints + points }
      );
    });

    const updatedAll = await userCollection.find({});

    res.status(200).json({ data: updatedAll });
  } catch (error) {
    res.status(500).json({ failed: "Faild to approved" });
  }
};

exports.addNotification = async (req, res) => {
  try {
    const { messsasge } = await req.body;
    if (!messsasge) {
      return res.status(500).json({ failed: "Faild to Add Notification" });
    }

    const obj = await new notificatioModel({
      messsasge,
      date: dateProvider(new Date()),
    });

    const data = await obj.save();

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ failed: "Faild to Add Notification" });
  }
};
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = await req.params;

    const data = await notificatioModel.findOneAndDelete({ _id: id });
    res.status(200).json({ sucess: "Sucessfully deleted Notification" });
  } catch (error) {
    res.status(500).json({ failed: "Faild to deleted Notification" });
  }
};
