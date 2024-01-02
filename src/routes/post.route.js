const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware");

const {
  createPost,
  editPost,
  DeletePost,
  getAllPostsByUser,
} = require("../controllers/post.controller");

router.route("/create-post").post(verifyJWT, createPost);
router.route("/edit-post").patch(verifyJWT, editPost);
router.route("/delete-post").delete(verifyJWT, DeletePost);
router.route("/get-all-posts").get(verifyJWT, getAllPostsByUser);

module.exports = router;
