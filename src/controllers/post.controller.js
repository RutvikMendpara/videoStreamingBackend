const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Like = require("../models/like.model");
const mongoose = require("mongoose");

const createPost = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  try {
    const post = await Post.create({
      owner: user._id,
      content,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, post, "Post created successfully"));
  } catch (error) {
    throw new ApiError(500, "unable to create post");
  }
});

const editPost = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { postId, content } = req.body;

  if (!postId || !content) {
    throw new ApiError(400, "Post id and content are required");
  }

  const post = await Post.findById({ _id: postId });
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (!post.owner.equals(user._id)) {
    throw new ApiError(403, "You are not authorized to edit this post");
  }

  try {
    post.content = content;
    post.save();

    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post updated successfully"));
  } catch (error) {
    throw new ApiError(500, "unable to update post.");
  }
});

const DeletePost = asyncHandler(async (req, res, next) => {
  const owner = req.user._id;
  const { postId } = req.body;

  if (!postId) {
    throw new ApiError(400, "Post id is required");
  }

  const post = await Post.findById({ _id: postId });
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  const postOwner = post.owner;

  if (!postOwner.equals(owner)) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  try {
    await Like.deleteMany({ post: post._id });
    await Post.deleteOne({ _id: post._id });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong during deleting post");
  }
});

const getAllPostsByUser = asyncHandler(async (req, res, next) => {
  let { username, pageNumber } = req.body;

  if (!username || !pageNumber) {
    throw new ApiError(400, "Username and pageNumber are required");
  }

  pageNumber = Number(pageNumber);

  if (pageNumber < 1) {
    throw new ApiError(400, "Page number must be greater than 0");
  }
  const skip = 10 * (pageNumber - 1);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(400, "User does not exist");
    }

    const post = await Post.aggregate([
      {
        $match: {
          owner: user._id,
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
        $project: {
          content: 1,
          createdAt: 1,
        },
      },
    ]);

    res
      .status(200)
      .json(new ApiResponse(200, post, "Posts fetched Successfully"));
  } catch (error) {
    throw new ApiError(500, "Unable to fetch posts");
  }
});

module.exports = {
  createPost,
  editPost,
  DeletePost,
  getAllPostsByUser,
};
