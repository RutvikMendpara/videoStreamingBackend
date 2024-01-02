const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Comment = require("../models/comment.model");
const Video = require("../models/video.model");
const mongoose = require("mongoose");

const getAllComments = asyncHandler(async (req, res, next) => {
  // get videoId from req.body
  const { videoId, loadNumber } = req.body;

  // validate videoId
  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  if (Number(loadNumber) < 1 || !Number(loadNumber)) {
    throw new ApiError(
      400,
      "Load number is required and it should be greater than 0"
    );
  }

  const skip = 10 * (Number(loadNumber) - 1);

  // check if video exists
  const video = await Video.findById({ _id: videoId });
  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }

  // get all comments for video

  try {
    const comments = await Comment.aggregate([
      {
        $match: {
          video: video._id,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $addFields: {
          isEdited: {
            $cond: {
              if: { $ne: ["$createdAt", "$updatedAt"] },
              then: true,
              else: false,
            },
          },
        },
      },
    ]);

    // return success response

    res
      .status(200)
      .json(new ApiResponse(200, comments, "Comments fetched successfully"));
  } catch (error) {
    throw new ApiError(400, "Error fetching comments");
  }
});

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

  try {
    const comment = await Comment.create({
      content,
      video: videoExists._id,
      owner: user._id,
    });

    res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment added successfully"));
  } catch (error) {
    throw new ApiError(400, "Error adding comment");
  }
});

const deleteComment = asyncHandler(async (req, res, next) => {});

const updateComment = asyncHandler(async (req, res, next) => {
  const { videoId, content, commentID } = req.body;
  const user = req.user;
  const video = await Video.findById({ _id: videoId });

  if (!video) {
    throw new ApiError(400, "Video does not exists");
  }

  const comment = await Comment.findById({ _id: commentID });

  if (!comment) {
    throw new ApiError(400, "Comment does not exists");
  }

  if (comment.owner.toString() !== user._id.toString()) {
    throw new ApiError(400, "You are not allowed to update this comment");
  }

  try {
    comment.content = content;
    comment.save();

    res
      .status(200)
      .json(new ApiResponse(200, comment, "Comment updated successfully"));
  } catch (error) {
    throw new ApiError(400, "Error updating comment");
  }
});

module.exports = { getAllComments, addComment, deleteComment, updateComment };
