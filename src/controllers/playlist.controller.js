const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const mongoose = require("mongoose");
const Video = require("../models/video.model");
const User = require("../models/user.model");

const createPlaylist = asyncHandler(async (req, res, next) => {});
const addVideoInPlaylist = asyncHandler(async (req, res, next) => {});
const removeVideoInPlaylist = asyncHandler(async (req, res, next) => {});
const getPlaylist = asyncHandler(async (req, res, next) => {});
const updatePlaylistMetaData = asyncHandler(async (req, res, next) => {});
const deletePlaylist = asyncHandler(async (req, res, next) => {});

module.exports = {
  createPlaylist,
  addVideoInPlaylist,
  removeVideoInPlaylist,
  getPlaylist,
  updatePlaylistMetaData,
  deletePlaylist,
};
