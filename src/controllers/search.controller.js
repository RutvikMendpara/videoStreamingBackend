const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const mongoose = require("mongoose");
const Video = require("../models/video.model");
// normal search method
const GetVideosBySearch = asyncHandler(async (req, res, next) => {
  const { search } = req.query;
  if (!search) {
    throw new ApiError(400, "Search query is required");
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = limit * (page - 1);
  try {
    const regex = new RegExp(search, "i");
    const videos = await Video.find({
      $or: [{ title: { $regex: regex } }, { description: { $regex: regex } }],
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, videos, "Videos fetched"));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Unable to fetch videos");
  }
});

module.exports = { GetVideosBySearch };
