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

const getAllLikesOnVideo = asyncHandler(async (req, res, next) => {
  const { videoId } = req.body;
  if (!videoId) {
    return next(new ApiError(400, "Video id is required"));
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  try {
    const like = await Like.aggregate([
      {
        $facet: {
          totalCount: [
            {
              $match: {
                video: video._id,
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
          },
        },
      },
    ]);

    return res.status(200).json(new ApiResponse(200, like, "likes fetched"));
  } catch (error) {
    throw new ApiError(500, "Unable to fetch video likes");
  }
});

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
const getAllTotalLikesOnComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.body;
  if (!commentId) {
    throw new ApiError(400, "Comment id is required");
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  try {
    const like = await Like.aggregate([
      {
        $facet: {
          totalCount: [
            {
              $match: {
                comment: comment._id,
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
          },
        },
      },
    ]);

    return res.status(200).json(new ApiResponse(200, like, "comment fetched"));
  } catch (error) {
    throw new ApiError(500, "Unable to fetch comment likes");
  }
});

const updateLikeOnPost = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const postId = req.body.postId;

  if (!postId) {
    return next(new ApiError("post id is required", 400));
  }
  const post = await Post.findById(postId);
  if (!post) {
    return next(new ApiError("Post not found", 404));
  }

  const like = await Like.aggregate([
    {
      $facet: {
        likedByUser: [
          {
            $match: {
              post: post._id,
              likedBy: user._id,
            },
          },
        ],
        totalCount: [
          {
            $match: {
              post: post._id,
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
          post: post._id,
          likedBy: user._id,
        });
        await newLike.save();
        return res
          .status(200)
          .json(new ApiResponse(200, null, "post liked successfully"));

      case "removeLike":
        await Like.findOneAndDelete({
          post: post._id,
          likedBy: user._id,
        });
        return res
          .status(200)
          .json(new ApiResponse(200, null, "post unlike successfully"));
    }
  } catch (error) {
    return ApiError(500, "Something went wrong during like/unlike post");
  }
});

const getAllLikesOnPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.body;
  if (!postId) {
    throw next(new ApiError(400, "post id is required"));
  }

  let post;
  try {
    post = await Post.findById(postId);
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
  } catch (error) {
    throw new ApiError(404, "Post not found");
  }
  try {
    const like = await Like.aggregate([
      {
        $facet: {
          totalCount: [
            {
              $match: {
                post: post._id,
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
          },
        },
      },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, like, "post likes fetched"));
  } catch (error) {
    throw new ApiError(500, "Unable to fetch post likes");
  }
});

module.exports = {
  updateLikeOnVideo,
  getAllLikesOnVideo,
  updateLikeOnComment,
  getAllTotalLikesOnComment,
  updateLikeOnPost,
  getAllLikesOnPost,
};
