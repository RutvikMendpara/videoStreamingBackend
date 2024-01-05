const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary public_id
      required: true,
    },
    thumbnail: {
      type: String, // cloudinary public_id
      required: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    country: { type: String },
    keywords: [{ type: String, index: true }],
    category: { type: String, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
