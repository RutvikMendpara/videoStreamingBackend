const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // Upload file on Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded
    // console.log("File uploaded successfully", response.url);
    fs.unlinkSync(localFilePath); // remove temp file from local storage
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove temp file from local storage
    return null;
  }
};

module.exports = uploadOnCloudinary;
