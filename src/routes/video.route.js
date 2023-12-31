const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");
const { addVideo } = require("../controllers/video.controller");

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
module.exports = router;
