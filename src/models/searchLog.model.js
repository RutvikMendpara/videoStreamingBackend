const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchLogSchema = new Schema(
  {
    query: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    country: { type: String },
    category: { type: String, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SearchLog", searchLogSchema);
