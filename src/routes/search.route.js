const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware");
const { GetVideosBySearch } = require("../controllers/search.controller");

router.route("/").get(verifyJWT, GetVideosBySearch);

module.exports = router;
