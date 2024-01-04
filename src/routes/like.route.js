const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware");
const {
  updateLikeOnVideo,
  getAllLikesOnVideo,
  updateLikeOnComment,
  getAllTotalLikesOnComment,
  updateLikeOnPost,
  getAllLikesOnPost,
} = require("../controllers/like.controller");

router.route("/update-video-like").post(verifyJWT, updateLikeOnVideo);
router.route("/get-all-video-likes").get(verifyJWT, getAllLikesOnVideo);

router.route("/update-comment-like").post(verifyJWT, updateLikeOnComment);
router
  .route("/get-all-comment-likes")
  .get(verifyJWT, getAllTotalLikesOnComment);

router.route("/update-post-like").post(verifyJWT, updateLikeOnPost);
router.route("/get-all-post-likes").get(verifyJWT, getAllLikesOnPost);

module.exports = router;
