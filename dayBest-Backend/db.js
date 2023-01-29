const mongoose = require("mongoose");

const connectDB = () => {
  var connectionOptions = {
    useNewUrlParser: true,
    connectTimeoutMS: 300000, // 5 minutes
    useUnifiedTopology: true,
  };

  mongoose.set("strictQuery", false);
  
  mongoose.connect(process.env.DB, connectionOptions, function (err) {
    if (err) console.info(err);
  });
  mongoose.connection.on("connecting", function () {
    console.info("Connecting to MongoDB...");
  });
  mongoose.connection.on("connected", function () {
    console.info("MongoDB connected!");
  });
  mongoose.connection.on("open", function () {
    console.info("MongoDB connection opened!");
  });
  mongoose.connection.on("error", function (err) {
    console.info(err);
    mongoose.disconnect();
  });
  mongoose.connection.on("disconnected", function () {
    console.info("MongoDB disconnected!");
    mongoose.connect(process.env.DB, connectionOptions, function (err) {
      if (err) console.info(err);
    });
  });
  mongoose.connection.on("reconnected", function () {
    console.info("MongoDB reconnected!");
  });
  mongoose.connection.on("close", function () {
    console.info("MongoDB closed");
  });
};

module.exports = connectDB;
