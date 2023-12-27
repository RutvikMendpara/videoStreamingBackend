const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { validateEmail, validatePassword } = require("../utils/validator");
const User = require("../models/user.model");
const uploadOnCloudinary = require("../utils/cloudinary");
const ApiResponse = require("../utils/ApiResponse");

// controllers

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;

  // check if user has not provided empty fields
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!validateEmail(email)) {
    throw new ApiError(400, "Invalid email");
  }

  if (!validatePassword(password)) {
    throw new ApiError(
      400,
      "Invalid password. Password should be between minimum 8 and maximum 10 characters. It should contain at least one uppercase letter, one lowercase letter, one number and one special character."
    );
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with username or email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath = "";
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Unable to upload avatar file");
  }

 
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

 
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );


  if (!createdUser) {
    throw new ApiError(500, "Unable to register user");
  }

 
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

module.exports = { registerUser };
