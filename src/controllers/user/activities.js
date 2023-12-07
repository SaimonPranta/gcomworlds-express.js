const userCollection = require("../../db/models/userModel");
const dateProvider = require("../../functions/dateProvider");

exports.pointTransfer = async (req, res) => {
  try {
    const userID = await req.userID;
    const { id, receiverID, amount, charge } = await req.body;
    const totalAccessPoint = await (await Number(amount)) + Number(charge);
    if (!totalAccessPoint) {
      return res.status(500).json({ failed: "Sorry, amount must be Number" });
    }
    const reciverUser = await userCollection.findOne(
      { userID: receiverID },
      { fullName: 1, accessPoints: 1 }
    );
    if (!reciverUser) {
      return res
        .status(500)
        .json({ failed: "Your provided receiver ID are invalid" });
    }
    const senderUser = await userCollection.findOne(
      { userID },
      { accessPoints: 1 }
    );
    if (!senderUser) {
      return res
        .status(500)
        .json({ failed: "Something is wrong, please try again letter" });
    }
    if (senderUser && !senderUser.accessPoints) {
      return res
        .status(500)
        .json({ failed: "Sorry, you have insufficient balance" });
    }
    if (senderUser && senderUser.accessPoints < totalAccessPoint) {
      return res
        .status(500)
        .json({ failed: "Sorry, you have insufficient balance" });
    }
    const transitionInfo = await {
      receiverName: reciverUser.fullName,
      receiverID: receiverID,
      amount: amount,
      requestID:
        Math.floor(Math.random() * 100) +
        Date.now() +
        Math.floor(Math.random() * 100),
      date: dateProvider(Date.now()),
    };
    const updateReceiverPoints = await userCollection.findOneAndUpdate(
      { userID: receiverID },
      {
        accessPoints:
          reciverUser.accessPoints + Number(amount),
      }, {new: true}
    );
    if (!updateReceiverPoints) {
      return res
        .status(500)
        .json({ failed: "Something is wrong, please try agian letter" });
    }
    const data = await userCollection.findOneAndUpdate(
      { userID },
      {
        $set: {
          accessPoints:
            senderUser.accessPoints - (Number(amount) + Number(charge)),
        },
        $push: {
          accessPointsTransferHistory: {
            $each: [transitionInfo],
            $position: 0,
          },
        },
      },
      { new: true }
    );
    res.json({ data: data });
  } catch (error) {
    res.json({ failed: "Something is wrong, please try again letter" });
  }
};

exports.dailyWithdraw = async (req, res) => {
  try {
    const userID = await req.userID;
    const {
      porvider,
      phoneNumber,
      withdrawPoints,
      dailyPointCharge,
      accessPointCharge,
    } = await req.body;
    if (
      !porvider ||
      !phoneNumber ||
      !withdrawPoints ||
      !dailyPointCharge ||
      !accessPointCharge
    ) {
      return res.json({ failed: "Fill the full form and then try again" });
    }
    const userCheck = await userCollection.findOne(
      { userID },
      { dailyPoints: 1, accessPoints: 1 }
    );
    if (!userCheck) {
      return res.json({ failed: "Your account doesn't exist " });
    }
    if (
      userCheck.dailyPoints <
      Number(withdrawPoints) + Number(dailyPointCharge)
    ) {
      return res.json({ failed: "Sorry, your Daily Points are insufficient" });
    }
    if (userCheck.accessPoints < Number(accessPointCharge)) {
      return res.json({ failed: "Sorry, your Access Points are insufficient" });
    }
    const requestInfo = await {
      userID,
      receiveBy: porvider,
      phoneNumber: phoneNumber,
      amountOfTk: Number(withdrawPoints),
      amountOfPoints: Number(withdrawPoints),
      dailyPointCharge: Number(dailyPointCharge),
      accessPointCharge: Number(accessPointCharge),
      requestID:
        Math.floor(Math.random() * 100) +
        Date.now() +
        Math.floor(Math.random() * 100),
      requestDate: dateProvider(Date.now()),
    };
    const data = await userCollection.findOneAndUpdate(
      { userID },
      {
        $push: {
          dailyWithdroawHistory: {
            $each: [requestInfo],
            $position: 0,
          },
        },
      },
      {
        new: true,
      }
    );
    if (!data) {
      return res.status(500).json({ failed: "Failed to process your request" });
    }
    res.json({ data });
  } catch (error) {
    res.json({ failed: "Something is wrong, please try agian" });
  }
};

exports.regularWithdraw = async (req, res) => {
  try {
    const userID = await req.userID;
    const { porvider, phoneNumber, withdrawPoints, regularPointCharge } =
      await req.body;
    if (!porvider || !phoneNumber || !withdrawPoints || !regularPointCharge) {
      return res.json({ failed: "Fill the full form and then try again" });
    }
    const userCheck = await userCollection.findOne(
      { userID },
      { regularPoints: 1 }
    );
    if (!userCheck) {
      return res.json({ failed: "Your account doesn't exist " });
    }
    if (
      userCheck.regularPoints <
      Number(withdrawPoints) + Number(regularPointCharge)
    ) {
      return res.json({ failed: "Sorry, your Daily Points are insufficient" });
    }
    const requestInfo = await {
      userID,
      receiveBy: porvider,
      phoneNumber: phoneNumber,
      amountOfTk: Number(withdrawPoints),
      amountOfPoints: Number(withdrawPoints),
      regularPointCharge: Number(regularPointCharge),
      requestID:
        Math.floor(Math.random() * 100) +
        Date.now() +
        Math.floor(Math.random() * 100),
      requestDate: dateProvider(Date.now()),
    };
    const data = await userCollection.findOneAndUpdate(
      { userID },
      {
        $push: {
          regularWithdroawHistory: {
            $each: [requestInfo],
            $position: 0,
          },
        },
      },
      {
        new: true,
      }
    );
    if (!data) {
      return res.status(500).json({ failed: "Failed to process your request" });
    }
    res.json({ data });
  } catch (error) {
    res.json({ failed: "Something is wrong, please try agian" });
  }
};

