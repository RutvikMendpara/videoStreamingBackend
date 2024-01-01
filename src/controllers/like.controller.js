const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Like = require("../models/like.model");
const Comment = require("../models/comment.model");
const Video = require("../models/video.model");
const Post = require("../models/post.model");
const mongoose = require("mongoose");

const updateLikeOnVideo = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const videoId = req.body.videoId;
  if (!videoId) {
    return next(new ApiError("Video id is required", 400));
  }
  const video = await Video.findById(videoId);
  if (!video) {
    return next(new ApiError("Video not found", 404));
  }

  const like = await Like.aggregate([
    {
      $facet: {
        likedByUser: [
          {
            $match: {
              video: video._id,
              likedBy: user._id,
            },
          },
        ],
        totalCount: [
          {
            $match: {
              video: video._id,
            },
          },
          {
            $count: "total",
          },
        ],
      },
    },
    {
      $project: {
        likedByUser: { $size: "$likedByUser" },
        totalLikes: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
        },
      },
    },
    {
      $project: {
        action: {
          $cond: {
            if: { $eq: ["$likedByUser", 0] },
            then: "addLike",
            else: "removeLike",
          },
        },
      },
    },
  ]);

  const action = like[0].action; // addLike or removeLike
  try {
    switch (action) {
      case "addLike":
        const newLike = new Like({
          video: video._id,
          likedBy: user._id,
        });
        await newLike.save();
        return res
          .status(200)
          .json(new ApiResponse(200, null, "Video liked successfully"));

      case "removeLike":
        await Like.findOneAndDelete({
          video: video._id,
          likedBy: user._id,
        });
        return res
          .status(200)
          .json(new ApiResponse(200, null, "Video unlike successfully"));
    }
  } catch (error) {
    return ApiError(500, "Something went wrong during like/unlike video");
  }
});

const getAllLikesOnVideo = asyncHandler(async (req, res, next) => {});

const updateLikeOnComment = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const commentId = req.body.commentId;

  if (!commentId) {
    return next(new ApiError("Comment id is required", 400));
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return next(new ApiError("Comment not found", 404));
  }

  const like = await Like.aggregate([
    {
      $facet: {
        likedByUser: [
          {
            $match: {
              comment: comment._id,
              likedBy: user._id,
            },
          },
        ],
        totalCount: [
          {
            $match: {
              comment: comment._id,
            },
          },
          {
            $count: "total",
          },
        ],
      },
    },
    {
      $project: {
        likedByUser: { $size: "$likedByUser" },
        totalLikes: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
        },
      },
    },
    {
      $project: {
        action: {
          $cond: {
            if: { $eq: ["$likedByUser", 0] },
            then: "addLike",
            else: "removeLike",
          },
        },
      },
    },
  ]);

  const action = like[0].action; // addLike or removeLike
  try {
    switch (action) {
      case "addLike":
        const newLike = new Like({
          comment: comment._id,
          likedBy: user._id,
        });
        await newLike.save();
        return res
          .status(200)
          .json(new ApiResponse(200, null, "Comment liked successfully"));

      case "removeLike":
        await Like.findOneAndDelete({
          comment: comment._id,
          likedBy: user._id,
        });
        return res
          .status(200)
          .json(new ApiResponse(200, null, "Comment unlike successfully"));
    }
  } catch (error) {
    return ApiError(500, "Something went wrong during like/unlike comment");
  }
});
const getAllLikesOnComment = asyncHandler(async (req, res, next) => {});

const updateLikeOnPost = asyncHandler(async (req, res, next) => {});
const getAllLikesOnPost = asyncHandler(async (req, res, next) => {});

module.exports = {
  updateLikeOnVideo,
  getAllLikesOnVideo,
  updateLikeOnComment,
  getAllLikesOnComment,
  updateLikeOnPost,
  getAllLikesOnPost,
};
