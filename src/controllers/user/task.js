const userCollection = require("../../db/models/userModel");

exports.addTaskToUser = async (req, res) => {
  try {
    const userID = await req.userID;
    const { taskID, points } = await req.body;

    const user = await userCollection.findOne({ userID });
    if (!user || !Number(points)) {
      return res.json({
        failed: "Something is wrong, please try again letter",
      });
    }
    const isExist = await user.dilyTaskArray.find((task) => task == taskID);
    if (isExist) {
      return res.json({
        failed: "Sorry, This task already done, please try another task",
      });
    }


    const data = await userCollection.findOneAndUpdate(
      { userID },
      {
        $set: {
          dailyPoints: user.dailyPoints + Number(points),
        },
        $push: {
          dilyTaskArray: {
            $each: [taskID],
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

exports.clearAllTask = async (req, res) => {
  try {
    const updatedPlacementUser = await userCollection.updateMany(
      {},
      {
        dilyTaskArray: [],
      },
      { new: true }
    );
    if (updatedPlacementUser.length == 0) {
      return res.json({
        failed: "Failed to clear Task",
      });
    }

    res.json({ sucess: "Sucessfully cleared all Task" });
  } catch (error) {
    res.json({ failed: "Something is wrong, please try again letter" });
  }
};
 