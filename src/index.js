require("dotenv").config();
const mongoose = require("mongoose");
const DB_NAME = require("./constants");
const connectDB = require("./db/DB");
const app = require("./app");

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server started on PORT : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB connection error", error);
  });
