const jwt = require("jsonwebtoken");

const userAuthGard = async (req, res, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized  attempt, please try out latter." });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded && decoded.id && decoded.userID) {
      req.id = await decoded.id;
      req.userID = await decoded.userID;
    } else {
      res
        .status(401)
        .json({ error: "Unauthorized  attempt, please try out latter." });
    }
    next();
  } catch (error) {
    res
      .status(401)
      .json({ error: "Unauthorized  attempt, please try out latter." });
  }
};
module.exports = userAuthGard;
