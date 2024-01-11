const router = require("express").Router();

router.route("/").get((req, res) => {
  res.send("Hello World!");
});

router.route("*").get((req, res) => {
  res.status(404).send("404 Not Found");
});

module.exports = router;
