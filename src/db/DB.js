const mongoose = require("mongoose");
const DB_NAME = require("../constants");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}`
    );

    console.log(
      `MONGODB connection successful :: DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};

module.exports = connectDB;
