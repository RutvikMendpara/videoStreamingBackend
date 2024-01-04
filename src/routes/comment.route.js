const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware");
const {
  addComment,
  updateComment,
  getAllComments,
  deleteComment,
} = require("../controllers/comment.controller");

router.route("/add-comment").post(verifyJWT, addComment);
router.route("/edit-comment").patch(verifyJWT, updateComment);
router.route("/all-comments").get(verifyJWT, getAllComments);
router.route("/delete-comments").delete(verifyJWT, deleteComment);
module.exports = router;
