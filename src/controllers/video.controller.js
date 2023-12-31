const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Video = require("../models/video.model");
const uploadOnCloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose");
const User = require("../models/user.model");

const addVideo = asyncHandler(async (req, res, next) => {
  // - done - take input data from req.body = {title , description , published, user_id}
  // - done - check if user exists
  // - done - check if title, description
  // from files we will get video_file, thumbnail
  // check if video exists
  // check if thumbnail is available
  // check if it is published or not
  // set the views to 0
  // create video in database
  // save video in database
  // return success response

  let { title, description, isPublished } = req.body;
  user = req.user;
  if ([title, description, isPublished].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  isPublished = isPublished === "true" ? true : false;

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  //   console.log(videoFile);

  if (!videoFile) {
    throw new ApiError(400, "Unable to upload avatar file");
  }

  const duration = Math.floor(Number(videoFile.duration));

  if (!thumbnail) {
    throw new ApiError(400, "Unable to upload avatar file");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: duration,
    views: 0,
    isPublished,
    owner: user._id,
  });

  const createdVideo = await Video.findById(video._id);

  if (!createdVideo) {
    throw new ApiError(500, "Unable to create video");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdVideo, "Video uploaded successfully"));
});

const getVideosByUsers = asyncHandler(async (req, res, next) => {
  let { username, pageNumber } = req.body;

  if ([username, pageNumber].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  pageNumber = Number(pageNumber);
  const skip = 10 * (pageNumber - 1);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(400, "User does not exist");
    }

    const video = await Video.aggregate([
      {
        $match: {
          owner: user._id,
        },
      },
      {
        $match: {
          isPublished: true,
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
          thumbnail: 1,
          duration: 1,
          title: 1,
          createdAt: 1,
          views: 1,
        },
      },
    ]);

    res
      .status(200)
      .json(new ApiResponse(200, video, "Videos fetched Successfully"));
  } catch (error) {
    throw new ApiError(500, "Unable to fetch videos");
  }
});

const getVideoDetails = asyncHandler(async (req, res, next) => {
  const { videoId } = req.body;
  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }
  res.status(200).json(new ApiResponse(200, video, "Video fetched"));
});

const editVideoMetadata = asyncHandler(async (req, res, next) => {
  const { videoId, title, description, isPublished } = req.body;
  const user = req.user;

  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }

  if (!title || !description || !isPublished) {
    throw new ApiError(400, "All fields are required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }

  if (user._id.toString() !== video.owner.toString()) {
    throw new ApiError(400, "You are not the owner of this video");
  }

  try {
    video.title = title;
    video.description = description;
    video.isPublished = isPublished;
    await video.save();

    res.status(200).json(new ApiResponse(200, video, "Video metadata updated"));
  } catch (error) {
    throw new ApiError(500, "Unable to update video's metadata");
  }
});

const editVideoThumbnail = asyncHandler(async (req, res, next) => {
  const thumbnailLocalPath = req.file?.path;
  const { videoId } = req.body;
  const user = req.user;

  if (!videoId) {
    throw new ApiError(400, "Video id is required");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video does not exist");
  }

  if (user._id.toString() !== video.owner.toString()) {
    throw new ApiError(400, "You are not the owner of this video");
  }
  //
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail file is required");
  }

  const thumbnailImage = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnailImage.url) {
    throw new ApiError(400, "Unable to upload cover file");
  }

  video.thumbnail = thumbnailImage.url;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Thumbnail updated successfully"));
});

module.exports = {
  addVideo,
  getVideosByUsers,
  getVideoDetails,
  editVideoMetadata,
  editVideoThumbnail,
};
