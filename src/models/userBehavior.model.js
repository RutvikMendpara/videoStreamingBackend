const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userBehaviorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    watchTime: {
      type: Number,
      default: 0,
    },

    action: {
      type: String,
      enum: ["view", "like", "dislike", "comment", "share", "subscribe"],
      required: true,
    },
    country: { type: String },
    category: { type: String, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserBehavior", userBehaviorSchema);
