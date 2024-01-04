const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const Playlist = require("../models/playlist.model");
const mongoose = require("mongoose");
const Video = require("../models/video.model");
const User = require("../models/user.model");
const { ObjectId } = require("mongodb");

const createPlaylist = asyncHandler(async (req, res, next) => {
  const owner = req.user._id;
  const { name, description } = req.body;
  let { isPublic } = req.body;
  if (!name || !description || !isPublic) {
    throw ApiError(400, "Name, playlist status and description are required");
  }

  isPublic = isPublic === "true" ? true : false;

  try {
    const playlist = await Playlist.create({
      name,
      description,
      owner,
      isPublic,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "playlist created successfully"));
  } catch (error) {
    throw ApiError(500, "Something went wrong during creating playlist");
  }
});

const addVideoInPlaylist = asyncHandler(async (req, res, next) => {
  const owner = req.user._id;
  const { playlistId, videoId } = req.body;

  if (!playlistId || !videoId) {
    return next(new ApiError(400, "Playlist id and video id are required"));
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (!playlist.owner.equals(owner)) {
    throw new ApiError(403, "You are not owner of this playlist");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const videoIdToCheck = video._id;

  if (playlist.videos.some((video) => video._id.equals(videoIdToCheck))) {
    throw new ApiError(400, "Video already added in playlist");
  }

  try {
    playlist.videos.push(video._id);
    await playlist.save();

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Video added in playlist"));
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong during adding video in playlist"
    );
  }
});

const removeVideoInPlaylist = asyncHandler(async (req, res, next) => {
  const owner = req.user._id;
  const { playlistId, videoId } = req.body;

  if (!playlistId || !videoId) {
    new ApiError(400, "Playlist id and video id are required");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (!playlist.owner.equals(owner)) {
    throw new ApiError(403, "You are not owner of this playlist");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const videoIdToCheck = video._id;

  if (!playlist.videos.some((video) => video._id.equals(videoIdToCheck))) {
    throw new ApiError(400, "Video not found in playlist");
  }

  try {
    playlist.videos.remove(video._id);
    await playlist.save();

    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Video removed in playlist"));
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong during adding video in playlist"
    );
  }
});

const getPlaylist = asyncHandler(async (req, res, next) => {
  const { playlistId } = req.body;
  if (!playlistId) {
    throw new ApiError(400, "Playlist id is required");
  }

  let playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  try {
    const fetchedPlaylist = await Playlist.aggregate([
      {
        $match: { _id: playlist._id },
      },
      {
        $lookup: {
          from: "videos",
          localField: "videos",
          foreignField: "_id",
          as: "videosData",
        },
      },
      {
        $unwind: "$videosData",
      },
      {
        $lookup: {
          from: "users",
          localField: "videosData.owner",
          foreignField: "_id",
          as: "videoOwnerData",
        },
      },
      {
        $unwind: "$videoOwnerData",
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerData",
        },
      },
      {
        $unwind: "$ownerData",
      },
      {
        $group: {
          _id: "$_id",
          playlistName: { $first: "$name" },
          playlistDescription: { $first: "$description" },
          playlistOwnerName: { $first: "$ownerData.fullName" },
          playlistCreatedAt: { $first: "$createdAt" },
          videos: {
            $push: {
              videoThumbnail: "$videosData.thumbnail",
              videoDuration: "$videosData.duration",
              videoTitle: "$videosData.title",
              videoCreatedAt: "$videosData.createdAt",
              videoViews: "$videosData.views",
              videoOwnerName: "$videoOwnerData.fullName",
              videoOwnerAvatar: "$videoOwnerData.avatar",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          playlistName: 1,
          playlistDescription: 1,
          playlistOwnerName: 1,
          playlistCreatedAt: 1,
          videos: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, fetchedPlaylist, "Playlist fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong during fetching playlist");
  }
});

const updatePlaylistMetaData = asyncHandler(async (req, res, next) => {
  const owner = req.user;
  const { playlistId, name, description, isPublic } = req.body;

  if (!playlistId) {
    throw new ApiError(400, "Playlist id is required");
  }
  if (!name && !description && !isPublic) {
    throw new ApiError(400, "Name, description or playlist status is required");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist.owner.equals(owner._id)) {
    throw new ApiError(403, "You are not owner of this playlist");
  }

  if (name) {
    playlist.name = name;
  }

  if (description) {
    playlist.description = description;
  }

  if (isPublic) {
    playlist.isPublic = isPublic;
  }

  try {
    await playlist.save();
    return res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong during updating playlist");
  }
});
const deletePlaylist = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { playlistId } = req.body;

  if (!playlistId) {
    throw new ApiError(400, "Playlist id is required");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (!playlist.owner.equals(user._id)) {
    throw new ApiError(403, "You are not owner of this playlist");
  }
  ``;
  try {
    await playlist.deleteOne({ _id: playlistId });
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Playlist deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong during deleting playlist");
  }
});

module.exports = {
  createPlaylist,
  addVideoInPlaylist,
  removeVideoInPlaylist,
  getPlaylist,
  updatePlaylistMetaData,
  deletePlaylist,
};
