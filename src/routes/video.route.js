const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");
const {
  addVideo,
  getVideosByUsers,
} = require("../controllers/video.controller");

router.route("/upload-video").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  addVideo
);

router.route("/videos").get(verifyJWT, getVideosByUsers);
module.exports = router;
