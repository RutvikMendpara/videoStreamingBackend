const router = require("express").Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} = require("../controllers/user.controller");

const verifyJWT = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

// secure route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

module.exports = router;
