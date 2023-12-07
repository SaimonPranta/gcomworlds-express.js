const messageCollection = require("../../db/models/messageModel");
const userCollection = require("../../db/models/userModel");

exports.createMessage = async (req, res) => {
  try {
    const { conversetionID, senderID, reciverID, message } = await req.body;
    if (!conversetionID) {
      const newConID = await Number(Date.now() + senderID).toString();
      conversetionID = await newConID;
      const senderUser = await userCollection.findOneAndUpdate(
        {
          userID: senderID,
        },
        {
          conversetionID: newConID,
        }
      );
    }
    const conversation = await new messageCollection({
      conversetionID: conversetionID,
      senderID: senderID,
      reciverID: reciverID,
      message: message,
    });
    const result = await conversation.save();
    if (!result) {
      return res.status(500).json({ faild: "Failed to create Conversation." });
    }
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ faild: "Failed to create Conversation." });
  }
};