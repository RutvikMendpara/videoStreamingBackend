const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware");
const {
  addComment,
  updateComment,
  getAllComments,
} = require("../controllers/comment.controller");

router.route("/add-comment").post(verifyJWT, addComment);
router.route("/edit-comment").patch(verifyJWT, updateComment);
router.route("/all-comments").get(verifyJWT, getAllComments);
module.exports = router;
