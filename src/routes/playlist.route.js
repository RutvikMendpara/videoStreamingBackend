const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware");

const {
  createPlaylist,
  addVideoInPlaylist,
  removeVideoInPlaylist,
  getPlaylist,
  updatePlaylistMetaData,
  deletePlaylist,
} = require("../controllers/playlist.controller");

router.route("/create-playlist").post(verifyJWT, createPlaylist);
router.route("/add-video-playlist").post(verifyJWT, addVideoInPlaylist);
router.route("/remove-video-playlist").delete(verifyJWT, removeVideoInPlaylist);
router.route("/playlist").get(verifyJWT, getPlaylist);
router.route("/update-playlist-data").patch(verifyJWT, updatePlaylistMetaData);
router.route("/remove-playlist").delete(verifyJWT, deletePlaylist);

module.exports = router;
