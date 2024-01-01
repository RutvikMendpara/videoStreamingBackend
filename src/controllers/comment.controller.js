const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Comment = require("../models/comment.model");
const Video = require("../models/video.model");
const mongoose = require("mongoose");

const getAllComments = asyncHandler(async (req, res, next) => {});

const addComment = asyncHandler(async (req, res, next) => {
  // get content , videoId, userId from req.body
  // validate content, videoId, userId
  // check if user exists
  // check if video exists
  // create new comment
  // save comment
  // return success response
  const { content, video } = req.body;

  if ([content, video].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = req.user;

  const videoExists = await Video.findById({ _id: video });

  if (!videoExists) {
    throw new ApiError(400, "Video does not exists");
  }

  const comment = await Comment.create({
    content,
    video: videoExists._id,
    owner: user._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successfully"));
});

const deleteComment = asyncHandler(async (req, res, next) => {});

const updateComment = asyncHandler(async (req, res, next) => {});

module.exports = { getAllComments, addComment, deleteComment, updateComment };
