const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGINS,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("../public"));

// routes import

const def = require("./routes/default.route");
const userRouter = require("./routes/user.route");
const commentRouter = require("./routes/comment.route");
const videoRouter = require("./routes/video.route");
const likeRouter = require("./routes/like.route");
const postRouter = require("./routes/post.route");
const playlistRouter = require("./routes/playlist.route");
const searchRouter = require("./routes/search.route");

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/search", searchRouter);
app.use("/", def);

module.exports = app;
