const messageCollection = require("../db/models/messageModel");
const userCollection = require("../db/models/userModel");

exports.getMessage = async (req, res) => {
  try {  
    const user = await userCollection.findOne(
      { userID: req.userID },
      { userID: 1, conversetionID: 1 }
    );

    if (user && !user.conversetionID) {
      return res.status(200).json({ faild: "You have no chat" });
    }

    const result = await messageCollection.find({
      conversetionID: user.conversetionID,
    }); 

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ faild: "Failed to create Conversation." });
  }
};
exports.getAllMessage = async (req, res) => {
  try {
    
    const result = await messageCollection.find();

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ faild: "Failed to create Conversation." });
  }
};
exports.createMessage = async (req, res) => {
  try {
    const { message } = await req.body;
    let conversetionID = null;
    const user = await userCollection.findOne(
      { userID: req.userID },
      { userID: 1, conversetionID: 1 }
    );

    if (user && !user.conversetionID) {
      conversetionID = Math.floor(Math.random() * 100) + Date.now();
      const updateUser = await userCollection.findOneAndUpdate(
        { userID: req.userID },
        { conversetionID: conversetionID },
        { new: true }
      );
    } else {
      conversetionID = user.conversetionID;
    }

    const conversation = await new messageCollection({
      conversetionID: conversetionID,
      senderID: req.userID,
      reciverID: "admin",
      message: message,
    });
    const result = await conversation.save(); 
    res.status(200).json({ data: result }); 
  } catch (error) {
    res.status(500).json({ faild: "Failed to create Conversation." });
  }
};
exports.createAdminMessage = async (req, res) => {
  try {
    
    const { conversetionID, reciverID, message } = await req.body;
     
    const conversation = await new messageCollection({
      conversetionID: conversetionID,
      senderID: "admin",
      reciverID: reciverID,
      message: message,
    });
    const result = await conversation.save();
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ faild: "Failed to create Conversation." });
  }
};
