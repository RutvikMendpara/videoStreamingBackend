const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware");
const { addComment } = require("../controllers/comment.controller");

router.route("/add-comment").post(verifyJWT, addComment);
module.exports = router;
