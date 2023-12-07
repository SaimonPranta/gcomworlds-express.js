const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true, 
    },
    address: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    nid: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    referID: {
      type: String,
      required: true,
    },
    placementID: {
      type: String,
      required: true,
    },
    placementVolume: {
      type: String,
      required: true,
      enum: ["Volume A", "Volume B"],
    },
    myVolioms: {
      voliomA: {
        type: String,
        default: "",
      },
      voliomB: {
        type: String,
        default: "",
      },
    },
    teamMembers: [
      new mongoose.Schema({
        userID: {
          type: String,
        },
        joinDate: {
          type: String,
        },
      }),
    ],
    dailyPoints: {
      type: Number,
      default: 0,
    },
    withdrawDailyPoints: {
      type: Number,
      default: 0,
    },
    packages: {
      type: Array,
    },
    regularPoints: {
      type: Number,
      default: 0,
    },
    withdrawRegularPoints: {
      type: Number,
      default: 0,
    },
    accessPoints: {
      type: Number,
      default: 0,
    },
    withdrawAccessPoints: {
      type: Number,
      default: 0,
    },
    dailyWithdroawHistory: [
      new mongoose.Schema({
        userID: {
          type: String,
          require: true,
        },
        requestID: {
          type: Number,
          require: true,
        },
        receiveBy: {
          type: String,
          require: true,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
        amountOfTk: {
          type: Number,
          require: true,
        },
        amountOfPoints: {
          type: Number,
          require: true,
        },
        dailyPointCharge: {
          type: Number,
          require: true,
        },
        accessPointCharge: {
          type: Number,
          require: true,
        },
        approve: {
          type: Boolean,
          default: false,
          require: true,
        },
        requestDate: {
          type: String,
          require: true,
        },
        approvedDate: {
          type: String,
        },
      }),
    ],
    regularWithdroawHistory: [
      new mongoose.Schema({
        userID: {
          type: String,
          require: true,
        },
        requestID: {
          type: Number,
          require: true,
        },
        receiveBy: {
          type: String,
          require: true,
        },
        phoneNumber: {
          type: String,
          require: true,
        },
        amountOfTk: {
          type: Number,
          require: true,
        },
        amountOfPoints: {
          type: Number,
          require: true,
        },
        regularPointCharge: {
          type: Number,
          require: true,
        },
        approve: {
          type: Boolean,
          default: false,
          require: true,
        },
        requestDate: {
          type: String,
          require: true,
        },
        approvedDate: {
          type: String,
        },
      }),
    ],
    rank: {
      type: String,
    },
    accountType: {
      type: String,
      enum: ["user", "admin"],
      require: true,
      default: "user",
    },
    img: {
      type: String,
    },
    isActive: {
      type: Boolean,
      require: true,
      default: false,
    },
    isTemporalyDeactivate: {
      type: Boolean,
    },
    dilyTaskArray: {
      type: Array,
      default: [],
    },
    conversetionID: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    accessPointsTransferHistory: [
      new mongoose.Schema({
        receiverName: {
          type: String,
          required: true,
        },
        receiverID: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        requestID: {
          type: Number,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
      }),
    ],
    joinDate: {
      required: true,
      type: String,
    },
    notification: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const userCollection = new mongoose.model("user_collection", userSchema);

module.exports = userCollection;
